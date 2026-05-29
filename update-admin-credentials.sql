-- Update admin username and password in database
-- Run this in PgAdmin or any PostgreSQL client

-- Option 1: Update existing admin user
UPDATE admin_users 
SET username = 'your_new_username', 
    password = 'your_new_password'
WHERE username = 'admin';

-- Option 2: If you want to change the default admin credentials
UPDATE admin_users 
SET username = 'admin',
    password = 'admin123'
WHERE username = 'admin';

-- Option 3: Create a new admin user with new credentials
INSERT INTO admin_users (username, password, created_at)
VALUES ('your_new_username', crypt('your_new_password', NOW());

-- Verify the update
SELECT username, created_at FROM admin_users WHERE username = 'your_new_username';

-- If you want to see all admin users
SELECT * FROM admin_users;
