use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::{CorsLayer, Any};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::signal;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use axum::http::Method;
use axum::http::header::{CONTENT_TYPE, AUTHORIZATION};

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

    // Initialize database
    println!("🗄️ Initializing database connection...");
    let database = match db::Database::new().await {
        Ok(db) => {
            println!("✅ Database connected successfully");
            Arc::new(db)
        }
        Err(e) => {
            println!("❌ Failed to connect to database: {e}");
            tracing::error!("❌ Failed to connect to database: {e}");
            std::process::exit(1);
        }
    };

    // Initialize services
    println!("🔧 Initializing services...");
    let post_service = Arc::new(services::PostService::new(database.clone()));
    println!("✅ Services initialized");

    println!("🔧 Building application routes...");
    
    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([CONTENT_TYPE, AUTHORIZATION])
        .allow_credentials(false);
    
    // Build our application with routes
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health))
        // Auth routes
        .route("/api/auth/register", post(routes::auth::register))
        .route("/api/auth/login", post(routes::auth::login))
        // Posts routes
        .route("/api/posts", get(routes::posts::get_posts))
        .route("/api/posts", post(routes::posts::create_post))
        .route("/api/posts/:id/like", post(routes::posts::like_post))
        .route("/api/posts/:id/unlike", post(routes::posts::unlike_post))
        .layer(cors)
        .with_state(post_service);

    println!("✅ Routes built");

    // Run it
    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    println!("🌐 Binding to {addr}");
    tracing::info!("🚀 Pragttle Backend starting on {addr}");
    
    match tokio::net::TcpListener::bind(addr).await {
        Ok(listener) => {
            println!("✅ Server bound to {addr}");
            tracing::info!("✅ Server bound to {addr}");
            
            // Start the server with graceful shutdown
            if let Err(e) = axum::serve(listener, app)
                .with_graceful_shutdown(shutdown_signal())
                .await 
            {
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
    
    println!("🛑 Server shutting down gracefully...");
    tracing::info!("🛑 Server shutting down gracefully...");
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            println!("📡 Received Ctrl+C, shutting down...");
            tracing::info!("📡 Received Ctrl+C, shutting down...");
        },
        _ = terminate => {
            println!("📡 Received SIGTERM, shutting down...");
            tracing::info!("📡 Received SIGTERM, shutting down...");
        },
    }
}

async fn root() -> &'static str {
    "🧠🔥 Pragttle Backend API - Welcome to the future of social media!"
}

async fn health() -> &'static str {
    "OK"
}