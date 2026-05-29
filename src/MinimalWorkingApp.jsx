import React, { useState, useEffect } from 'react';

const MinimalWorkingApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDarkMode(true);
      }
    } catch (error) {
      console.error('localStorage error:', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('localStorage error:', error);
    }
  }, [isDarkMode]);

  return (
    <div style={{ 
      backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6', 
      color: 'white', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
        TRUEWAVES - MINIMAL WORKING TEST
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
        If you can see this, React + State Management is working
      </p>
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{ 
          backgroundColor: isDarkMode ? 'white' : 'black', 
          color: isDarkMode ? 'black' : 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '8px',
          fontSize: '1rem'
        }}
      >
        Toggle Theme: {isDarkMode ? 'Dark' : 'Light'}
      </button>
      
      <div style={{ 
        backgroundColor: isDarkMode ? '#374151' : '#e5e7eb', 
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2 style={{ color: 'white', marginBottom: '10px' }}>
          Component Test Section
        </h2>
        <p style={{ color: 'white' }}>
          All core functionality working: React hooks, state management, theme switching
        </p>
      </div>
    </div>
  );
};

export default MinimalWorkingApp;
