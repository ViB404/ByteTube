use actix::prelude::*;

use actix_web::web;
use actix_web::Error;
use actix_web::HttpRequest;
use actix_web::HttpResponse;

use actix_web_actors::ws;

use std::collections::HashMap;

use std::sync::Arc;
use std::sync::Mutex;

use serde::Serialize;
use serde::Deserialize;

use chrono;

// Defining the structure of the chat messages
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ChatMessage {
    pub user: String,
    pub text: String,
    pub timestamp: String,
}

// Internal message used inside Actix actors to pass serialized strings around
#[derive(Message, Clone)]
#[rtype(result = "()")]
struct WsMessage(String);

// Structure the rooms with Arc and Mutex to make them thread-safe
#[derive(Clone)]
pub struct ChatServer {
    rooms: Arc<Mutex<HashMap<String, Vec<Recipient<WsMessage>>>>>, 
}

// Implementing the ChatServer
impl ChatServer {
    
    // Create a new ChatServer
    pub fn new() -> Self {
        ChatServer {
            rooms: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    // Add a user to a room
    fn add_client(&self, room_id: &str, recipient: Recipient<WsMessage>) {
        let mut rooms = self.rooms.lock().unwrap();
        rooms.entry(room_id.to_string())
            .or_insert_with(Vec::new)
            .push(recipient);
    }
    
    // Remove a user from the room
    fn remove_client(&self, room_id: &str, recipient: &Recipient<WsMessage>) {
        let mut rooms = self.rooms.lock().unwrap();
        if let Some(clients) = rooms.get_mut(room_id) {
            // Retain only remove the recipient who match r != recipient             
            clients.retain(|r| r != recipient);
        }
    }

    // Broadcast message to all users in the room
    fn broadcast(&self, room_id: &str, message: &str) {
        let rooms = self.rooms.lock().unwrap();
        if let Some(clients) = rooms.get(room_id) {
            let msg = WsMessage(message.to_string());
            for client in clients {
                client.do_send(msg.clone());
            }
        }
    }
}

// Each websocket connection is a "session" — this struct represents that connection
// One user -> One session -> One Room
struct WsSession {
    room_id: String,
    server: ChatServer,
}

impl WsSession {
    fn new(room_id: String, server: ChatServer) -> Self {
        WsSession { room_id, server }
    }
}

// Implementing the Actor trait for WsSession
// Now, they can Ping, Receive, Send, and Stop
impl Actor for WsSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        // Join the chat room
        self.server.add_client(&self.room_id, ctx.address().recipient());

        // Say hello to the new client (to keep the connection from closing immediately)
        // Some modern browsers will close the connection if they receive no data for 30 seconds
        let welcome = ChatMessage {
            user: "System".to_string(),
            text: format!("🟢 Welcome to room: {}", self.room_id),
            timestamp: chrono::Utc::now().to_rfc3339(),
        };
        ctx.text(serde_json::to_string(&welcome).unwrap());

        // Keep-alive pings every 30 seconds so the connection doesn't die silently
        ctx.run_interval(std::time::Duration::from_secs(30), |_, ctx| {
            ctx.ping(b"heartbeat");
        });
    }

    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        // Remove user when they're ghosting
        // This is not strictly necessary, but it's a good practice to clean up after yourself
        self.server.remove_client(&self.room_id, &ctx.address().recipient());
        Running::Stop
    }
}

// Handles incoming WebSocket messages from the frontend
impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WsSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                // Try parsing into ChatMessage, else send back an error
                match serde_json::from_str::<ChatMessage>(&text) {
                    Ok(parsed_msg) => {
                        let json = serde_json::to_string(&parsed_msg).unwrap();
                        self.server.broadcast(&self.room_id, &json);
                    }
                    Err(_) => {
                        let err_msg = ChatMessage {
                            user: "System".into(),
                            text: "⚠️ Invalid message format.".into(),
                            timestamp: chrono::Utc::now().to_rfc3339(),
                        };
                        ctx.text(serde_json::to_string(&err_msg).unwrap());
                    }
                }
            }
            
            Ok(ws::Message::Ping(ping)) => ctx.pong(&ping), // Ping-pong to keep connection healthy
            // Close the connection when the client sends a close message
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            _ => (), // Ignore other stuff for now (I am lazy to do it)
        }
    }
}

// Delivering messages from server to clients
impl Handler<WsMessage> for WsSession {
    type Result = ();

    fn handle(&mut self, msg: WsMessage, ctx: &mut Self::Context) {
        ctx.text(msg.0); // Send the message over WebSocket
    }
}

// The HTTP entrypoint to upgrade to a WebSocket connection
pub async fn chat_handler(
    req: HttpRequest,
    stream: web::Payload,
    server: web::Data<ChatServer>,
    path: web::Path<String>,
) -> Result<HttpResponse, Error> {
    let room_id = path.into_inner();
    println!("WS CONNECT: room_id = {}", room_id);

    // Upgrade the HTTP request to a WebSocket connection
    ws::start(WsSession::new(room_id, server.get_ref().clone()), &req, stream)
}
