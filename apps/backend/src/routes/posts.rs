use axum::{
    extract::Query,
    http::StatusCode,
    response::Json,
};
use chrono::Utc;
use uuid::Uuid;
use validator::Validate;

use crate::models::{CreatePostRequest, CreatePostResponse, GetPostsQuery, Post, PostListResponse};

// Mock data for now - will be replaced with database queries
pub async fn get_posts(
    Query(query): Query<GetPostsQuery>,
) -> Result<Json<PostListResponse>, StatusCode> {
    let page = query.page.unwrap_or(1);
    let per_page = query.per_page.unwrap_or(10).min(50); // Max 50 posts per page

    // Mock posts for now
    let mock_posts = vec![
        Post {
            id: Uuid::new_v4(),
            content: "🧠🔥 Welcome to RAGnagna! The future of social media is here!".to_string(),
            author_id: Uuid::new_v4(),
            author_username: "ragna_admin".to_string(),
            likes_count: 42,
            comments_count: 7,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
        Post {
            id: Uuid::new_v4(),
            content: "Just testing the new platform. Loving the clean interface! 🚀".to_string(),
            author_id: Uuid::new_v4(),
            author_username: "test_user".to_string(),
            likes_count: 15,
            comments_count: 3,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        },
    ];

    let response = PostListResponse {
        posts: mock_posts,
        total: 2,
        page,
        per_page,
    };

    Ok(Json(response))
}

pub async fn create_post(
    Json(payload): Json<CreatePostRequest>,
) -> Result<Json<CreatePostResponse>, StatusCode> {
    // Validate the request
    if let Err(_) = payload.validate() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Mock response for now - will be replaced with database insertion
    let response = CreatePostResponse {
        id: Uuid::new_v4(),
        content: payload.content,
        author_id: Uuid::new_v4(), // Will come from JWT token
        author_username: "current_user".to_string(), // Will come from JWT token
        created_at: Utc::now(),
    };

    Ok(Json(response))
} 