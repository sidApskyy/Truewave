-- TrueWave Blog Database Setup
-- Run this script in PgAdmin to create the database and tables

-- Create database (if not exists)
-- Note: You may need to create this manually in PgAdmin first
-- CREATE DATABASE truewave_blog;

-- Connect to the database
-- \c truewave_blog;

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Insert default admin user (password: admin123)
-- This will be hashed by the application, but here's the raw version for reference
-- INSERT INTO admin_users (username, password) VALUES ('admin', '$2b$10$YourHashedPasswordHere')
-- ON CONFLICT (username) DO NOTHING;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Sample data for testing (optional)
/*
INSERT INTO blogs (title, content, cover_image) VALUES 
('Welcome to TrueWave Blog', 
 '<h2>Our First Blog Post</h2><p>This is the first blog post on our platform. We''re excited to share our insights and expertise with you.</p><p>Stay tuned for more amazing content!</p>', 
 NULL),
('B2B Marketing Strategies', 
 '<h2>Effective B2B Marketing</h2><p>Learn about the latest B2B marketing strategies that can help your business grow.</p><ul><li>Content Marketing</li><li>Email Campaigns</li><li>Social Media Marketing</li></ul>', 
 NULL);
*/

-- Verify tables were created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('admin_users', 'blogs')
ORDER BY table_name, ordinal_position;
