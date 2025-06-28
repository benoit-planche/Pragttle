use bigdecimal::BigDecimal;
use bigdecimal::ToPrimitive;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use validator::Validate;

#[derive(Debug, FromRow)]
pub struct Post {
    pub id: i32,
    pub content: String,
    pub author_id: i32,
    pub likes_count: Option<i32>,
    pub comments_count: Option<i32>,
    pub shares_count: Option<i32>,
    pub is_verified_by_ai: Option<bool>,
    pub ai_verification_score: Option<BigDecimal>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, FromRow)]
pub struct PostWithAuthor {
    pub id: i32,
    pub content: String,
    pub author_id: i32,
    pub author_name: String,
    pub author_username: String,
    pub author_avatar_url: Option<String>,
    pub likes_count: Option<i32>,
    pub comments_count: Option<i32>,
    pub shares_count: Option<i32>,
    pub is_verified_by_ai: Option<bool>,
    pub ai_verification_score: Option<BigDecimal>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize)]
pub struct PostWithAuthorResponse {
    pub id: i32,
    pub content: String,
    pub author_id: i32,
    pub author_name: String,
    pub author_username: String,
    pub author_avatar_url: Option<String>,
    pub likes_count: i32,
    pub comments_count: i32,
    pub shares_count: i32,
    pub is_verified_by_ai: bool,
    pub ai_verification_score: Option<f64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<PostWithAuthor> for PostWithAuthorResponse {
    fn from(post: PostWithAuthor) -> Self {
        Self {
            id: post.id,
            content: post.content,
            author_id: post.author_id,
            author_name: post.author_name,
            author_username: post.author_username,
            author_avatar_url: post.author_avatar_url,
            likes_count: post.likes_count.unwrap_or(0),
            comments_count: post.comments_count.unwrap_or(0),
            shares_count: post.shares_count.unwrap_or(0),
            is_verified_by_ai: post.is_verified_by_ai.unwrap_or(false),
            ai_verification_score: post.ai_verification_score.and_then(|b| b.to_f64()),
            created_at: post.created_at.unwrap_or_else(|| Utc::now()),
            updated_at: post.updated_at.unwrap_or_else(|| Utc::now()),
        }
    }
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreatePostRequest {
    #[validate(length(
        min = 1,
        max = 500,
        message = "Post content must be between 1 and 500 characters"
    ))]
    pub content: String,
}

#[derive(Debug, Serialize)]
pub struct CreatePostResponse {
    pub id: i32,
    pub content: String,
    pub author_id: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct PostListResponse {
    pub posts: Vec<PostWithAuthorResponse>,
    pub total: i64,
    pub page: i32,
    pub per_page: i32,
}

#[derive(Debug, Deserialize)]
pub struct GetPostsQuery {
    pub page: Option<i32>,
    pub per_page: Option<i32>,
    pub author_id: Option<i32>,
}
