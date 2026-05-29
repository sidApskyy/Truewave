import React, { useState, useEffect } from 'react';

// Simplified working version without complex dependencies
const WorkingApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Simple theme management without localStorage errors
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true);
      }
    } catch (error) {
      console.error('Theme error:', error);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#1f2937';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#f3f4f6';
      }
    } catch (error) {
      console.error('Theme application error:', error);
    }
  }, [isDarkMode]);

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Header */}
      <header style={{
        padding: '20px',
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              color: isDarkMode ? '#ffffff' : '#1f2937',
              margin: 0 
            }}>
              True<span style={{ color: '#3b82f6' }}>Wave</span>ites
            </h1>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: '8px 16px',
                backgroundColor: isDarkMode ? '#ffffff' : '#1f2937',
                color: isDarkMode ? '#1f2937' : '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: isDarkMode ? '#ffffff' : '#1f2937'
          }}>
            We Slice Through The Clutter
          </h2>
          
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '40px',
            lineHeight: '1.6',
            color: isDarkMode ? '#e5e7eb' : '#4b5563'
          }}>
            Your trusted B2B demand generation partner since 2012. We prioritize what truly counts - Outcomes!
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              padding: '30px',
              backgroundColor: isDarkMode ? '#374151' : '#ffffff',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>2012</div>
              <div style={{ fontSize: '1.1rem', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>Founded</div>
            </div>
            
            <div style={{
              padding: '30px',
              backgroundColor: isDarkMode ? '#374151' : '#ffffff',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>10K+</div>
              <div style={{ fontSize: '1.1rem', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>Leads Generated</div>
            </div>
            
            <div style={{
              padding: '30px',
              backgroundColor: isDarkMode ? '#374151' : '#ffffff',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>500+</div>
              <div style={{ fontSize: '1.1rem', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>Happy Clients</div>
            </div>
            
            <div style={{
              padding: '30px',
              backgroundColor: isDarkMode ? '#374151' : '#ffffff',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>99%</div>
              <div style={{ fontSize: '1.1rem', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>Satisfaction</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              padding: '16px 32px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Get Started
            </button>
            
            <button style={{
              padding: '16px 32px',
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer style={{
        padding: '40px 20px',
        backgroundColor: isDarkMode ? '#111827' : '#1f2937',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ marginBottom: '10px' }}>
            © {new Date().getFullYear()} TrueWaveites. All Rights Reserved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>About</span>
            <span style={{ cursor: 'pointer' }}>Services</span>
            <span style={{ cursor: 'pointer' }}>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkingApp;
