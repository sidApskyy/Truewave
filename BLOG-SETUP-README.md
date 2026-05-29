# TrueWave Blog Management System Setup

## Overview
This system allows admin users to upload and manage blog posts with cover images. Only authenticated admins can upload blogs, while all users can view them.

## Features
- ✅ Admin authentication system
- ✅ Blog upload with cover images
- ✅ Blog display in card format
- ✅ Full blog view in popup
- ✅ PostgreSQL database integration
- ✅ Image upload and storage
- ✅ Responsive design with dark/light theme

## Database Setup

### 1. Create Database in PgAdmin
1. Open PgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database..."
4. Name it: `truewave_blog`
5. Click "Save"

### 2. Run SQL Script
1. Open the `database-setup.sql` file
2. Copy and paste the SQL into PgAdmin's query tool
3. Run the script to create tables

## Backend Setup

### 1. Install Backend Dependencies
```bash
# Navigate to your project directory
cd d:\Truewave\truewaveites-new

# Install backend dependencies (using the backend package.json)
npm install --package-lock-file backend-package.json
```

Or manually install:
```bash
npm install express multer pg cors bcrypt jsonwebtoken dotenv
npm install --save-dev nodemon
```

### 2. Update Database Configuration
Edit `server.js` and update the PostgreSQL connection:
```javascript
const pool = new Pool({
  user: 'postgres',           // Your PostgreSQL username
  host: 'localhost',          // Your PostgreSQL host
  database: 'truewave_blog',  // Database name
  password: 'your_password',  // Your PostgreSQL password
  port: 5432,                 // PostgreSQL port
});
```

### 3. Update JWT Secret
In `server.js`, update the JWT secret:
```javascript
const token = jwt.sign(
  { id: admin.id, username: admin.username },
  'your_actual_jwt_secret_here', // Replace with secure secret
  { expiresIn: '1h' }
);
```

### 4. Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
node server.js
```

The server will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Frontend Dependencies (if not already installed)
```bash
npm install
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar)

## Default Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default admin password after first login!

## Usage

### For Admin Users:
1. Navigate to the Resources page
2. Click "Upload Blog" button
3. Enter admin credentials (username: admin, password: admin123)
4. Fill in blog details:
   - Upload cover image (optional)
   - Enter blog title
   - Write blog content (supports HTML)
5. Click "Upload Blog"
6. Blog will appear in the blog cards section

### For Regular Users:
1. Navigate to the Resources page
2. View blog cards with title, date, and excerpt
3. Click any blog card to open full blog in popup
4. Click outside popup or X button to close

## File Structure
```
d:\Truewave\truewaveites-new\
├── src\
│   └── pages\
│       └── Resources.jsx          # Main blog page component
├── server.js                      # Backend server
├── database-setup.sql             # Database schema
├── uploads\                       # Uploaded blog images
├── package.json                   # Frontend dependencies
├── backend-package.json           # Backend dependencies
└── BLOG-SETUP-README.md          # This file
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Upload new blog (requires auth)
- `PUT /api/blogs/:id` - Update blog (requires auth)
- `DELETE /api/blogs/:id` - Delete blog (requires auth)

## Database Tables

### admin_users
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR(50) UNIQUE)
- `password` (VARCHAR(255) - hashed)
- `created_at` (TIMESTAMP)

### blogs
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(255))
- `content` (TEXT - supports HTML)
- `cover_image` (VARCHAR(255) - image path)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify database credentials in server.js
   - Ensure database `truewave_blog` exists

2. **Image Upload Not Working**
   - Ensure `uploads` folder exists
   - Check file permissions
   - Verify image size is under 5MB

3. **Admin Login Not Working**
   - Check if admin user exists in database
   - Verify password hashing
   - Check JWT secret configuration

4. **Frontend Not Connecting to Backend**
   - Ensure backend server is running on port 5000
   - Check for CORS issues
   - Verify API endpoints are correct

### Port Conflicts:
If port 5000 is in use, change it in server.js:
```javascript
const PORT = 3001; // or any available port
```

## Security Notes

1. Change default admin password immediately
2. Use strong JWT secrets
3. Implement rate limiting for login attempts
4. Validate and sanitize all user inputs
5. Use HTTPS in production

## Development Tips

1. Use `nodemon` for auto-restart during development
2. Check browser console for JavaScript errors
3. Use PgAdmin to verify database operations
4. Test image uploads with different file types
5. Verify responsive design on different screen sizes

## Production Deployment

1. Set environment variables for sensitive data
2. Use process managers like PM2
3. Configure reverse proxy (nginx/apache)
4. Enable HTTPS
5. Set up database backups
6. Configure proper CORS for production domain

## Support

For issues:
1. Check console errors
2. Verify database connection
3. Test API endpoints with Postman
4. Review server logs
5. Check file permissions for uploads folder
