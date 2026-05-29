import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogForm from '../components/BlogForm';
import BlogDetailPage from '../components/BlogDetailPage';
import Ballpit from '../components/Ballpit';

const Resources = ({ isDarkMode, setIsDarkMode, navigate }) => {
  const [blogs, setBlogs] = useState([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  
  // Admin login state
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  
  // Blog upload state
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    coverImage: null,
    coverImagePreview: ''
  });

  // Fetch blogs from database
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Trigger entrance animation when blogs are loaded
  useEffect(() => {
    if (blogs.length > 0) {
      setTimeout(() => setCardsVisible(true), 100);
    }
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        // Sort blogs by created_at in descending order (newest first)
        const sortedBlogs = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setBlogs(sortedBlogs);
        setUsingFallbackData(false);
      } else {
        // Server responded but with error
        console.warn('Server responded with error:', response.status);
        setFallbackBlogs();
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Request timeout - backend may not be running');
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('ERR_CONNECTION_REFUSED')) {
        console.warn('Backend server not running - using fallback blogs');
      } else {
        console.error('Error fetching blogs:', error);
      }
      // Set fallback blogs when backend is unavailable
      setFallbackBlogs();
    }
  };

  // Fallback blogs for when backend is not available
  const setFallbackBlogs = () => {
    const fallbackBlogs = [
      {
        id: 1,
        title: "Understanding Lead Generation in B2B Marketing",
        content: "Lead generation is the backbone of B2B marketing success. In today's competitive landscape, businesses need sophisticated strategies to attract and convert high-quality leads...",
        cover_image: null,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        category: "Marketing",
        author: "Marketing Team"
      },
      {
        id: 2,
        title: "The Future of Content Syndication",
        content: "Content syndication continues to evolve as a powerful strategy for B2B marketers. Learn how to leverage content syndication to expand your reach and generate qualified leads...",
        cover_image: null,
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        category: "Content Strategy",
        author: "Content Team"
      },
      {
        id: 3,
        title: "Sales Qualified Leads: A Complete Guide",
        content: "Sales Qualified Leads (SQLs) represent a critical stage in the B2B sales funnel. Understanding how to identify, nurture, and convert SQLs can dramatically improve your sales performance...",
        cover_image: null,
        created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        category: "Sales",
        author: "Sales Team"
      }
    ];
    setBlogs(fallbackBlogs);
    setUsingFallbackData(true);
  };

  // Admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminCredentials)
      });

      if (response.ok) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        setShowUploadForm(true);
        setAdminCredentials({ username: '', password: '' });
      } else {
        alert('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogData({
          ...blogData,
          coverImage: file,
          coverImagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle new blog submission from BlogForm
  const handleNewBlogSubmit = async (blogData) => {
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('excerpt', blogData.excerpt || '');
      formData.append('category', blogData.category || '');
      formData.append('tags', JSON.stringify(blogData.tags || []));
      formData.append('metaTitle', blogData.metaTitle || '');
      formData.append('metaDescription', blogData.metaDescription || '');
      formData.append('status', blogData.status || 'draft');
      formData.append('author', blogData.author || '');
      formData.append('slug', blogData.slug || '');
      
      if (blogData.featuredImage) {
        formData.append('coverImage', blogData.featuredImage);
      }

      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Blog uploaded successfully!');
        setShowUploadForm(false);
        setIsAdmin(false);
        fetchBlogs(); // Refresh blogs list
      } else {
        alert('Failed to upload blog');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  // Upload blog (legacy - kept for compatibility)
  const handleBlogUpload = async (e) => {
    e.preventDefault();
    
    if (!blogData.title || !blogData.content) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    if (blogData.coverImage) {
      formData.append('coverImage', blogData.coverImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Blog uploaded successfully!');
        setBlogData({ title: '', content: '', coverImage: null, coverImagePreview: '' });
        setShowUploadForm(false);
        setIsAdmin(false);
        fetchBlogs(); // Refresh blogs list
      } else {
        alert('Failed to upload blog');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  };

  // Open blog in premium detail page
  const openBlogDetail = (blog) => {
    setSelectedBlog(blog);
    setShowBlogDetail(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  // Close blog detail page
  const closeBlogDetail = () => {
    setShowBlogDetail(false);
    setSelectedBlog(null);
    document.body.style.overflow = 'unset'; // Restore background scroll
  };

  // Alternative method to open blog
  const openBlogAlternative = (blog) => {
    try {
      // Create a temporary div with blog content and open in new window
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <h2>${blog.title}</h2>
        <p>${new Date(blog.created_at).toLocaleDateString()}</p>
        ${blog.cover_image ? `<img src="http://localhost:5000${blog.cover_image}" style="max-width: 100%; height: auto;" />` : ''}
        <div>${blog.content}</div>
      `;
      
      // Open new window with simplified content
      const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${blog.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              img { max-width: 100%; height: auto; margin: 20px 0; }
              h2 { color: #09243F; margin-bottom: 10px; }
              p { margin-bottom: 15px; }
            </style>
          </head>
          <body>
            ${tempDiv.innerHTML}
            <br><br>
            <button onclick="window.close()" style="background: #FF8C42; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Close</button>
          </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.focus();
      }
    } catch (error) {
      console.error('Alternative method also failed:', error);
      alert('Unable to open blog. Please check your browser popup settings and try again.');
    }
  };

  return (
    <>
      <div style={{
      minHeight: '100vh',
      backgroundColor: isDarkMode ? 'black' : '#FFFFFF',
      color: isDarkMode ? '#ffffff' : '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes imageGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 140, 66, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 140, 66, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 140, 66, 0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
      {/* Header Component */}
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        navigate={navigate} 
      />
      
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px 80px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Ballpit Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          minHeight: '700px',
          maxHeight: '700px',
          width: '100%',
          zIndex: -1,
          filter: ' contrast(1.05) saturate(1.1)',
          mixBlendMode: 'normal',
          background: 'transparent',
          transform: 'perspective(1000px) rotateX(2deg)'
        }}>
          <Ballpit
            count={300}
            gravity={0.15}
            friction={0.98}
            wallBounce={0.95}
            followCursor={true}
            colors={[0xFF8C42, 0xFF6B6B, 0x4ECDC4, 0xFFD700, 0xFF69B4, 0x00CED1, 0xFF1493, 0x32CD32]}
            ambientColor={16777215}
            ambientIntensity={0.8}
            lightIntensity={180}
            minSize={0.1}
            maxSize={1.5}
            size0={1.8}
            maxVelocity={0.06}
            maxX={15}
            maxY={8}
            maxZ={5}
            materialParams={{
              metalness: 0.7,
              roughness: 0.2,
              clearcoat: 0.8,
              clearcoatRoughness: 0.15,
              transmission: 0.3,
              thickness: 0.6,
              ior: 1.3,
              reflectivity: 0.7,
              specularIntensity: 0.8
            }}
          />
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h1 className="hero-title" style={{
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            fontWeight: '800',
            marginBottom: '16px',
            color: 'white',
            letterSpacing: '-0.03em',
            textShadow: '0 0 40px rgba(0, 0, 0, 0.1)',
            filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.2))'
          }}>
            Blogs 
          </h1>
          
          {/* Upload Blog Button */}
          <button
            onClick={() => setShowAdminLogin(true)}
            style={{
              padding: '16px 32px',
              fontSize: '1.1rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #FF8C42, #FF6B6B)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '20px',
              boxShadow: isDarkMode 
                ? '0 10px 30px rgba(255, 140, 66, 0.3)' 
                : '0 10px 30px rgba(255, 140, 66, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = isDarkMode 
                ? '0 15px 40px rgba(255, 140, 66, 0.4)' 
                : '0 15px 40px rgba(255, 140, 66, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = isDarkMode 
                ? '0 10px 30px rgba(255, 140, 66, 0.3)' 
                : '0 10px 30px rgba(255, 140, 66, 0.2)';
            }}
          >
            Upload Blog
          </button>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section style={{
        padding: '40px 40px 80px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            padding: '20px 0'
          }}>
            {blogs.map((blog) => (
              <article 
                key={blog.id}
                onClick={() => openBlogDetail(blog)}
                style={{
                  background: isDarkMode 
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.02)',
                  borderRadius: '12px',
                  padding: '0',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  aspectRatio: '1/1',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                  animationName: cardsVisible ? 'cardEntrance' : 'none',
                  animationDuration: cardsVisible ? '0.6s' : '0s',
                  animationTimingFunction: cardsVisible ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'ease',
                  animationFillMode: cardsVisible ? 'forwards' : 'none',
                  animationDelay: `${cardsVisible ? blogs.indexOf(blog) * 0.1 : 0}s`
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(-12px) scale(1.02)';
                  card.style.boxShadow = isDarkMode 
                    ? '0 25px 50px rgba(255,140,66,0.3)' 
                    : '0 25px 50px rgba(255,140,66,0.2)';
                  card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                  
                  // Animate the image
                  const imageDiv = card.querySelector('div[style*="height: \'60%\'"]');
                  if (imageDiv) {
                    imageDiv.style.transform = 'scale(1.05)';
                    imageDiv.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                  }
                  
                  // Animate the read more button
                  const readMore = card.querySelector('span[style*="color: \'#FF8C42\'"]');
                  if (readMore) {
                    readMore.style.transform = 'translateX(5px)';
                    readMore.style.transition = 'transform 0.3s ease';
                  }
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(0) scale(1)';
                  card.style.boxShadow = 'none';
                  card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                  
                  // Reset image animation
                  const imageDiv = card.querySelector('div[style*="height: \'60%\'"]');
                  if (imageDiv) {
                    imageDiv.style.transform = 'scale(1)';
                    imageDiv.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                  }
                  
                  // Reset read more animation
                  const readMore = card.querySelector('span[style*="color: \'#FF8C42\'"]');
                  if (readMore) {
                    readMore.style.transform = 'translateX(0)';
                    readMore.style.transition = 'transform 0.3s ease';
                  }
                }}
              >
                {/* Cover Image */}
                <div style={{
                  height: '60%',
                  background: blog.cover_image 
                    ? `url(${blog.cover_image}) center/cover`
                    : `linear-gradient(135deg, ${isDarkMode ? '#FF8C42' : '#FF8C42'}40, ${isDarkMode ? '#4ECDC4' : '#4ECDC4'}40)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {!blog.cover_image && '📝'}
                </div>
                
                {/* Blog Content - Below image */}
                <div style={{
                  padding: '15px',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: isDarkMode ? '#999999' : '#666666',
                      fontWeight: '500'
                    }}>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: '#000000',
                    lineHeight: '1.2',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {blog.title}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: isDarkMode ? '#cccccc' : '#333333',
                    lineHeight: '1.4',
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {blog.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                  </p>
                  <span style={{
                    color: '#FF8C42',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    display: 'inline-block',
                    animation: 'pulse 2s infinite'
                  }}>
                    Read More →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#09243F' : '#FFFFFF',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '400px',
            width: '100%',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '24px',
              color: isDarkMode ? '#ffffff' : '#000000',
              textAlign: 'center'
            }}>
              Admin Login
            </h2>
            
            <form onSubmit={handleAdminLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: isDarkMode ? '#ffffff' : '#000000',
                  fontWeight: '500'
                }}>
                  Username
                </label>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: isDarkMode ? '#ffffff' : '#000000',
                  fontWeight: '500'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #FF8C42, #FF6B6B)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminCredentials({ username: '', password: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Upload Form */}
      {showUploadForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#09243F' : '#FFFFFF',
            borderRadius: '20px',
            width: '95%',
            maxWidth: '1200px',
            height: '90vh',
            overflow: 'hidden',
            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => {
                setShowUploadForm(false);
                setIsAdmin(false);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                border: 'none',
                color: isDarkMode ? '#ffffff' : '#000000',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FF8C42';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                e.target.style.color = isDarkMode ? '#ffffff' : '#000000';
              }}
            >
              ×
            </button>

            {/* BlogForm Component */}
            <div style={{
              height: '100%',
              overflowY: 'auto',
              padding: '20px'
            }}>
              <BlogForm 
                onBlogSubmit={handleNewBlogSubmit}
                onClose={() => {
                  setShowUploadForm(false);
                  setIsAdmin(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Premium Blog Detail Page */}
      {showBlogDetail && selectedBlog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000,
          overflow: 'auto'
        }}>
          <BlogDetailPage 
            blog={selectedBlog} 
            onClose={closeBlogDetail} 
            onDelete={fetchBlogs}
          />
        </div>
      )}
    </div>
      
      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />
    </>
  );
};

export default Resources;
