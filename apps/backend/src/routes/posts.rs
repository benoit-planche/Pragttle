use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::Json,
};
use chrono::Utc;
use validator::Validate;

use crate::models::post::{CreatePostRequest, CreatePostResponse, GetPostsQuery, PostListResponse};
use crate::services::PostService;
use std::sync::Arc;

pub async fn get_posts(
    State(post_service): State<Arc<PostService>>,
    Query(query): Query<GetPostsQuery>,
) -> Result<Json<PostListResponse>, StatusCode> {
    match post_service.get_posts(query).await {
        Ok(response) => Ok(Json(response)),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn create_post(
    State(post_service): State<Arc<PostService>>,
    Json(payload): Json<CreatePostRequest>,
) -> Result<Json<CreatePostResponse>, StatusCode> {
    // Validate the request
    if payload.validate().is_err() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // TODO: Get author_id from JWT token
    let author_id = 1; // Mock user ID for now

    match post_service.create_post(payload, author_id).await {
        Ok(post) => {
            let response = CreatePostResponse {
                id: post.id,
                content: post.content,
                author_id: post.author_id,
                created_at: post.created_at.unwrap_or_else(|| Utc::now()),
            };
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn like_post(
    State(post_service): State<Arc<PostService>>,
    axum::extract::Path(post_id): axum::extract::Path<i32>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // TODO: Get user_id from JWT token
    let user_id = 1; // Mock user ID for now

    match post_service.like_post(post_id, user_id).await {
        Ok(liked) => {
            let response = serde_json::json!({
                "success": true,
                "liked": liked,
                "message": if liked { "Post liked successfully" } else { "Post already liked" }
            });
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn unlike_post(
    State(post_service): State<Arc<PostService>>,
    axum::extract::Path(post_id): axum::extract::Path<i32>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // TODO: Get user_id from JWT token
    let user_id = 1; // Mock user ID for now

    match post_service.unlike_post(post_id, user_id).await {
        Ok(unliked) => {
            let response = serde_json::json!({
                "success": true,
                "unliked": unliked,
                "message": if unliked { "Post unliked successfully" } else { "Post not liked" }
            });
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
} 