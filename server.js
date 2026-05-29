import express from 'express';
import multer from 'multer';
import path from 'path';
import { Pool } from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'truewave_blog',
  password: process.env.DB_PASSWORD || 'siddhant@s',
  port: process.env.DB_PORT || 5432,
  ssl: false
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create admin users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create blogs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        cover_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if admin user exists, if not create one
    const adminResult = await pool.query('SELECT * FROM admin_users WHERE username = $1', ['admin']);
    if (adminResult.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO admin_users (username, password) VALUES ($1, $2)',
        ['admin', hashedPassword]
      );
      console.log('Default admin user created: username=admin, password=admin123');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Routes

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      'your_jwt_secret', // Replace with your actual JWT secret
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM blogs ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload new blog
app.post('/api/blogs', upload.single('coverImage'), async (req, res) => {
  try {
    const { 
      title, 
      content, 
      excerpt = '', 
      category = '', 
      tags = '[]', 
      metaTitle = '', 
      metaDescription = '', 
      status = 'draft', 
      author = '', 
      slug = '' 
    } = req.body;
    
    const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const result = await pool.query(
      `INSERT INTO blogs (
        title, content, excerpt, category, tags, meta_title, meta_description, 
        status, author, slug, cover_image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        title, 
        content, 
        excerpt, 
        category, 
        tags, 
        metaTitle, 
        metaDescription, 
        status, 
        author, 
        finalSlug, 
        coverImagePath
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error uploading blog:', error);
    
    // Handle unique constraint violation for slug
    if (error.code === '23505') {
      return res.status(400).json({ error: 'A blog with this slug already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update blog
app.put('/api/blogs/:id', upload.single('coverImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let query, params;
    if (coverImagePath) {
      query = 'UPDATE blogs SET title = $1, content = $2, cover_image = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *';
      params = [title, content, coverImagePath, id];
    } else {
      query = 'UPDATE blogs SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
      params = [title, content, id];
    }

    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete blog
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get blog info to delete associated image
    const blogResult = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
    
    if (blogResult.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const blog = blogResult.rows[0];
    
    // Delete image file if it exists
    if (blog.cover_image) {
      const imagePath = path.join(__dirname, blog.cover_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete blog from database
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, phone, message } = req.body;
    
    console.log('Contact form submission:', {
      name,
      email,
      company,
      phone,
      message,
      timestamp: new Date().toISOString()
    });
    
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Email service not configured properly.' 
      });
    }
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'siddhantsonawane15@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF8C42; border-bottom: 2px solid #FF8C42; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #333;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Company:</strong> ${company || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong style="color: #333;">Phone:</strong> ${phone || 'Not provided'}</p>
            <div style="margin: 20px 0;">
              <strong style="color: #333;">Message:</strong>
              <p style="background: white; padding: 15px; border-left: 4px solid #FF8C42; margin: 10px 0;">
                ${message}
              </p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #FF8C42; color: white;">
            <p style="margin: 0;">This email was sent from the Truewave Contact Form</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for contacting us! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      command: error.command
    });
    res.status(500).json({ 
      success: false, 
      message: 'Something went wrong. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Protected routes (require admin authentication)
app.use('/api/admin', verifyToken);

// Catch-all handler: send back React's index.html for any non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Default admin credentials: username=admin, password=admin123`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
});
