import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BlogDetailPage = ({ blog, onClose, onDelete }) => {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const socialBarRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [headings, setHeadings] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [deleteStep, setDeleteStep] = useState('confirm'); // 'confirm' or 'auth'

  // Calculate read time
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Extract headings for table of contents
  useEffect(() => {
    if (blog?.content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blog.content;
      const headingElements = Array.from(tempDiv.querySelectorAll('h2, h3'));
      const extractedHeadings = headingElements.map((h, index) => ({
        id: `heading-${index}`,
        text: h.textContent,
        level: h.tagName.toLowerCase()
      }));
      setHeadings(extractedHeadings);
    }
  }, [blog?.content]);

  // Ultra Premium GSAP Animations
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create advanced visual effects
      const createVisualEffects = () => {
        // Floating particles with enhanced effects
        const particlesContainer = document.createElement('div');
        particlesContainer.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        `;
        
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          const size = Math.random() * 6 + 2;
          particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, #FF8C42, #FF6B6B, #FF8C42);
            border-radius: 50%;
            opacity: ${Math.random() * 0.4 + 0.05};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            box-shadow: 0 0 ${size}px rgba(255,140,66,0.3);
          `;
          particlesContainer.appendChild(particle);
          
          gsap.to(particle, {
            x: `+=${Math.random() * 150 - 75}px`,
            y: `+=${Math.random() * 150 - 75}px`,
            opacity: Math.random() * 0.3 + 0.1,
            scale: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 4 + 3,
            repeat: -1,
            ease: 'sine.inOut'
          });
        }
        
        containerRef.current.appendChild(particlesContainer);

        // Create animated gradient overlay
        const gradientOverlay = document.createElement('div');
        gradientOverlay.style.cssText = `
          position: fixed;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,140,66,0.02) 25%, 
            rgba(78,205,196,0.02) 50%, 
            rgba(255,140,66,0.02) 75%, 
            transparent 100%);
          pointer-events: none;
          z-index: 2;
        `;
        containerRef.current.appendChild(gradientOverlay);
        
        gsap.to(gradientOverlay, {
          x: '100%',
          duration: 20,
          repeat: -1,
          ease: 'none'
        });
      };

      createVisualEffects();

      // Hero section premium animations
      const heroTimeline = gsap.timeline();
      
      // Ultra-enhanced hero parallax with multiple effects
      gsap.to(heroRef.current.querySelector('.hero-image'), {
        scale: 1.12,
        y: '30%',
        rotation: 0.3,
        filter: 'brightness(1.1)',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // Hero content reveal with advanced stagger
      heroTimeline
        .from(heroRef.current.querySelector('.hero-content'), {
          opacity: 0,
          y: 80,
          scale: 0.9,
          filter: 'blur(10px)',
          duration: 2,
          ease: 'power4.out'
        })
        .to(heroRef.current.querySelector('.hero-content'), {
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out'
        });

      // Content sections with ultra-enhanced animations
      const contentElements = contentRef.current.querySelectorAll('h2, h3, img, blockquote, a, ul, ol');
      contentElements.forEach((element, index) => {
        gsap.from(element, {
          opacity: 0,
          y: 60,
          scale: 0.9,
          filter: 'blur(2px)',
          duration: 1.2,
          delay: index * 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse'
          }
        });

        // Add premium hover animations for all interactive elements
        element.addEventListener('mouseenter', () => {
          gsap.to(element, {
            scale: 1.03,
            filter: 'brightness(1.05)',
            duration: 0.4,
            ease: 'power2.out'
          });
        });
        
        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            scale: 1,
            filter: 'brightness(1)',
            duration: 0.4,
            ease: 'power2.out'
          });
        });

        // Special animations for different element types
        if (element.tagName === 'H2') {
          gsap.to(element, {
            textShadow: '0 0 20px rgba(255,140,66,0.3)',
            duration: 0.6,
            ease: 'power2.out'
          });
        }
        
        if (element.tagName === 'IMG') {
          gsap.to(element, {
            filter: 'brightness(0.9)',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      // Enhanced reading focus effect with minimal blur
      const paragraphs = contentRef.current.querySelectorAll('p');
      paragraphs.forEach((p) => {
        gsap.set(p, { opacity: 0.7 });
        
        ScrollTrigger.create({
          trigger: p,
          start: 'top 30%',
          end: 'bottom 30%',
          onEnter: () => gsap.to(p, { 
            opacity: 1, 
            duration: 0.6,
            ease: 'power2.out'
          }),
          onLeave: () => gsap.to(p, { 
            opacity: 0.7, 
            duration: 0.4,
            ease: 'power2.out'
          }),
          onEnterBack: () => gsap.to(p, { 
            opacity: 1, 
            duration: 0.6,
            ease: 'power2.out'
          }),
          onLeaveBack: () => gsap.to(p, { 
            opacity: 0.7, 
            duration: 0.4,
            ease: 'power2.out'
          })
        });
      });

      // Ultra-enhanced progress bar with premium effects
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const progress = self.progress * 100;
          setScrollProgress(progress);
          
          // Add ultra-premium glow effect to progress bar
          const progressBar = progressBarRef.current.querySelector('div');
          if (progressBar) {
            gsap.to(progressBar, {
              boxShadow: progress > 5 
                ? `0 0 ${30 + progress * 0.5}px rgba(255,140,66,${0.4 + progress * 0.005}), 0 0 ${60 + progress}px rgba(255,107,107,${0.2 + progress * 0.002})`
                : 'none',
              duration: 0.3,
              ease: 'power2.out',
              background: progress > 20 
                ? 'linear-gradient(90deg, #FF8C42, #FF6B6B, #FF8C42, #FF6B6B)'
                : 'linear-gradient(90deg, #FF8C42, #FF6B6B, #FF8C42)',
              backgroundSize: '200% 100%'
            });
            
            // Animate background position
            gsap.to(progressBar, {
              backgroundPosition: `${progress * 2}% 0`,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        }
      });

      // Ultra-enhanced TOC with premium animations
      headings.forEach((heading, index) => {
        const element = document.getElementById(heading.id);
        const tocItem = document.querySelector(`.toc-item[data-index="${index}"]`);
        
        if (element && tocItem) {
          ScrollTrigger.create({
            trigger: element,
            start: 'top 20%',
            end: 'bottom 20%',
            onEnter: () => {
              gsap.to(tocItem, {
                color: '#FF8C42',
                borderLeftColor: '#FF8C42',
                borderLeftWidth: '5px',
                x: 12,
                fontWeight: '700',
                backgroundColor: 'rgba(255,140,66,0.08)',
                boxShadow: '0 4px 20px rgba(255,140,66,0.2)',
                textShadow: '0 0 10px rgba(255,140,66,0.2)',
                duration: 0.5,
                ease: 'power3.out'
              });
            },
            onLeave: () => {
              gsap.to(tocItem, {
                color: '#666',
                borderLeftColor: 'transparent',
                borderLeftWidth: '3px',
                x: 0,
                fontWeight: '400',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                textShadow: 'none',
                duration: 0.5,
                ease: 'power3.out'
              });
            },
            onEnterBack: () => {
              gsap.to(tocItem, {
                color: '#FF8C42',
                borderLeftColor: '#FF8C42',
                borderLeftWidth: '5px',
                x: 12,
                fontWeight: '700',
                backgroundColor: 'rgba(255,140,66,0.08)',
                boxShadow: '0 4px 20px rgba(255,140,66,0.2)',
                textShadow: '0 0 10px rgba(255,140,66,0.2)',
                duration: 0.5,
                ease: 'power3.out'
              });
            },
            onLeaveBack: () => {
              gsap.to(tocItem, {
                color: '#666',
                borderLeftColor: 'transparent',
                borderLeftWidth: '3px',
                x: 0,
                fontWeight: '400',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                textShadow: 'none',
                duration: 0.5,
                ease: 'power3.out'
              });
            }
          });
        }
      });

      // Add premium floating animation to main content container
      gsap.to(contentRef.current, {
        y: -2,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Add subtle rotation to content container
      gsap.to(contentRef.current, {
        rotation: 0.5,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Add premium pulse effect to social bar
      if (socialBarRef.current) {
        gsap.to(socialBarRef.current, {
          y: -5,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Add premium animations to all buttons
      const buttons = containerRef.current.querySelectorAll('button');
      buttons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out'
          });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
          });
        });
      });

      // Add premium scroll-based background animation
      gsap.to(containerRef.current, {
        backgroundPosition: '50% 50%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [headings]);

  // Premium scroll to section with GSAP
  const scrollToSection = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: 'power2.inOut'
      });
    }
  };

  // Handle delete blog
  const handleDeleteBlog = () => {
    setShowDeleteModal(true);
    setDeleteStep('confirm');
    setAdminCredentials({ username: '', password: '' });
  };

  // Handle admin authentication for delete
  const handleAdminAuth = async (e) => {
    e.preventDefault();
    
    console.log('Attempting admin login with:', adminCredentials);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminCredentials)
      });

      console.log('Login response status:', response.status);
      console.log('Login response ok:', response.ok);

      if (response.ok) {
        // Admin authenticated, proceed with deletion
        console.log('Admin authenticated, proceeding with deletion...');
        const deleteResponse = await fetch(`http://localhost:5000/api/blogs/${blog.id}`, {
          method: 'DELETE'
        });

        console.log('Delete response status:', deleteResponse.status);
        console.log('Delete response ok:', deleteResponse.ok);

        if (deleteResponse.ok) {
          alert('Blog deleted successfully!');
          setShowDeleteModal(false);
          onDelete(); // Callback to refresh blog list
          onClose();  // Close the detail page
        } else {
          console.error('Delete failed with status:', deleteResponse.status);
          const errorText = await deleteResponse.text();
          console.error('Delete error text:', errorText);
          alert(`Failed to delete blog: ${errorText || 'Unknown error'}`);
        }
      } else {
        console.error('Login failed with status:', response.status);
        const errorText = await response.text();
        console.error('Login error text:', errorText);
        alert(`Invalid admin credentials: ${errorText || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error details:', error.message);
      alert(`Delete failed: ${error.message || 'Network error. Please try again.'}`);
    }
  };

  // Proceed to authentication
  const proceedToAuth = () => {
    setDeleteStep('auth');
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteStep('confirm');
    setAdminCredentials({ username: '', password: '' });
  };

  if (!blog) return null;

  return (
    <div ref={containerRef} style={{
      height: '100vh',
      background: 'radial-gradient(ellipse at top, rgba(255,140,66,0.03) 0%, transparent 50%), linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%)',
      position: 'relative',
      overflow: 'auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Premium Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <div
          ref={progressBarRef}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #FF8C42, #FF6B6B, #FF8C42)',
            backgroundSize: '200% 100%',
            width: `${scrollProgress}%`,
            transition: 'width 0.3s ease',
            boxShadow: scrollProgress > 10 ? '0 0 20px rgba(255,140,66,0.5)' : 'none'
          }}
        />
      </div>

      {/* Premium Hero Section */}
      <div ref={heroRef} style={{
        position: 'relative',
        height: '85vh',
        minHeight: '600px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Hero Image */}
        <div className="hero-image" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: blog.cover_image 
            ? `url(${blog.cover_image})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        {/* Premium Gradient Overlay */}
        <div className="hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
          backdropFilter: 'blur(2px)'
        }} />

        {/* Glassmorphism Hero Content */}
        <div className="hero-content" style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '720px',
          width: '100%',
          padding: '0 40px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '60px 40px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Category Badge */}
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,140,66,0.9)',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Blog Post
            </div>

            {/* Premium Title */}
            <h1 className="hero-title" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '32px',
              color: 'white',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 30px rgba(0,0,0,0.5)',
              animation: 'titlePopup 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
              opacity: 0,
              transform: 'scale(0.5) translateY(50px)'
            }}>
              {blog.title}
            </h1>

            <style>{`
              @keyframes titlePopup {
                0% {
                  opacity: 0;
                  transform: scale(0.5) translateY(50px);
                }
                60% {
                  opacity: 1;
                  transform: scale(1.1) translateY(-10px);
                }
                100% {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
            `}</style>
            
            {/* Meta Information */}
            <div className="hero-meta" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '500'
            }}>
              <span>{blog.author || 'Admin'}</span>
              <span style={{ opacity: '0.6' }}>•</span>
              <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span style={{ opacity: '0.6' }}>•</span>
              <span>{calculateReadTime(blog.content)} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Screen-Wide Content Layout */}
      <div style={{ position: 'relative' }}>
        {/* Left: Sticky Social Bar */}
        <div ref={socialBarRef} style={{
          position: 'fixed',
          left: '40px',
          top: '120px',
          width: '60px',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 100
        }}>
          {['twitter', 'linkedin', 'facebook'].map((social) => (
            <button
              key={social}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'white',
                border: '1px solid rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '18px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05), 0 0 20px rgba(255,140,66,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FF8C42';
                e.target.style.color = 'white';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 4px 20px rgba(255,140,66,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#333';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05), 0 0 20px rgba(255,140,66,0.1)';
              }}
            >
              <span style={{
                position: 'relative',
                zIndex: 2
              }}>
                {social === 'twitter' && '𝕏'}
                {social === 'linkedin' && 'in'}
                {social === 'facebook' && 'f'}
              </span>
            </button>
          ))}
          
          {/* Delete Button */}
          <button
            onClick={handleDeleteBlog}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#dc3545',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(220,53,69,0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c82333';
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 4px 20px rgba(220,53,69,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#dc3545';
              e.target.style.color = 'white';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 10px rgba(220,53,69,0.2)';
            }}
          >
            🗑
          </button>
        </div>

        {/* Center: Screen-Wide Main Content */}
        <div ref={contentRef} style={{
          marginLeft: '120px',
          marginRight: '280px',
          minHeight: '100vh'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            borderRadius: '24px',
            padding: '0',
            boxShadow: '0 20px 80px rgba(0,0,0,0.12), 0 0 120px rgba(255,140,66,0.05)',
            overflow: 'hidden',
            position: 'relative',
            margin: '0 20px 80px',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,140,66,0.1)'
          }}>
            {/* Content Header */}
            <div style={{
              padding: '60px 80px 40px',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              background: 'linear-gradient(135deg, rgba(255,140,66,0.03) 0%, transparent 100%)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF8C42, #FF6B6B)',
                  boxShadow: '0 2px 8px rgba(255,140,66,0.3)'
                }} />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#FF8C42'
                }}>
                  Article
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#666',
                fontSize: '0.875rem'
              }}>
                <span>{calculateReadTime(blog.content)} min read</span>
                <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
            </div>

            {/* Premium Content Body */}
            <div style={{
              padding: '40px 100px 80px',
              fontSize: '1.125rem',
              lineHeight: '1.8',
              color: '#1a1a1a',
              letterSpacing: '0.01em',
              position: 'relative',
              maxWidth: 'none'
            }}>
              {/* Process content with heading IDs and drop cap */}
              <div dangerouslySetInnerHTML={{ 
                __html: blog.content.replace(/<h([2-3])>/g, (match, level) => {
                  const index = Array.from(contentRef.current?.querySelectorAll('h2, h3') || []).length;
                  return `<h${level} id="heading-${index}" style="transition: all 0.3s ease; cursor: pointer;">`;
                }).replace(/<p>/, '<p style="text-indent: 0; transition: all 0.3s ease; cursor: pointer;">')
              }} />
              
              {/* Reading Progress Indicator */}
              <div style={{
                position: 'absolute',
                left: '0',
                top: '0',
                bottom: '0',
                width: '4px',
                background: 'linear-gradient(180deg, #FF8C42, transparent)',
                opacity: 0.1,
                borderRadius: '2px'
              }} />
            </div>
          </div>
        </div>

        {/* Right: Sticky Table of Contents */}
        {headings.length > 0 && (
          <div style={{
            position: 'fixed',
            right: '40px',
            top: '120px',
            width: '280px',
            height: 'fit-content',
            zIndex: 100
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 0 60px rgba(255,140,66,0.08)',
              border: '1px solid rgba(255,140,66,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#666',
                marginBottom: '20px'
              }}>
                Contents
              </h4>
              
              <nav>
                {headings.map((heading, index) => (
                  <div
                    key={index}
                    className={`toc-item ${heading.level === 'h3' ? 'toc-subitem' : ''}`}
                    data-index={index}
                    style={{
                      marginBottom: '12px',
                      cursor: 'pointer',
                      padding: heading.level === 'h3' ? '12px 20px' : '12px 16px',
                      borderRadius: '8px',
                      fontSize: heading.level === 'h3' ? '0.875rem' : '0.95rem',
                      color: '#666',
                      transition: 'all 0.3s ease',
                      borderLeft: heading.level === 'h3' ? '2px solid transparent' : '3px solid transparent',
                      fontWeight: '400'
                    }}
                    onClick={() => scrollToSection(heading.id)}
                  >
                    {heading.text}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Premium Close Button */}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '0',
            maxWidth: '400px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            {deleteStep === 'confirm' ? (
              <>
                <div style={{
                  padding: '32px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#dc3545',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '24px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    🗑
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '12px'
                  }}>
                    Delete Blog Post
                  </h3>
                  
                  <p style={{
                    color: '#666',
                    marginBottom: '32px',
                    lineHeight: '1.5'
                  }}>
                    Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      onClick={cancelDelete}
                      style={{
                        flex: '1',
                        padding: '12px 24px',
                        backgroundColor: '#f8f9fa',
                        color: '#666',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={proceedToAuth}
                      style={{
                        flex: '1',
                        padding: '12px 24px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  padding: '32px'
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>
                    Admin Authentication
                  </h3>
                  
                  <form onSubmit={handleAdminAuth}>
                    <div style={{ marginBottom: '20px' }}>
                      <input
                        type="text"
                        placeholder="Username"
                        value={adminCredentials.username}
                        onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                      />
                    </div>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <input
                        type="password"
                        placeholder="Password"
                        value={adminCredentials.password}
                        onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#FF8C42'}
                        onBlur={(e) => e.target.style.borderColor = '#ddd'}
                      />
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      gap: '12px'
                    }}>
                      <button
                        type="button"
                        onClick={cancelDelete}
                        style={{
                          flex: '1',
                          padding: '12px 24px',
                          backgroundColor: '#f8f9fa',
                          color: '#666',
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Cancel
                      </button>
                      
                      <button
                        type="submit"
                        style={{
                          flex: '1',
                          padding: '12px 24px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                  
                                  </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.1)',
          color: '#333',
          fontSize: '24px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#FF8C42';
          e.target.style.color = 'white';
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 12px 40px rgba(255,140,66,0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
          e.target.style.color = '#333';
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
        }}
      >
        ×
      </button>

      <style>{`
        .toc-item.active {
          color: #FF8C42 !important;
          border-left-color: #FF8C42 !important;
          font-weight: 600 !important;
          background-color: rgba(255,140,66,0.05);
        }

        /* Premium Typography */
        h2 {
          font-size: 2.5rem !important;
          font-weight: 800 !important;
          margin-top: 64px !important;
          margin-bottom: 36px !important;
          color: #0a0a0a !important;
          line-height: 1.1 !important;
          letter-spacing: -0.02em !important;
          position: relative !important;
          padding-left: 20px !important;
          transition: all 0.3s ease !important;
        }

        h2:hover {
          color: #FF8C42 !important;
          transform: translateX(4px) !important;
        }

        h2:hover::before {
          height: 40px !important;
          background: linear-gradient(180deg, #FF6B6B, #FF8C42) !important;
        }

        h2::before {
          content: "" !important;
          position: absolute !important;
          left: 0 !important;
          top: 8px !important;
          width: 4px !important;
          height: 32px !important;
          background: linear-gradient(180deg, #FF8C42, #FF6B6B) !important;
          border-radius: 2px !important;
          transition: all 0.3s ease !important;
        }

        h3 {
          font-size: 1.75rem !important;
          font-weight: 700 !important;
          margin-top: 56px !important;
          margin-bottom: 28px !important;
          color: #1a1a1a !important;
          line-height: 1.2 !important;
          letter-spacing: -0.01em !important;
          transition: all 0.3s ease !important;
        }

        h3:hover {
          color: #FF8C42 !important;
          transform: translateX(2px) !important;
        }

        p {
          margin-bottom: 28px !important;
          line-height: 1.8 !important;
          text-align: left !important;
          position: relative !important;
          padding-left: 24px !important;
          transition: all 0.3s ease !important;
        }

        p:hover {
          color: #333 !important;
          transform: translateX(2px) !important;
        }

        p:first-of-type::first-letter {
          font-size: 5rem !important;
          font-weight: 800 !important;
          float: left !important;
          line-height: 0.8 !important;
          margin-right: 12px !important;
          margin-top: 0.05em !important;
          color: #FF8C42 !important;
          text-shadow: 0 2px 8px rgba(255,140,66,0.2) !important;
          transition: all 0.3s ease !important;
        }

        p:first-of-type:hover::first-letter {
          color: #FF6B6B !important;
          text-shadow: 0 4px 12px rgba(255,107,107,0.3) !important;
        }

        p:first-of-type {
          padding-left: 0 !important;
        }

        img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 20px !important;
          margin: 40px 0 !important;
          cursor: pointer !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
          transform: scale(1) !important;
          filter: brightness(1) !important;
        }

        img:hover {
          transform: scale(1.03) !important;
          box-shadow: 0 20px 60px rgba(255,140,66,0.3) !important;
          filter: brightness(1.05) !important;
        }

        a {
          color: #FF8C42 !important;
          text-decoration: none !important;
          position: relative !important;
          transition: color 0.2s ease !important;
          font-weight: 600 !important;
          background: linear-gradient(180deg, #FF8C42, #FF8C42) !important;
          background-size: 0% 2px !important;
          background-position: left bottom !important;
          background-repeat: no-repeat !important;
          padding-bottom: 2px !important;
        }

        a:hover {
          color: #FF6B6B !important;
          background-size: 100% 2px !important;
        }

        blockquote {
          border-left: 4px solid #FF8C42 !important;
          padding: 24px 32px !important;
          margin: 40px 0 !important;
          font-style: italic !important;
          color: #555 !important;
          background: linear-gradient(135deg, rgba(255,140,66,0.08), rgba(255,140,66,0.02)) !important;
          border-radius: 0 16px 16px 0 !important;
          position: relative !important;
          font-size: 1.1rem !important;
          line-height: 1.6 !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }

        blockquote:hover {
          background: linear-gradient(135deg, rgba(255,140,66,0.12), rgba(255,140,66,0.06)) !important;
          transform: translateX(4px) !important;
          border-left-color: #FF6B6B !important;
        }

        blockquote::before {
          content: """ !important;
          position: absolute !important;
          top: 8px !important;
          left: 12px !important;
          font-size: 3rem !important;
          color: rgba(255,140,66,0.2) !important;
          font-family: Georgia, serif !important;
          transition: all 0.3s ease !important;
        }

        blockquote:hover::before {
          color: rgba(255,107,107,0.3) !important;
          transform: scale(1.1) !important;
        }

        ul, ol {
          margin: 32px 0 !important;
          padding-left: 40px !important;
        }

        li {
          margin-bottom: 16px !important;
          line-height: 1.7 !important;
          position: relative !important;
        }

        ul li::marker {
          color: #FF8C42 !important;
          font-size: 1.2rem !important;
        }

        ul li {
          list-style: none !important;
          padding-left: 0 !important;
        }

        ul li::before {
          content: "•" !important;
          color: #FF8C42 !important;
          font-weight: bold !important;
          display: inline-block !important;
          width: 1em !important;
          margin-left: -1em !important;
        }

        @media (max-width: 1024px) {
          .hero-content {
            padding: 0 20px !important;
          }
          
          .hero-content > div {
            padding: 40px 24px !important;
          }
          
          div[style*="marginLeft: 120px"] {
            marginLeft: 60px !important;
            marginRight: 280px !important;
          }
          
          div[style*="padding: 40px 80px 80px"] {
            padding: 30px 40px 60px !important;
          }
        }

        @media (max-width: 768px) {
          div[style*="position: fixed"][style*="left: 40px"] {
            display: none !important;
          }
          
          div[style*="position: fixed"][style*="right: 40px"] {
            display: none !important;
          }
          
          div[style*="marginLeft: 120px"] {
            margin-left: 20px !important;
            margin-right: 20px !important;
          }
          
          div[style*="padding: 40px 80px 80px"] {
            padding: 20px 24px 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage;
