# ByteTube

![ByteTube](https://img.shields.io/badge/ByteTube-Streaming%20Platform-blue?style=for-the-badge)
![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=flat-square&logo=rust&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=flat-square&logo=nextdotjs&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-Real--time-brightgreen?style=flat-square)

A high-performance video streaming platform built with Rust and Next.js, delivering YouTube/Twitch-like functionality with a focus on backend efficiency and scalability.

## 🚀 Overview

ByteTube demonstrates modern video streaming architecture with chunked video delivery, real-time chat capabilities, and a responsive dark-themed UI. The project emphasizes backend performance through Rust's efficiency while leveraging Next.js for a seamless frontend experience.

![ByteTube Screenshot](https://via.placeholder.com/800x450?text=ByteTube+Interface)

## ✨ Key Features

- **Optimized Video Streaming** using HTTP Range requests for efficient chunked delivery
- **Low-latency Global Chat** powered by WebSocket technology
- **Responsive Dark UI** with modern video controls and chat interface
- **Performance-first Backend** built entirely in Rust with Actix Web
- **Scalable Architecture** designed for future growth

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend Core** | Rust, Actix Web, Tokio |
| **Frontend** | Next.js, React, TailwindCSS |
| **Real-time Communication** | WebSockets (Actix actors) |
| **Video Delivery** | HTTP Range-based chunked streaming |
| **Deployment Options** | Railway, Render, Vercel |

## 🔍 Technical Implementation

### Backend Architecture
The Rust-powered backend is the heart of ByteTube, handling:

- **Video Chunking**: Implements HTTP `Range` headers to optimize bandwidth and startup time
- **WebSocket Management**: Robust connection lifecycle with ping/pong health checks
- **Actor System**: Scalable message broadcasting for real-time chat
- **Cross-Origin Resource Sharing**: Configured CORS for secure cross-domain requests
- **Transport Layer Security**: TLS implementation for secure communications

### Frontend Design
The Next.js frontend provides:

- **Responsive Video Player**: Adapts to different screen sizes with minimal buffering
- **Real-time Chat Interface**: Low-latency messaging with user presence indicators
- **Dark Theme UI**: Easy on the eyes for extended viewing sessions
- **Optimized Asset Loading**: Efficient resource management for faster page loads

## 🚦 Getting Started

### Prerequisites
- Rust (latest stable)
- Next.JS 13+
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/ViB404/bytetube.git

# Navigate to backend directory
cd bytetube/bytetube_backend

# Run the backend server
cargo run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd bytetube/bytetube_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Backend API: http://localhost:8080
- Frontend: http://localhost:3000

## 🌐 Deployment

### Backend Deployment
```bash
# Build optimized release
cd bytetube_backend
cargo build --release

# Run with production settings
./target/release/bytetube_backend
```

### Frontend Deployment
```bash
# Build production bundle
cd bytetube_frontend
npm run build

# Start production server
npm start
```

For cloud deployment:
- Backend: Railway.app or Render
- Frontend: Vercel
- Remember to update environment variables for production URLs

## 🧪 Architecture Insights

ByteTube demonstrates several key concepts in modern media streaming:

1. **Why Chunked Delivery Matters**: 
   - Reduces initial load time
   - Enables seeking without downloading entire video
   - Conserves bandwidth for both server and client

2. **WebSocket Implementation Details**:
   - Connection establishment and maintenance
   - Message serialization and broadcasting
   - Session management and cleanup

3. **Cross-Origin Considerations**:
   - Secure header configuration
   - Preflight request handling
   - Credential management

## 🤝 Contributing

Contributions are welcome! Areas that would benefit from community input:

- Performance optimizations for video processing
- Multi-room chat functionality
- Enhanced UI components
- Mobile responsiveness improvements

Please follow the standard fork, branch, and pull request workflow.

## 👤 Author

Built by: ViB
- GitHub: [@ViB404](https://github.com/ViB404)

*Backend Specialist. Frontend Delegator. Powered by curiosity and caffeine.*
