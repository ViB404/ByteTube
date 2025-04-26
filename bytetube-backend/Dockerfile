# ===== Stage 1: Builder =====
FROM rust:1.78-slim as builder

# Install required packages
RUN apt-get update && apt-get install -y pkg-config libssl-dev build-essential ca-certificates

# Set working directory
WORKDIR /app

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src
RUN echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy the rest of your source code
COPY . .

# Build your actual app now
RUN cargo build --release

# ===== Stage 2: Runner =====
FROM ubuntu:22.04

# Install only necessary runtime libraries
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the compiled binary from builder stage
COPY --from=builder /app/target/release/bytetube-backend /app/bytetube-backend

# Tell Railway the app listens on port 8080
EXPOSE 8080

# Run the app
CMD ["./bytetube-backend"]
