import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogForm = ({ onBlogSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: null,
    category: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft',
    author: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and Content are required');
      return;
    }

    const blogData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString()
    };

    // Call parent handler
    if (onBlogSubmit) {
      onBlogSubmit(blogData);
    } else {
      console.log('Blog Data:', blogData);
      alert('Blog post created successfully! Check console for data.');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'color', 'background', 'align', 'code-block'
  ];

  return (
    <div style={{ 
      display: 'flex', 
      gap: '30px', 
      padding: '40px',
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* LEFT COLUMN */}
      <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Title */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog title..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Excerpt
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief description of your blog post..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        {/* Content Editor */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Content *
          </label>
          <div style={{
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Write your blog content..."
              style={{ height: '300px' }}
              theme="snow"
            />
          </div>
        </div>

        {/* Featured Image Upload */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          />
          {imagePreview && (
            <div style={{
              marginTop: '12px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e1e5e9'
            }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN (SIDEBAR) */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Category */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#fff'
            }}
          >
            <option value="">Select category...</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="development">Development</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        {/* SEO Fields */}
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#495057' 
          }}>
            SEO
          </h4>
          
          {/* Meta Title */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '13px', 
              fontWeight: '500', 
              color: '#6c757d' 
            }}>
              Meta Title
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="SEO title (60 chars max)..."
              maxLength={60}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Meta Description */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '13px', 
              fontWeight: '500', 
              color: '#6c757d' 
            }}>
              Meta Description
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              placeholder="SEO description (160 chars max)..."
              rows={3}
              maxLength={160}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#fff'
            }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Author */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Author
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        {/* Slug */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="url-friendly-slug"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#f8f9fa'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            padding: '14px 24px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            width: '100%',
            marginBottom: '12px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Publish Blog Post
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={() => onClose && onClose()}
          style={{
            padding: '14px 24px',
            backgroundColor: 'transparent',
            color: '#6c757d',
            border: '1px solid #6c757d',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#6c757d';
            e.target.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6c757d';
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BlogForm;
