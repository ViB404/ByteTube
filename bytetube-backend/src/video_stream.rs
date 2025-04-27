use actix_web::HttpResponse;
use actix_web::get;
use actix_web::web;
use actix_web::HttpRequest;
use actix_web::Responder;
use actix_web::ResponseError;

use actix_web::http::header;
use actix_web::http::StatusCode;

use actix_web::error::ErrorInternalServerError;

use thiserror::Error;

use crate::video_stream::VideoStreamError::InvalidRangeHeader;

use reqwest::Client;

// Define a custom error type
#[derive(Error, Debug)]
pub enum VideoStreamError {
    #[error("Error opening file: {0}")]
    FileOpenError(#[from] std::io::Error),

    #[error("Invalid Range header")]
    InvalidRangeHeader(String),
}

// Implement ResponseError for VideoStreamError
impl ResponseError for VideoStreamError {
    fn error_response(&self) -> HttpResponse {
        match self {
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
    let client = Client::new();

    // Get the video info from the supabase bucket
    // Hard-encoding this so that you can change it to any other provider 
    // Make sure that it fetches .mp4 because content type is already hard-encoding 
    let url_of_the_file = format!("https://wpvbeslwdiyorzkrmeed.supabase.co/storage/v1/object/public/videos//{}.mp4", id);

    // Fetching the video and converting it into the bytes
    let resp = client.get(&url_of_the_file).send().await.map_err(|e| {ErrorInternalServerError(e.to_string())})?;
    let file_bytes = resp.bytes().await.map_err(|e| {ErrorInternalServerError(e.to_string())})?;


    // Get the file size and content type
    let file_size = file_bytes.len() as u64;
    
    // Hard-encoding the content-type
    let content_type = "video/mp4";

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
            let chunk = file_bytes.slice(start as usize..=end as usize);

            // Return the partial content response
            return Ok(HttpResponse::build(StatusCode::PARTIAL_CONTENT)
                .insert_header((header::CONTENT_TYPE, content_type))
                .insert_header((header::CONTENT_LENGTH, chunk.len().to_string()))
                .insert_header((header::CONTENT_RANGE, format!("bytes {}-{}/{}", start, end, file_size)))
                .body(chunk));
        }
    }

    // No range header => sends the whole file
    Ok(HttpResponse::Ok()
        .insert_header((header::CONTENT_TYPE, content_type))
        .insert_header((header::CONTENT_LENGTH, file_size.to_string()))
        .body(file_bytes))
}