# ===== Stage 1: Builder =====
FROM rustlang/rust:nightly-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    build-essential \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Cache dependencies (faster builds)
COPY Cargo.toml Cargo.lock ./
RUN mkdir src
RUN echo "fn main() {}" > src/main.rs
RUN cargo build --release || true
RUN rm -rf src

# Copy the full project
COPY . .

# Build the actual release binary
RUN cargo build --release

# ===== Stage 2: Final Runtime Image =====
FROM debian:bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the built binary from builder
COPY --from=builder /app/target/release/bytetube-backend /app/bytetube-backend

# Open port for Railway (or similar PaaS)
EXPOSE 8080

# Optional: Healthcheck (pro level)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:8080/health || exit 1

# Command to run
CMD ["./bytetube-backend"]
