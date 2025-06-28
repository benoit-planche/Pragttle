use sqlx::PgPool;
use std::env;

// Database module - will be implemented later
#[allow(dead_code)]
pub struct Database {
    pool: PgPool,
}

#[allow(dead_code)]
impl Database {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgresql://postgres:postgres@localhost:5432/pragttle".to_string());
        
        let pool = PgPool::connect(&database_url).await?;
        
        // Run migrations
        sqlx::migrate!("./migrations").run(&pool).await?;
        
        Ok(Database { pool })
    }
    
    pub fn get_pool(&self) -> &PgPool {
        &self.pool
    }
} 