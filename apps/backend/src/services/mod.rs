use crate::db::Database;
use crate::models::post::{Post, PostWithAuthor, PostWithAuthorResponse, CreatePostRequest, PostListResponse, GetPostsQuery};
use std::sync::Arc;

pub struct PostService {
    db: Arc<Database>,
}

impl PostService {
    pub fn new(db: Arc<Database>) -> Self {
        PostService { db }
    }

    pub async fn create_post(&self, request: CreatePostRequest, author_id: i32) -> Result<Post, sqlx::Error> {
        let pool = self.db.get_pool();
        
        let post = sqlx::query_as!(
            Post,
            r#"
            INSERT INTO posts (content, author_id)
            VALUES ($1, $2)
            RETURNING id, content, author_id, likes_count, comments_count, shares_count, 
                      is_verified_by_ai, ai_verification_score, created_at, updated_at
            "#,
            request.content,
            author_id
        )
        .fetch_one(pool)
        .await?;

        Ok(post)
    }

    pub async fn get_posts(&self, query: GetPostsQuery) -> Result<PostListResponse, sqlx::Error> {
        let pool = self.db.get_pool();
        let page = query.page.unwrap_or(1);
        let per_page = query.per_page.unwrap_or(10).min(50);
        let offset = (page - 1) * per_page;

        let posts_with_authors = sqlx::query_as!(
            PostWithAuthor,
            r#"
            SELECT 
                p.id, p.content, p.author_id, p.likes_count, p.comments_count, p.shares_count,
                p.is_verified_by_ai, p.ai_verification_score, p.created_at, p.updated_at,
                u.name as author_name, u.username as author_username, u.avatar_url as author_avatar_url
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE ($1::int IS NULL OR p.author_id = $1)
            ORDER BY p.created_at DESC
            LIMIT $2::bigint OFFSET $3::bigint
            "#,
            query.author_id,
            per_page as i64,
            offset as i64
        )
        .fetch_all(pool)
        .await?;

        let total = sqlx::query!(
            r#"
            SELECT COUNT(*) as count
            FROM posts p
            WHERE ($1::int IS NULL OR p.author_id = $1)
            "#,
            query.author_id
        )
        .fetch_one(pool)
        .await?
        .count
        .unwrap_or(0);

        Ok(PostListResponse {
            posts: posts_with_authors.into_iter().map(PostWithAuthorResponse::from).collect(),
            total,
            page,
            per_page,
        })
    }

    pub async fn get_post_by_id(&self, post_id: i32) -> Result<Option<PostWithAuthorResponse>, sqlx::Error> {
        let pool = self.db.get_pool();
        
        let post = sqlx::query_as!(
            PostWithAuthor,
            r#"
            SELECT 
                p.id, p.content, p.author_id, p.likes_count, p.comments_count, p.shares_count,
                p.is_verified_by_ai, p.ai_verification_score, p.created_at, p.updated_at,
                u.name as author_name, u.username as author_username, u.avatar_url as author_avatar_url
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.id = $1
            "#,
            post_id
        )
        .fetch_optional(pool)
        .await?;

        Ok(post.map(PostWithAuthorResponse::from))
    }

    pub async fn like_post(&self, post_id: i32, user_id: i32) -> Result<bool, sqlx::Error> {
        let pool = self.db.get_pool();
        
        // Try to insert like
        let result = sqlx::query!(
            r#"
            INSERT INTO likes (user_id, post_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, post_id) DO NOTHING
            "#,
            user_id,
            post_id
        )
        .execute(pool)
        .await?;

        if result.rows_affected() > 0 {
            // Update likes count
            sqlx::query!(
                r#"
                UPDATE posts 
                SET likes_count = likes_count + 1
                WHERE id = $1
                "#,
                post_id
            )
            .execute(pool)
            .await?;
            
            Ok(true)
        } else {
            Ok(false)
        }
    }

    pub async fn unlike_post(&self, post_id: i32, user_id: i32) -> Result<bool, sqlx::Error> {
        let pool = self.db.get_pool();
        
        // Try to delete like
        let result = sqlx::query!(
            r#"
            DELETE FROM likes
            WHERE user_id = $1 AND post_id = $2
            "#,
            user_id,
            post_id
        )
        .execute(pool)
        .await?;

        if result.rows_affected() > 0 {
            // Update likes count
            sqlx::query!(
                r#"
                UPDATE posts 
                SET likes_count = GREATEST(likes_count - 1, 0)
                WHERE id = $1
                "#,
                post_id
            )
            .execute(pool)
            .await?;
            
            Ok(true)
        } else {
            Ok(false)
        }
    }
}
