import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Add premium CSS animations
const styleSheet = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleSheet) {
  styleSheet.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }
    @keyframes glow {
      0%, 100% { 
        opacity: 0.3; 
        transform: scale(1); 
        box-shadow: 0 0 20px rgba(78, 205, 196, 0.4);
      }
      50% { 
        opacity: 0.8; 
        transform: scale(1.05); 
        box-shadow: 0 0 30px rgba(78, 205, 196, 0.6);
      }
    }
    @keyframes slideInUp {
      0% { 
        opacity: 0; 
        transform: translateY(30px); 
      }
      100% { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    
    /* Video styling to prevent blur */
    .contact-video {
      filter: none !important;
      -webkit-filter: none !important;
      -moz-filter: none !important;
      -o-filter: none !important;
      -ms-filter: none !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

const ContactUs = ({ isDarkMode, setIsDarkMode, navigate }) => {
  const mainRef = useRef(null);
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Context for cleanup
    const ctx = gsap.context(() => {
      // Hero Section Animation
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      heroTl
        .fromTo('.hero-title',
          { y: 100, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2 }
        )
        .fromTo('.hero-subtitle',
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        );

      // Contact Form Animation
      gsap.fromTo('.contact-form',
        {
          y: 80,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Contact Info Cards Animation
      gsap.utils.toArray('.info-card').forEach((card, index) => {
        gsap.fromTo(card,
          {
            y: 60,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Parallax Background
      gsap.to('.parallax-bg', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });

    }, mainRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('');
      }, 5000);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      details: ['info@truewaveites.com', 'support@truewaveites.com'],
      color: '#FF8C42'
    },
    {
      icon: '📞',
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+91 98765 43210'],
      color: '#FF6B6B'
    },
    {
      icon: '📍',
      title: 'Office',
      details: ['123 Business Ave', 'Suite 100, New York, NY 10001'],
      color: '#4ECDC4'
    }
  ];

  const services = [
    'Content Syndication Leads',
    'Marketing Qualified Leads',
    'Sales Qualified Leads',
    'Customized Programs',
    'General Inquiry'
  ];

  return (
    <>
      <div ref={mainRef} style={{
      minHeight: '100vh',
      backgroundColor: isDarkMode ? 'black' : 'white',
      color: isDarkMode ? 'black' : 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header Component */}
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        navigate={navigate} 
      />
      
      {/* Parallax Background */}
      <div className="parallax-bg" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '120%',
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 50%, white 100%)',
        zIndex: -1
      }} />

      {/* Hero Section */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px 80px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Video Background */}
        <video
          className="contact-video"
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2,
            opacity: 1.0,
            filter: isDarkMode ? 'none' : 'none'
          }}
        >
          <source src="/assets/contact background.mp4" type="video/mp4" />
        </video>
       
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${isDarkMode ? '#4ECDC4' : '#FF8C42'}20, transparent)`,
                filter: 'blur(2px)',
                animation: `float ${15 + (i * 3)}s ease-in-out infinite`,
                zIndex: 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h1 className="hero-title" style={{
            fontSize: 'clamp(3.5rem, 9vw, 5.5rem)',
            fontWeight: '900',
            marginBottom: '32px',
            background: `linear-gradient(135deg, #FF8C42 0%, #FF6B6B 35%, #4ECDC4 65%, #FFA500 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
            textShadow: `0 8px 32px ${isDarkMode ? 'rgba(78,205,196,0.4)' : 'rgba(255,140,66,0.3)'}`,
            filter: 'drop-shadow(0 4px 12px rgba(255,140,66,0.2))'
          }}>
            Contact Us
          </h1>
          <p className="hero-subtitle" style={{
            fontSize: '1.5rem',
            lineHeight: '1.7',
            maxWidth: '900px',
            margin: '0 auto 32px',
            color: isDarkMode ? 'white' : 'white',
            letterSpacing: '-0.005em',
            fontWeight: '500',
            textShadow: `0 4px 16px ${isDarkMode ? 'rgba(78,205,196,0.3)' : 'rgba(255,140,66,0.15)'}`,
            animation: 'slideInUp 1s ease-out'
          }}>
            Transform your B2B marketing with data-driven strategies and innovative solutions that deliver measurable results.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section style={{
        padding: '60px 40px 100px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '48px',
            alignItems: 'start'
          }}>
            {/* Contact Form */}
            <div className="contact-form" style={{
              background: isDarkMode 
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(255,255,255,0.8)',
              borderRadius: '16px',
              padding: '32px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              backdropFilter: 'blur(20px)',
              boxShadow: isDarkMode 
                ? '0 20px 40px rgba(0,0,0,0.3)' 
                : '0 20px 40px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '24px',
                color: isDarkMode ? 'white' : 'black',
                letterSpacing: '-0.02em'
              }}>
                Send us a Message
              </h2>

              {submitStatus === 'success' && (
                <div style={{
                  background: 'rgba(78,205,196,0.15)',
                  border: '1px solid #4ECDC4',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '20px',
                  color: '#4ECDC4',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}>
                  ✅ Thank you! We'll get back to you soon.
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} style={{
                display: 'grid',
                gap: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                  }}>
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                  }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                    }}
                  />
                </div>

                
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                  }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                      color: isDarkMode ? '#ffffff' : '#000000',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                    }}
                  />
                </div>

                <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isDarkMode ? '#4ECDC4' : '#FF8C42',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isDarkMode ? '0 4px 15px rgba(78,205,196,0.3)' : '0 4px 15px rgba(255,140,66,0.3)',
                  letterSpacing: '0.02em'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = isDarkMode ? '0 6px 20px rgba(78,205,196,0.4)' : '0 6px 20px rgba(255,140,66,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = isDarkMode ? '0 4px 15px rgba(78,205,196,0.3)' : '0 4px 15px rgba(255,140,66,0.3)';
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {/* Privacy Statement */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.03)' 
                  : 'rgba(0,0,0,0.03)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                lineHeight: '1.5',
                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                textAlign: 'left'
              }}>
                <p style={{ margin: 0 }}>
                  Your information is secure and will only be used to respond to your inquiry.
                </p>
              </div>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '24px',
                color: isDarkMode ? '#ffffff' : '#000000',
                letterSpacing: '-0.02em'
              }}>
                Get in Touch
              </h2>

              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {contactInfo.map((info, index) => (
                  <div key={index} className="info-card" style={{
                    background: isDarkMode 
                      ? 'rgba(255,255,255,0.03)'
                      : 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px'
                    }}>
                      <div style={{
                        fontSize: '1.5rem',
                        color: info.color,
                        flexShrink: 0
                      }}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          marginBottom: '8px',
                          color: isDarkMode ? '#ffffff' : '#000000'
                        }}>
                          {info.title}
                        </h3>
                        <div style={{
                          display: 'grid',
                          gap: '4px'
                        }}>
                          {info.details.map((detail, idx) => (
                            <p key={idx} style={{
                              fontSize: '0.9rem',
                              lineHeight: '1.4',
                              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                              margin: 0
                            }}>
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="info-card" style={{
                background: isDarkMode 
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                backdropFilter: 'blur(10px)',
                marginTop: '16px'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}>
                  Business Hours
                </h3>
                <div style={{
                  display: 'grid',
                  gap: '6px',
                  fontSize: '0.85rem',
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                }}>
                  <p style={{ margin: 0 }}>Mon - Fri: 9:00 AM - 6:00 PM EST</p>
                  <p style={{ margin: 0 }}>Saturday: 10:00 AM - 2:00 PM EST</p>
                  <p style={{ margin: 0 }}>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
      
      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />
    </>
  );
};

export default ContactUs;
