import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TiltedCard from '../components/TiltedCard';
import SimpleScrollStack, { SimpleScrollStackItem } from '../components/SimpleScrollStack';
import TextType from '../components/TextType';
import { useNavigate } from 'react-router-dom';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Solutions = ({ isDarkMode, setIsDarkMode, navigate }) => {
  const mainRef = useRef(null);

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

    // Integrate Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // RAF loop with proper cleanup
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Initial ScrollTrigger refresh to ensure proper positioning
    ScrollTrigger.refresh();

    // GSAP Context for cleanup
    const ctx = gsap.context(() => {
      // Hero section animations removed - content displays statically

      // Section Titles Animation
      gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.fromTo(title,
          {
            y: 30,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Feature Lists Animation
      gsap.utils.toArray('.feature-item').forEach((item, index) => {
        gsap.fromTo(item,
          {
            x: -30,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Parallax Background - optimized with reduced scrub for smoother performance
      gsap.to('.parallax-bg', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

    }, mainRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top immediately
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    
    // Re-enable scroll restoration after a delay
    setTimeout(() => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    }, 100);
  }, []);

  const solutions = [
    {
      id: 'intent-marketing',
      title: 'Intent Marketing',
      description: 'Attract potential customers by targeting the intent topics relevant to your business',
      icon: '🎯',
      color: '#FF8C42',
      image: '/assets/solution_intent_marketing-removebg-preview.png'
    },
    {
      id: 'account-based-marketing',
      title: 'Account Based Marketing (ABM)',
      description: 'Obtain leads from your designated target companies',
      icon: '🏢',
      color: '#FF6B6B',
      image: '/assets/solution_account_based_marketing-removebg-preview.png'
    },
    {
      id: 'install-base-marketing',
      title: 'Install Base Marketing',
      description: 'Gather leads by utilizing technographic data for precise audience segmentation',
      icon: '💻',
      color: '#4ECDC4',
      image: '/assets/solution installed based marketing.jpg'
    },
    {
      id: 'demographic-firmographic',
      title: 'Demographic & Firmographic',
      description: 'Acquire leads by employing filters based on targeted buyer personas',
      icon: '👥',
      color: '#FFA500',
      image: '/assets/solution_demographic-removebg-preview.png'
    }
  ];

  const contentSyndicationFeatures = [
    'OTP-in leads and enthralling hand raisers',
    'Data-driven approach with advanced analytics',
    'Target ideal customer profile (ICP)',
    'Deliver content to right people at right time',
    'Drive brand awareness and website traffic',
    'Generate new leads and revenue'
  ];

  const mqlFeatures = [
    'Consistent and steady stream of MQLs',
    'Customized outreach strategies',
    'Cutting-edge technologies and techniques',
    'Data-driven approach for promising prospects',
    'Multi-channel outreach (email, social media)',
    'Drive webinar and event registrations'
  ];

  const sqlFeatures = [
    'High-quality SQLs ready to engage',
    'Detailed lead qualification information',
    'Deeper understanding of target audience',
    'Target prospects more likely to buy',
    'Increase win rates and achieve targets',
    'Personalized nurturing campaigns'
  ];

  const customizedPrograms = [
    'Double Touch Leads',
    'Subscribed Qualified Leads',
    'Engaged Qualified Leads',
    'Event Registration Leads',
    'Highly Qualified Leads (HQLs)',
    'BANT',
    'Survey Qualified Leads',
    'Data Enrichment'
  ];

  return (
    <>
      <div ref={mainRef} style={{
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        color: isDarkMode ? '#ffffff' : '#000000',
        position: 'relative',
        overflow: 'visible',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        paddingBottom: '100px',
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}>
      {/* Header Component */}
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        navigate={navigate} 
      />
      
      {/* Parallax Background */}
      <div className="parallax-bg" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '120%',
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%)',
        zIndex: -1,
        willChange: 'transform',
        transform: 'translateZ(0)'
      }} />

      {/* Enhanced Hero Section with Premium Design */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 40px 80px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Enhanced Video Background with Effects */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '120%',
            height: '120%',
            objectFit: 'cover',
            zIndex: -2,
            filter: 'brightness(1.0) contrast(1.4) saturate(1.5)',
            willChange: 'transform',
            transform: 'translateZ(0) scale(1.1)'
          }}
        >
          <source src="/assets/solution background.mp4" type="video/mp4" />
        </video>

        {/* Animated Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isDarkMode 
            ? 'linear-gradient(135deg,rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)'
            : 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
          zIndex: -1,
          animation: 'shimmer 8s ease-in-out infinite'
        }} />

       
        {/* Hero Content with Enhanced Design */}
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px'
        }}>
          
          {/* Enhanced Hero Title */}
          <h1 className="hero-title" style={{
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            fontWeight: '900',
            marginBottom: '0',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 30%, #ffffff 60%, #e9ecef 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.2))',
            lineHeight: '1.1',
            maxWidth: '1200px'
          }}>
            Our Solutions
          </h1>

          {/* Enhanced Subtitle with Better Typography */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <p className="hero-subtitle" style={{
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '-0.01em',
              fontWeight: '500',
              textShadow: '0 2px 10px rgba(0,0,0,0.4)',
              margin: '0'
            }}>
              Implement accurate data targeting strategies with highly effective lead generation initiatives
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '400'
            }}>
              <span style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'black',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <span>🎯</span> Precision Targeting
              </span>
              <span style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'black',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <span>📈</span> High Conversion
              </span>
              <span style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'black',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <span>🚀</span> Optimal Results
              </span>
            </div>
          </div>

                  </div>
      </section>

      {/* Enhanced CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 20px rgba(255,255,255,0.3)); }
          50% { filter: brightness(1.2) drop-shadow(0 0 40px rgba(255,255,255,0.5)); }
        }
        
        @keyframes slideInFromTop {
          0% { transform: translateY(-100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInFromBottom {
          0% { transform: translateY(100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInScale {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .hero-title {
          animation: slideInFromTop 1.2s ease-out, glow 3s ease-in-out infinite;
        }
        
        .hero-subtitle {
          animation: slideInFromBottom 1.4s ease-out;
        }
        
        button {
          animation: fadeInScale 1.6s ease-out;
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px red;
        }
      `}</style>

      {/* Main Solutions with Enhanced ScrollStack Effect */}
      <section style={{
        padding: '80px 20px 0px 20px',
        position: 'relative',
        zIndex: 1,
        background: isDarkMode
          ? 'radial-gradient(ellipse at 20% 30%, rgba(255,140,66,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(78,205,196,0.12) 0%, transparent 50%), linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'radial-gradient(ellipse at 20% 30%, rgba(255,140,66,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(78,205,196,0.06) 0%, transparent 50%), linear-gradient(135deg, white 0%, white 50%, white 100%)',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(255,140,66,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,140,66,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(78,205,196,0.04) 0%, transparent 70%)',
          filter: 'blur(35px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Enhanced Section Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px'
          }}>
                        
            <h2 style={{
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              fontWeight: '900',
              marginBottom: '0',
              background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B6B 50%, #4ECDC4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <TextType 
                text={["Our Solutions"]}
                typingSpeed={75}
                pauseDuration={2000}
                showCursor={false}
                startOnVisible={true}
                initialDelay={500}
              />
            </h2>
            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              lineHeight: '1.7',
              color: isDarkMode ? 'white' : 'black',
              maxWidth: '700px',
              margin: '0',
              fontWeight: '400'
            }}>
              Transform your B2B marketing with our comprehensive suite of data-driven solutions designed to accelerate growth and maximize ROI
            </p>
          </div>
          
          <SimpleScrollStack>
            {solutions.map((solution, index) => (
              <SimpleScrollStackItem key={index} className={`solution-card-${index}`}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '60px',
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 50%, rgba(255,255,255,0.92) 100%)',
                  borderRadius: '40px',
                  padding: '80px',
                  border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)'}`,
                  backdropFilter: 'none',
                  boxShadow: isDarkMode 
                    ? '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1), inset 0 2px 0 rgba(255,255,255,0.15), 0 0 100px rgba(255,140,66,0.1)'
                    : '0 40px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8), inset 0 2px 0 rgba(255,255,255,0.9), 0 0 100px rgba(78,205,196,0.05)',
                  maxWidth: '1200px',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  transform: 'translateZ(0)'
                }}>
                  {/* Enhanced gradient overlay */}
                 <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${solution.color}00, ${solution.color}66, ${solution.color}00)`,
                    opacity: 0.8,
                    animation: 'shimmer 3s ease-in-out infinite'
                  }} />
                  
                  {/* Corner accent with glow */}
                  <div style={{
                    position: 'absolute',
                    top: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${solution.color}30, transparent)`,
                    border: `3px solid ${solution.color}60`,
                    boxShadow: `0 0 20px ${solution.color}40`,
                    animation: 'pulse 2s ease-in-out infinite'
                  }} />
                  
                  {/* Number indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '30px',
                    left: '30px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '15px',
                    background: `linear-gradient(135deg, ${solution.color}, ${solution.color}80)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    boxShadow: `0 8px 16px ${solution.color}40`
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  {/* Left Side - Enhanced Text Content */}
                  <div style={{ flex: 1, position: 'relative', paddingLeft: '20px' }}>
                    {/* Enhanced background pattern */}
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '-30px',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${solution.color}15, transparent)`,
                      filter: 'blur(25px)',
                      animation: 'float 4s ease-in-out infinite'
                    }} />
                    
                    {/* Enhanced icon with glow */}
                    <div style={{
                      fontSize: '6rem',
                      marginBottom: '35px',
                      color: solution.color,
                      filter: `drop-shadow(0 6px 20px ${solution.color}40) drop-shadow(0 0 30px ${solution.color}20)`,
                      transform: 'translateY(0)',
                      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      animation: 'float 3s ease-in-out infinite',
                      position: 'relative',
                      zIndex: 2
                    }}>
                      {solution.icon}
                    </div>
                    
                    {/* Enhanced title with theme-optimized colors */}
                    <h3 style={{
                      fontSize: '3.2rem',
                      fontWeight: '800',
                      marginBottom: '28px',
                      lineHeight: '1.05',
                      letterSpacing: '-0.025em',
                      // Fallback color for browsers that don't support background-clip
                      color: isDarkMode ? solution.color : solution.color,
                      background: isDarkMode 
                        ? `linear-gradient(135deg, #f8f9fa, ${solution.color}, ${solution.color}CC)`
                        : 'none',
                      WebkitBackgroundClip: isDarkMode ? 'text' : 'initial',
                      WebkitTextFillColor: isDarkMode ? 'transparent' : 'initial',
                      backgroundClip: isDarkMode ? 'text' : 'initial',
                      // Remove conflicting shadows in light theme
                      textShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
                      filter: isDarkMode ? 'drop-shadow(0 0 2px rgba(255,255,255,0.3))' : 'none',
                      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      position: 'relative',
                      zIndex: 2,
                      // Fix for Safari and WebKit browsers
                      WebkitTextStroke: '0.5px transparent',
                      // Ensure smooth rendering
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      // Optimize for different browsers
                      willChange: 'transform',
                      // Prevent subpixel rendering issues
                      fontSmooth: 'always',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>
                      {solution.title}
                    </h3>
                    
                    {/* Enhanced description with theme-optimized colors */}
                    <p style={{
                      fontSize: '1.4rem',
                      lineHeight: '1.8',
                      color: isDarkMode ? '#e2e8f0' : '#4a5568',
                      fontWeight: '400',
                      maxWidth: '520px',
                      position: 'relative',
                      paddingLeft: '24px',
                      borderLeft: `4px solid ${solution.color}`,
                      transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      textShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)',
                      zIndex: 2
                    }}>
                      {solution.description}
                    </p>
                    
                                      </div>
                  
                  {/* Right Side - Enhanced Image */}
                  <div style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {/* Decorative background circle */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '400px',
                      height: '400px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${solution.color}10, transparent)`,
                      filter: 'blur(30px)',
                      animation: 'pulse 4s ease-in-out infinite',
                      zIndex: 1
                    }} />
                                      
                    {/* Enhanced image container */}
                    <div style={{
                      position: 'relative',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      transform: 'perspective(1200px) rotateY(0deg)',
                      transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                      boxShadow: `0 25px 50px ${solution.color}30, 0 0 0 1px ${solution.color}20`,
                      background: isDarkMode 
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.95) 100%)',
                      padding: '4px',
                      zIndex: 2
                    }}>
                      <div style={{
                        borderRadius: '20px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img 
                          src={solution.image}
                          alt={solution.title}
                          style={{
                            width: '100%',
                            maxWidth: '450px',
                            height: 'auto',
                            borderRadius: '20px',
                            objectFit: 'cover',
                            display: 'block',
                            filter: isDarkMode 
                              ? 'contrast(1.3) brightness(1.03) saturate(1.3)' 
                              : 'contrast(1.3) brightness(1.07) saturate(1.3)',
                            transform: 'translateZ(0) scale(1.02)',
                            backfaceVisibility: 'hidden',
                            imageRendering: 'auto',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                            willChange: 'transform',
                            transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                          }}
                        />
                       
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div style={{
                      position: 'absolute',
                      top: '20%',
                      right: '10%',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${solution.color}60, ${solution.color}20)`,
                      animation: 'float 5s ease-in-out infinite',
                      zIndex: 1
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '5%',
                      left: '15%',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${solution.color}40, transparent)`,
                      animation: 'float 4s ease-in-out infinite reverse',
                      zIndex: 1
                    }} />
                  </div>
                </div>
              </SimpleScrollStackItem>
            ))}
          </SimpleScrollStack>
        </div>
      </section>
      
      {/* Enhanced Content Syndication Leads Section */}
      <section id="content-syndication" style={{
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1,
        background: isDarkMode
          ? 'linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 50%, white 100%)',
        overflow: 'hidden',
        marginTop: '-60px'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,66,0.1) 0%, transparent 70%)',
          filter: 'blur(30px)'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 className="section-title" style={{
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '24px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B6B 50%, #FF8C42 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            <TextType 
              text={["Content Syndication Leads"]}
              typingSpeed={75}
              pauseDuration={2000}
              showCursor={false}
              startOnVisible={true}
              initialDelay={500}
            />
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '60px',
            alignItems: 'center'
          }}>
            <div style={{ padding: '40px', background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.95) 100%)',
              borderRadius: '24px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
              backdropFilter: 'blur(20px)'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '24px',
                color: isDarkMode ? '#ffffff' : '#000000',
                background: 'linear-gradient(135deg, #FF8C42, #FF6B6B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em'
              }}>
                Looking for OTP-in leads and enthralling hand raisers?
              </h3>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#d0d0d0' : '#4a5568',
                marginBottom: '24px',
                fontWeight: '400'
              }}>
                We at Truewave Ites specialize in content syndication leads, helping businesses of all sizes generate targeted leads that convert into paying customers. Our team of experts works with you to understand your business, your target audience, and your goals, developing a custom content syndication strategy that delivers measurable results.
              </p>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#d0d0d0' : '#4a5568',
                marginBottom: '24px',
                fontWeight: '400'
              }}>
                We take a data-driven approach to content syndication, leveraging advanced analytics and targeting capabilities to identify the right ideal customer profile (ICP) for your content, enabling us to deliver your content to the right people at the right time through right platform.
              </p>
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#d0d0d0' : '#4a5568',
                fontWeight: '400'
              }}>
                Whether you are looking to drive brand awareness, increase website traffic, or generate new leads and revenue, our content syndication services can help you achieve your goals.
              </p>
            </div>
            <div>
              <TiltedCard
                imageSrc="/assets/Content Syndication Leads.jpg"
                altText="Content Syndication Leads"
                captionText="Content Syndication Leads"
                containerHeight="500px"
                containerWidth="100%"
                imageHeight="500px"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.15}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
                overlayContent={null}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Marketing Qualified Leads Section */}
      <section id="marketing-qualified" style={{
        padding: '40px 40px',
        position: 'relative',
        zIndex: 1,
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 50%, white 100%)',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)',
          filter: 'blur(35px)',
          animation: 'float 7s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '12%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.06) 0%, transparent 70%)',
          filter: 'blur(25px)',
          animation: 'float 5s ease-in-out infinite reverse'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 className="section-title" style={{
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '48px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FF6B6B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            <TextType 
              text={["Marketing Qualified Leads"]}
              typingSpeed={75}
              pauseDuration={2000}
              showCursor={false}
              startOnVisible={true}
              initialDelay={500}
            />
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '80px',
            alignItems: 'center'
          }}>
            <div>
              <TiltedCard
                imageSrc="/assets/Marketing Qualified Leads.png"
                altText="Marketing Qualified Leads"
                captionText="Marketing Qualified Leads"
                containerHeight="450px"
                containerWidth="550px"
                imageHeight="450px"
                imageWidth="550px"
                rotateAmplitude={12}
                scaleOnHover={1.15}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
                overlayContent={null}
                borderRadius="20px"
              />
            </div>
            <div style={{ padding: '40px', background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
              borderRadius: '32px',
              border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'}`,
              backdropFilter: 'none',
              boxShadow: isDarkMode 
                ? '0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 2px 0 rgba(255,255,255,0.1)'
                : '0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5), inset 0 2px 0 rgba(255,255,255,0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #FF6B6B00, #FF6B6B66, #FF6B6B00)',
                opacity: 0.8,
                animation: 'shimmer 3s ease-in-out infinite'
              }} />
              
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '24px',
                color: isDarkMode ? '#ffffff' : '#000000',
                background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em'
              }}>
                Strategic Lead Generation
              </h3>
              
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#e2e8f0' : '#4a5568',
                fontWeight: '400',
                marginBottom: '20px'
              }}>
                Maintaining a consistent stream of high-quality Marketing Qualified Leads (MQLs) is crucial for a healthy marketing funnel. We develop customized outreach strategies that align with your unique business objectives.
              </p>
              
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#e2e8f0' : '#4a5568',
                fontWeight: '400',
                marginBottom: '24px'
              }}>
                Our data-driven approach identifies the most promising prospects and tailors messaging to resonate with their needs and interests. We leverage cutting-edge technologies to optimize campaigns and drive measurable results.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: isDarkMode 
                  ? 'rgba(255,107,107,0.1)' 
                  : 'rgba(255,107,107,0.05)',
                borderRadius: '16px',
                border: `1px solid ${isDarkMode ? 'rgba(255,107,107,0.3)' : 'rgba(255,107,107,0.2)'}`,
                backdropFilter: 'blur(10px)',
                color: isDarkMode ? '#ffffff' : '#FF6B6B',
                fontSize: '1rem',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
                Targeted Multi-Channel Outreach
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Sales Qualified Leads Section */}
      <section id="sales-qualified" style={{
        padding: '40px 40px',
        position: 'relative',
        zIndex: 1,
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 50%, white 100%)',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '8%',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'float 6s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,165,0,0.06) 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'float 4s ease-in-out infinite'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 className="section-title" style={{
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '48px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #4ECDC4 0%, #FFA500 50%, #4ECDC4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            <TextType 
              text={["Sales Qualified Leads"]}
              typingSpeed={75}
              pauseDuration={2000}
              showCursor={false}
              startOnVisible={true}
              initialDelay={500}
            />
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '80px',
            alignItems: 'center'
          }}>
            <div style={{ padding: '40px', background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
              borderRadius: '32px',
              border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'}`,
              backdropFilter: 'none',
              boxShadow: isDarkMode 
                ? '0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 2px 0 rgba(255,255,255,0.1)'
                : '0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5), inset 0 2px 0 rgba(255,255,255,0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4ECDC400, #4ECDC466, #4ECDC400)',
                opacity: 0.8,
                animation: 'shimmer 3s ease-in-out infinite'
              }} />
              
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '24px',
                color: isDarkMode ? '#ffffff' : '#000000',
                background: 'linear-gradient(135deg, #4ECDC4, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em'
              }}>
                Revenue-Ready Leads
              </h3>
              
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#e2e8f0' : '#4a5568',
                fontWeight: '400',
                marginBottom: '20px'
              }}>
                Sales Qualified Leads (SQLs) are the lifeblood of successful sales organizations. We specialize in generating high-quality SQLs ready to engage with your sales team and convert into revenue.
              </p>
              
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#e2e8f0' : '#4a5568',
                fontWeight: '400',
                marginBottom: '24px'
              }}>
                Our detailed qualification process provides deep insights into your target audience's needs, while our targeting approach focuses on prospects most likely to convert, increasing your win rates.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: isDarkMode 
                  ? 'rgba(78,205,196,0.1)' 
                  : 'rgba(78,205,196,0.05)',
                borderRadius: '16px',
                border: `1px solid ${isDarkMode ? 'rgba(78,205,196,0.3)' : 'rgba(78,205,196,0.2)'}`,
                backdropFilter: 'blur(10px)',
                color: isDarkMode ? '#ffffff' : '#4ECDC4',
                fontSize: '1rem',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
                High Conversion Potential
              </div>
            </div>
            <div>
              <TiltedCard
                imageSrc="/assets/Sales Qualified Leads.png"
                altText="Sales Qualified Leads"
                captionText="Sales Qualified Leads"
                containerHeight="470px"
                containerWidth="100%"
                imageHeight="470px"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.15}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
                overlayContent={null}
                borderRadius="20px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Personalized Programs Section */}
      <section id="customized-programs" style={{
        padding: '40px 40px',
        position: 'relative',
        zIndex: 1,
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 50%, white 100%)',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '15%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,165,0,0.08) 0%, transparent 70%)',
          filter: 'blur(25px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '15%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,66,0.06) 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h2 className="section-title" style={{
            fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '48px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FFA500 0%, #FF8C42 50%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}>
            <TextType 
              text={["Personalized Programs"]}
              typingSpeed={75}
              pauseDuration={2000}
              showCursor={false}
              startOnVisible={true}
              initialDelay={500}
            />
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '80px',
            alignItems: 'center'
          }}>
            <TiltedCard
              imageSrc="/assets/Personalized Programs.jpg"
              altText="Personalized Programs"
              captionText="Personalized Programs"
              containerHeight="400px"
              containerWidth="100%"
              imageHeight="400px"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.15}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
              overlayContent={null}
              borderRadius="20px"
            />
            <div style={{ padding: '40px', background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)',
              borderRadius: '32px',
              border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'}`,
              backdropFilter: 'none',
              boxShadow: isDarkMode 
                ? '0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 2px 0 rgba(255,255,255,0.1)'
                : '0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5), inset 0 2px 0 rgba(255,255,255,0.8)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #FFA50000, #FFA50066, #FFA50000)',
                opacity: 0.8,
                animation: 'shimmer 3s ease-in-out infinite'
              }} />
              
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '24px',
                color: isDarkMode ? '#ffffff' : '#000000',
                background: 'linear-gradient(135deg, #FFA500, #FF8C42)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.01em'
              }}>
                Custom-Tailored Solutions
              </h3>
              
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#e2e8f0' : '#4a5568',
                fontWeight: '400',
                marginBottom: '20px'
              }}>
                We offer comprehensive monthly programs with customized qualification initiatives. Our approach combines omnichannel strategies with hybrid channels to deliver consistent lead flow throughout the entire customer journey.
              </p>
              
              <p style={{
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#e2e8f0' : '#4a5568',
                fontWeight: '400',
                marginBottom: '24px'
              }}>
                Programs cover data expansion, cleansing, appends, intent data lists, and technographic targeting with automated nurturing campaigns from awareness to conversion.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: isDarkMode 
                  ? 'rgba(255,165,0,0.1)' 
                  : 'rgba(255,165,0,0.05)',
                borderRadius: '16px',
                border: `1px solid ${isDarkMode ? 'rgba(255,165,0,0.2)' : 'rgba(255,165,0,0.1)'}`,
                backdropFilter: 'blur(10px)',
                color: isDarkMode ? '#ffffff' : '#FFA500',
                fontSize: '1rem',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🚀</span>
                BANT-Qualified Programs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Main Solutions Section */}
      <section style={{
        padding: '140px 40px 60px 40px',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title" style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B6B 50%, #4ECDC4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Drive Growth With Innovative B2B Marketing!
          </h2>
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 40px',
            color: isDarkMode ? '#e0e0e0' : '#333333'
          }}>
            Together with our clients, we build differentiated B2B brands with fresh ideas that challenge convention, unexpected design that surprises and delights, and engaging experiences along the customer journey. We combine strong expertise across consulting, media activation and data functions to drive unified customer experiences across strategic audiences and accounts.
          </p>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto',
            color: isDarkMode ? '#e0e0e0' : '#333333'
          }}>
            By coloring outside of the traditional agency lines we break down silos, achieving measurable business success for marketing teams and their brands.
          </p>
        </div>
      </section>
    </div>
      <div style={{
        position: 'relative',
        width: '100%',
        marginTop: '0px',
        zIndex: 10,
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF'
      }}>
        <Footer isDarkMode={isDarkMode} />
      </div>
    </>
  );
};

export default Solutions;
