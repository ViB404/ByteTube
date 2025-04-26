# ===== Stage 1: Builder =====
FROM rustlang/rust:nightly-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev build-essential ca-certificates

# Set working directory
WORKDIR /app

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src
RUN echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy full project source
COPY . .

# Build the real release binary
RUN cargo build --release

# ===== Stage 2: Final Image =====
FROM debian:bullseye-slim

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the built binary from builder
COPY --from=builder /app/target/release/bytetube-backend /app/bytetube-backend

# Tell Railway/Fly that your app listens on 8080
EXPOSE 8080

# Command to run
CMD ["./bytetube-backend"]
