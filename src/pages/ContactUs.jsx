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
    @keyframes shimmer {
      0% { left: -100px; }
      50% { left: 100%; }
      100% { left: 100%; }
    }
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    @keyframes particle-float {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
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
  const headerRef = useRef(null);
  const lenisRef = useRef(null);
  
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

    // Store lenis ref for header scroll detection
    lenisRef.current = lenis;

    // GSAP Context for cleanup
    const ctx = gsap.context(() => {
      // Hero Section Animation
      const heroTl = gsap.timeline({
        defaults: { ease: 'power4.out' }
      });

      heroTl
        .fromTo('.hero-bg-video',
          { scale: 1.15, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2.0, ease: 'power2.out' }
        )
        .fromTo('.hero-title',
          { y: 100, opacity: 0, scale: 0.88, filter: 'blur(10px)' },
          { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.6 },
          '-=1.4'
        )
        .fromTo('.hero-subtitle',
          { y: 60, opacity: 0, scale: 0.93, filter: 'blur(8px)' },
          { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2 },
          '-=1.0'
        );

      // Contact Form Animation
      gsap.fromTo('.contact-form',
        {
          y: 80,
          opacity: 0,
          scale: 0.92,
          filter: 'blur(6px)',
          rotateX: 10
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          rotateX: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Form Input Fields Animation
      gsap.utils.toArray('.contact-form input, .contact-form textarea').forEach((input, index) => {
        gsap.fromTo(input,
          {
            y: 30,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: input,
              start: 'top 90%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Contact Info Cards Animation
      gsap.utils.toArray('.info-card').forEach((card, index) => {
        gsap.fromTo(card,
          {
            y: 60,
            opacity: 0,
            scale: 0.9,
            filter: 'blur(4px)',
            rotateY: 15
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            rotateY: 0,
            duration: 1.0,
            delay: index * 0.15,
            ease: 'power4.out',
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

  // Smart Header Scroll - Instant with no animations
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId;
    
    const updateHeaderPosition = () => {
      const header = headerRef.current;
      if (!header) return;
      
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - instantly hide header
        header.style.transition = 'none';
        header.style.transform = 'translateY(-120px)';
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - instantly show header
        header.style.transition = 'none';
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
      
      // Continue checking
      rafId = requestAnimationFrame(updateHeaderPosition);
    };
    
    // Start the RAF loop
    rafId = requestAnimationFrame(updateHeaderPosition);
    
    // Cleanup
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
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
        ref={headerRef}
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
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '140px 40px 100px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Video Background */}
        <video
          className="contact-video hero-bg-video"
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
            opacity: 0.6,
            filter: isDarkMode ? 'brightness(0.4)' : 'brightness(0.7)'
          }}
        >
          <source src="/assets/contact background.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isDarkMode
            ? 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.85) 100%)',
          zIndex: -1
        }} />

        {/* Animated Gradient Orbs */}
        <div className="hero-orb-1" style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,66,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 12s ease-in-out infinite, pulse-glow 6s ease-in-out infinite'
        }} />
        <div className="hero-orb-2" style={{
          position: 'absolute',
          bottom: '20%',
          left: '8%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.12) 0%, transparent 70%)',
          filter: 'blur(75px)',
          animation: 'float 15s ease-in-out infinite reverse, pulse-glow 7s ease-in-out infinite reverse'
        }} />

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
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${isDarkMode ? '#4ECDC4' : '#FF8C42'}15, transparent)`,
                filter: 'blur(1px)',
                animation: `particle-float ${20 + (i * 2)}s linear infinite`,
                animationDelay: `${i * 2}s`,
                zIndex: 1,
                left: `${5 + (i * 6)}%`,
                top: `${8 + (i * 6)}%`
              }}
            />
          ))}
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 24px',
            borderRadius: '50px',
            background: isDarkMode
              ? 'rgba(78,205,196,0.15)'
              : 'rgba(255,140,66,0.15)',
            border: `1px solid ${isDarkMode ? 'rgba(78,205,196,0.3)' : 'rgba(255,140,66,0.3)'}`,
            marginBottom: '32px',
            fontSize: '0.85rem',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: isDarkMode ? '#4ECDC4' : '#FF8C42'
          }}>
            Get in Touch
          </div>

          <h1 className="hero-title" style={{
            fontSize: 'clamp(4rem, 10vw, 6rem)',
            fontWeight: '800',
            marginBottom: '24px',
            background: isDarkMode
              ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #ffffff 100%)'
              : 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            Let's Start a Conversation
          </h1>
          <p className="hero-subtitle" style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 48px',
            color: isDarkMode ? 'rgba(255,255,255,0.85)' : 'rgba(30,41,59,0.85)',
            letterSpacing: '-0.01em',
            fontWeight: '400'
          }}>
            Ready to transform your B2B marketing? Our team of experts is here to help you achieve your goals with innovative strategies and data-driven solutions.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              background: isDarkMode
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.9)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              backdropFilter: 'blur(10px)',
              fontSize: '0.9rem',
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(30,41,59,0.9)',
              fontWeight: '500'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📧</span>
              info@truewaveites.com
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              background: isDarkMode
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.9)',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              backdropFilter: 'blur(10px)',
              fontSize: '0.9rem',
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(30,41,59,0.9)',
              fontWeight: '500'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📞</span>
              +1 (555) 123-4567
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section style={{
        padding: '100px 40px 140px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '64px',
            alignItems: 'start'
          }}>
            {/* Contact Form */}
            <div className="contact-form" style={{
              background: isDarkMode
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '48px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              backdropFilter: 'blur(30px)',
              boxShadow: isDarkMode
                ? '0 25px 50px rgba(0,0,0,0.4)'
                : '0 25px 50px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = isDarkMode
                ? '0 35px 70px rgba(0,0,0,0.5)'
                : '0 35px 70px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkMode
                ? '0 25px 50px rgba(0,0,0,0.4)'
                : '0 25px 50px rgba(0,0,0,0.1)';
            }}
            >
              {/* Glass Background Animation */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.6) 100%)',
                animation: 'rotate 30s linear infinite',
                pointerEvents: 'none'
              }} />

              {/* Glass Shimmer Effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: -100,
                width: '100px',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                animation: 'shimmer 4s ease-in-out infinite',
                pointerEvents: 'none'
              }} />

              {/* Glass Reflection Effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
                pointerEvents: 'none',
                borderRadius: '24px 24px 0 0'
              }} />

              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '50px',
                background: isDarkMode
                  ? 'rgba(78,205,196,0.1)'
                  : 'rgba(255,140,66,0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(78,205,196,0.2)' : 'rgba(255,140,66,0.2)'}`,
                marginBottom: '24px',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isDarkMode ? '#4ECDC4' : '#FF8C42'
              }}>
                Contact Form
              </div>

              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '12px',
                color: isDarkMode ? '#ffffff' : '#1e293b',
                letterSpacing: '-0.02em',
                lineHeight: '1.2'
              }}>
                Send us a Message
              </h2>

              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(30,41,59,0.6)',
                marginBottom: '32px',
                fontWeight: '400'
              }}>
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {submitStatus === 'success' && (
                <div style={{
                  background: isDarkMode
                    ? 'rgba(78,205,196,0.15)'
                    : 'rgba(78,205,196,0.1)',
                  border: '1px solid #4ECDC4',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  color: '#4ECDC4',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  animation: 'slideInUp 0.5s ease-out'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>✅</span>
                  Thank you! We'll get back to you soon.
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} style={{
                display: 'grid',
                gap: '24px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.02em',
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.8)'
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      fontSize: '1rem',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      outline: 'none',
                      boxShadow: 'none',
                      letterSpacing: '0.01em'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                      e.target.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(78,205,196,0.1)' : 'rgba(255,140,66,0.1)'}`;
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.02em',
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.8)'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      fontSize: '1rem',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      outline: 'none',
                      boxShadow: 'none',
                      letterSpacing: '0.01em'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                      e.target.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(78,205,196,0.1)' : 'rgba(255,140,66,0.1)'}`;
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.02em',
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.8)'
                  }}>
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      fontSize: '1rem',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      outline: 'none',
                      boxShadow: 'none',
                      letterSpacing: '0.01em'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                      e.target.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(78,205,196,0.1)' : 'rgba(255,140,66,0.1)'}`;
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.02em',
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.8)'
                  }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Your phone number"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      fontSize: '1rem',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      outline: 'none',
                      boxShadow: 'none',
                      letterSpacing: '0.01em'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                      e.target.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(78,205,196,0.1)' : 'rgba(255,140,66,0.1)'}`;
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>

                
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    letterSpacing: '0.02em',
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(30,41,59,0.8)'
                  }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Tell us about your project..."
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.95)',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      fontSize: '1rem',
                      resize: 'vertical',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxShadow: 'none',
                      letterSpacing: '0.01em',
                      lineHeight: '1.6'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = isDarkMode ? '#4ECDC4' : '#FF8C42';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,1)';
                      e.target.style.boxShadow = `0 0 0 3px ${isDarkMode ? 'rgba(78,205,196,0.1)' : 'rgba(255,140,66,0.1)'}`;
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
                      e.target.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>

                <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '18px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #4ECDC4 0%, #44A3AA 100%)'
                    : 'linear-gradient(135deg, #FF8C42 0%, #FF6B6B 100%)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isDarkMode
                    ? '0 8px 25px rgba(78,205,196,0.3)'
                    : '0 8px 25px rgba(255,140,66,0.3)',
                  letterSpacing: '0.03em',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-3px) scale(1.02)';
                    e.target.style.boxShadow = isDarkMode
                      ? '0 12px 35px rgba(78,205,196,0.4)'
                      : '0 12px 35px rgba(255,140,66,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = isDarkMode
                    ? '0 8px 25px rgba(78,205,196,0.3)'
                    : '0 8px 25px rgba(255,140,66,0.3)';
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {/* Privacy Statement */}
              <div style={{
                marginTop: '24px',
                padding: '16px 20px',
                background: isDarkMode
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.03)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(30,41,59,0.5)',
                textAlign: 'left',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
              }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🔒</span>
                  Your information is secure and will only be used to respond to your inquiry.
                </p>
              </div>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: '50px',
                background: isDarkMode
                  ? 'rgba(255,140,66,0.1)'
                  : 'rgba(255,140,66,0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(255,140,66,0.2)' : 'rgba(255,140,66,0.2)'}`,
                marginBottom: '24px',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isDarkMode ? '#FF8C42' : '#FF8C42'
              }}>
                Contact Info
              </div>

              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: isDarkMode ? '#ffffff' : '#1e293b',
                letterSpacing: '-0.02em',
                lineHeight: '1.2'
              }}>
                Get in Touch
              </h2>

              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(30,41,59,0.6)',
                marginBottom: '32px',
                fontWeight: '400'
              }}>
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>

              <div style={{
                display: 'grid',
                gap: '20px'
              }}>
                {contactInfo.map((info, index) => (
                  <div key={index} className="info-card" style={{
                    background: isDarkMode
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(255,255,255,0.9)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? '0 20px 40px rgba(0,0,0,0.3)'
                      : '0 20px 40px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    {/* Glass Background Animation */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.6) 100%)',
                      animation: 'rotate 30s linear infinite',
                      pointerEvents: 'none'
                    }} />

                    {/* Glass Shimmer Effect */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: -100,
                      width: '100px',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                      animation: 'shimmer 4s ease-in-out infinite',
                      pointerEvents: 'none'
                    }} />

                    {/* Icon Glow Effect */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: info.color,
                      opacity: 0.08,
                      filter: 'blur(30px)',
                      animation: 'pulse-glow 5s ease-in-out infinite',
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '20px'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        color: info.color,
                        flexShrink: 0,
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                      }}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          marginBottom: '12px',
                          color: isDarkMode ? '#ffffff' : '#1e293b',
                          letterSpacing: '-0.01em'
                        }}>
                          {info.title}
                        </h3>
                        <div style={{
                          display: 'grid',
                          gap: '6px'
                        }}>
                          {info.details.map((detail, idx) => (
                            <p key={idx} style={{
                              fontSize: '0.95rem',
                              lineHeight: '1.5',
                              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)',
                              margin: 0,
                              fontWeight: '400'
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
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(255,255,255,0.9)',
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                backdropFilter: 'blur(20px)',
                marginTop: '24px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = isDarkMode
                  ? '0 20px 40px rgba(0,0,0,0.3)'
                  : '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                {/* Glass Background Animation */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.6) 100%)',
                  animation: 'rotate 30s linear infinite',
                  pointerEvents: 'none'
                }} />

                {/* Glass Shimmer Effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: -100,
                  width: '100px',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                  animation: 'shimmer 4s ease-in-out infinite',
                  pointerEvents: 'none'
                }} />

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    fontSize: '1.8rem',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                  }}>
                    🕐
                  </div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    margin: 0,
                    color: isDarkMode ? '#ffffff' : '#1e293b',
                    letterSpacing: '-0.01em'
                  }}>
                    Business Hours
                  </h3>
                </div>
                <div style={{
                  display: 'grid',
                  gap: '10px',
                  fontSize: '0.95rem',
                  color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(30,41,59,0.7)',
                  fontWeight: '400',
                  lineHeight: '1.5'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                  }}>
                    <span>Mon - Fri</span>
                    <span style={{ fontWeight: '600', color: isDarkMode ? '#ffffff' : '#1e293b' }}>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
                  }}>
                    <span>Saturday</span>
                    <span style={{ fontWeight: '600', color: isDarkMode ? '#ffffff' : '#1e293b' }}>10:00 AM - 2:00 PM EST</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0'
                  }}>
                    <span>Sunday</span>
                    <span style={{ fontWeight: '600', color: isDarkMode ? '#4ECDC4' : '#FF8C42' }}>Closed</span>
                  </div>
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
