mod video_stream;
mod chat;

use crate::video_stream::stream_video;
use actix_web::{web, App, HttpServer};
use tracing_actix_web::TracingLogger;
use tracing_subscriber::fmt::format::FmtSpan;
use crate::chat::{chat_handler, ChatServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Init logging
    tracing_subscriber::fmt()
        .with_span_events(FmtSpan::ENTER | FmtSpan::CLOSE)
        .init();

    let chat_server = ChatServer::new();

    // println!("🚀 Streaming server running at http://localhost:8080");

    HttpServer::new(move || {
            App::new()
            .wrap(TracingLogger::default()).app_data(web::Data::new(chat_server.clone()))
            .service(stream_video)
            .service(
                web::resource("/ws/{room_id}")
                    .route(web::get().to(chat_handler))
            )
    })
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}

