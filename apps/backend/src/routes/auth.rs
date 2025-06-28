use axum::{
    http::StatusCode,
    response::Json,
};
use validator::Validate;

use crate::models::{AuthResponse, LoginRequest, RegisterRequest, UserResponse};
use uuid::Uuid;
use chrono::Utc;

pub async fn register(
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, StatusCode> {
    // Validate the request
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Mock response for now - will be replaced with database operations
    let user = UserResponse {
        id: Uuid::new_v4(),
        username: payload.username,
        email: payload.email,
        bio: None,
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
            id: Uuid::new_v4(),
            username: payload.username,
            email: "admin@pragttle.local".to_string(),
            bio: Some("Pragttle Administrator".to_string()),
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