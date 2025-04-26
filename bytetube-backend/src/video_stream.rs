use actix_web::HttpResponse;
use actix_web::get;
use actix_web::web;
use actix_web::HttpRequest;
use actix_web::Responder;
use actix_web::ResponseError;

use actix_web::http::header;
use actix_web::http::StatusCode;

use actix_web::error::ErrorInternalServerError;

use std::fs::File;

use std::io::Seek;
use std::io::SeekFrom;
use std::io::Read;

use std::path::PathBuf;

use mime_guess::from_path;

use thiserror::Error;

use crate::video_stream::VideoStreamError::InvalidRangeHeader;

// Define a custom error type
#[derive(Error, Debug)]
pub enum VideoStreamError {
    #[error("File not found: {0}")]
    FileNotFound(String),

    #[error("Error opening file: {0}")]
    FileOpenError(#[from] std::io::Error),

    #[error("Invalid Range header")]
    InvalidRangeHeader(String),
}

// Implement ResponseError for VideoStreamError
impl ResponseError for VideoStreamError {
    fn error_response(&self) -> HttpResponse {
        match self {
            VideoStreamError::FileNotFound(id) => {
                HttpResponse::NotFound().body(format!("File not found: {}", id))
            }
            VideoStreamError::FileOpenError(_) => {
                HttpResponse::InternalServerError().body("Error opening the video file")
            }
            InvalidRangeHeader(_) => {
                HttpResponse::BadRequest().body("Invalid Range header")
            }
        }
    }
}

// Define the stream_video function
#[get("/api/video/{id}")]
pub async fn stream_video(req: HttpRequest, path: web::Path<String>) -> Result<impl Responder, actix_web::Error> {
    // Get the video id from the path
    let id = path.into_inner();

    // Construct the file path
    let file_path = format!("src/videos/{}.mp4", id);
    let path = PathBuf::from(&file_path);

    // Check if the file exists
    if !path.exists() {
        return Err(VideoStreamError::FileNotFound(id).into());
    }

    // Open the file
    let mut file = File::open(&path).map_err(|e| {
        ErrorInternalServerError(e)
    })?;

    // Get the file metadata
    let metadata = file.metadata().map_err(|e| {
        ErrorInternalServerError(e)
    })?;

    // Get the file size and content type
    let file_size = metadata.len();
    let content_type = from_path(&path).first_or_octet_stream().to_string();

    // Handle range request
    if let Some(range_header) = req.headers().get(header::RANGE) {
        let range_str = range_header.to_str().map_err(|_| {
            InvalidRangeHeader("Invalid Range header".to_string())
        })?;

        // Trimming byte and sending the video according to the bytes received from the frontend
        if range_str.starts_with("bytes=") {
            let range = range_str.trim_start_matches("bytes=");
            let parts: Vec<&str> = range.split('-').collect();

            let start = parts[0].parse::<u64>().unwrap_or(0);
            let end = if parts.len() > 1 && !parts[1].is_empty() {
                parts[1].parse::<u64>().unwrap_or(file_size - 1)
            } else {
                file_size - 1
            };

            // Validate the range
            if start >= file_size {
                return Ok(HttpResponse::build(StatusCode::RANGE_NOT_SATISFIABLE)
                    .insert_header((header::CONTENT_RANGE, format!("bytes */{}", file_size)))
                    .finish());
            }

            // Adjust the end value if it's larger than the file size
            let end = std::cmp::min(end, file_size - 1);

            // Seek to the start of the range
            file.seek(SeekFrom::Start(start)).map_err(|e| ErrorInternalServerError(e))?;

            // Calculate the chunk size
            let chunk_size = end - start + 1;

            // Read the chunk
            let mut chunk = vec![0; chunk_size as usize];
            file.read_exact(&mut chunk).map_err(|e| ErrorInternalServerError(e))?;

            // Return the partial content response
            return Ok(HttpResponse::build(StatusCode::PARTIAL_CONTENT)
                .insert_header((header::CONTENT_TYPE, content_type))
                .insert_header((header::CONTENT_LENGTH, chunk_size.to_string()))
                .insert_header((header::CONTENT_RANGE, format!("bytes {}-{}/{}", start, end, file_size)))
                .body(chunk));
        }
    }

    // No range header => send the whole file
    let mut whole_file = vec![0; file_size as usize];
    file.read_exact(&mut whole_file).map_err(|e| ErrorInternalServerError(e))?;

    Ok(HttpResponse::Ok()
        .insert_header((header::CONTENT_TYPE, content_type))
        .insert_header((header::CONTENT_LENGTH, file_size.to_string()))
        .body(whole_file))
}