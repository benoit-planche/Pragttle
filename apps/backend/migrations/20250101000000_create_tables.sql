-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_verified_by_ai BOOLEAN DEFAULT FALSE,
    ai_verification_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Insert some sample data
INSERT INTO users (username, email, password_hash, name, avatar_url) VALUES
    ('marie_climat', 'marie@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2', 'Marie Dubois', 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie'),
    ('thomas_scientist', 'thomas@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2', 'Dr. Thomas Martin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=thomas'),
    ('sophie_eco', 'sophie@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2', 'Sophie Chen', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie'),
    ('alex_educator', 'alex@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2', 'Alexandre Rousseau', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex')
ON CONFLICT (username) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (content, author_id, likes_count, comments_count, shares_count, is_verified_by_ai, ai_verification_score) VALUES
    ('🌱 Incroyable découverte ! Les chercheurs ont développé une nouvelle méthode de capture du CO2 qui pourrait révolutionner notre approche du changement climatique. L''IA de Pragttle a confirmé la fiabilité de cette information. #InnovationClimatique #DéveloppementDurable', 1, 156, 23, 12, true, 0.95),
    ('📊 Nouveau rapport alarmant sur la fonte des glaces en Antarctique. Les données montrent une accélération de 40% par rapport aux prévisions. Il est temps d''agir collectivement pour protéger notre planète. #Antarctique #UrgenceClimatique', 2, 89, 15, 8, true, 0.92),
    ('💡 Initiative locale inspirante : notre ville vient d''installer 50 bornes de recharge solaire pour véhicules électriques ! Un exemple concret de transition énergétique. Félicitations à tous les bénévoles qui ont porté ce projet. #TransitionÉnergétique #ActionLocale', 3, 234, 31, 45, true, 0.98),
    ('🌍 Discussion importante : Comment pouvons-nous mieux éduquer les jeunes générations sur les enjeux climatiques ? Partagez vos expériences et idées innovantes. L''éducation est la clé d''un avenir durable. #ÉducationClimatique #GénérationFuture', 4, 67, 42, 18, true, 0.88); 