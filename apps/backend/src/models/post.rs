use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Post {
    pub id: Uuid,
    pub content: String,
    pub author_id: Uuid,
    pub author_username: String,
    pub likes_count: i32,
    pub comments_count: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreatePostRequest {
    #[validate(length(
        min = 1,
        max = 280,
        message = "Post content must be between 1 and 280 characters"
    ))]
    pub content: String,
}

#[derive(Debug, Serialize)]
pub struct CreatePostResponse {
    pub id: Uuid,
    pub content: String,
    pub author_id: Uuid,
    pub author_username: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct PostListResponse {
    pub posts: Vec<Post>,
    pub total: i64,
    pub page: i32,
    pub per_page: i32,
}

#[derive(Debug, Deserialize)]
pub struct GetPostsQuery {
    pub page: Option<i32>,
    pub per_page: Option<i32>,
    #[allow(dead_code)]
    pub author_id: Option<Uuid>,
}
