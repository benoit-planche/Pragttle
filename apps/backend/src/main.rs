use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod auth;
mod db;
mod models;
mod routes;
mod services;

#[tokio::main]
async fn main() {
    println!("🚀 Starting Pragttle Backend...");
    
    // Initialize tracing
    println!("📝 Initializing tracing...");
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    println!("✅ Tracing initialized");
    tracing::info!("🚀 Starting Pragttle Backend...");

    println!("🔧 Building application routes...");
    // Build our application with routes
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health))
        // Auth routes
        .route("/api/auth/register", post(routes::auth::register))
        .route("/api/auth/login", post(routes::auth::login))
        // Posts routes
        .route("/api/posts", get(routes::posts::get_posts))
        .route("/api/posts", post(routes::posts::create_post));

    println!("✅ Routes built");

    // Run it
    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    println!("🌐 Binding to {addr}");
    tracing::info!("🚀 Pragttle Backend starting on {addr}");
    
    match tokio::net::TcpListener::bind(addr).await {
        Ok(listener) => {
            println!("✅ Server bound to {addr}");
            tracing::info!("✅ Server bound to {addr}");
            if let Err(e) = axum::serve(listener, app).await {
                println!("❌ Server error: {e}");
                tracing::error!("❌ Server error: {e}");
                std::process::exit(1);
            }
        }
        Err(e) => {
            println!("❌ Failed to bind to {addr}: {e}");
            tracing::error!("❌ Failed to bind to {addr}: {e}");
            std::process::exit(1);
        }
    }
}

async fn root() -> &'static str {
    "🧠🔥 Pragttle Backend API - Welcome to the future of social media!"
}

async fn health() -> &'static str {
    "OK"
}