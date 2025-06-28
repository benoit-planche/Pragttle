# Build stage
FROM rust:alpine AS builder

# Install build dependencies
RUN apk add --no-cache musl-dev

WORKDIR /app

# Copy the entire project
COPY . .

# Build the application
RUN cargo build --release

# Production stage
FROM debian:bullseye-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/pragttle-backend /app/pragttle-backend
RUN chmod +x /app/pragttle-backend 

# Expose port
EXPOSE 4000

# Start the application with debugging
CMD ["./pragttle-backend"]
