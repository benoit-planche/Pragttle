use axum::{
    http::StatusCode,
    response::Json,
};
use validator::Validate;

use crate::models::{AuthResponse, LoginRequest, RegisterRequest, UserResponse};
use chrono::Utc;

pub async fn register(
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, StatusCode> {
    // Validate the request
    if payload.validate().is_err() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Mock response for now - will be replaced with database operations
    let user = UserResponse {
        id: 1, // Mock user ID
        username: payload.username,
        email: payload.email,
        name: payload.name,
        avatar_url: None,
        created_at: Utc::now(),
    };

    let response = AuthResponse {
        token: "mock_jwt_token".to_string(), // Will be generated with JWT
        user,
    };

    Ok(Json(response))
}

pub async fn login(
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, StatusCode> {
    // Mock authentication for now
    if payload.username == "admin" && payload.password == "password" {
        let user = UserResponse {
            id: 1, // Mock user ID
            username: payload.username,
            email: "admin@pragttle.local".to_string(),
            name: "Administrator".to_string(),
            avatar_url: None,
            created_at: Utc::now(),
        };

        let response = AuthResponse {
            token: "mock_jwt_token".to_string(),
            user,
        };

        Ok(Json(response))
    } else {
        Err(StatusCode::UNAUTHORIZED)
    }
} 