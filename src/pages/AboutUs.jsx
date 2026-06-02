import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TextType from '../components/TextType';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Add sophisticated CSS animations
const styleSheet = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleSheet) {
  styleSheet.textContent = `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes particle-float {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
    }
    .premium-gradient {
      background-size: 200% 200%;
      animation: gradient-shift 8s ease infinite;
    }
  `;
  document.head.appendChild(styleSheet);
}

// Premium Scroll-Based Progressive Text Reveal Component
const AnimatedTextSection = ({ isDarkMode }) => {
  const sectionRef = useRef(null);
  const wordsContainerRef = useRef(null);
  const wordsRef = useRef([]);

  // Split text into paragraphs and words
  const textContent = [
    "We aim to be a trusted partner for businesses looking to improve their online presence, increase brand awareness, and drive more traffic to their website.",
    "We understand that B2B lead generation can be a complex and challenging process, and that's why we are here to help. Our team of experienced professionals has a proven track record of success in generating high-quality leads for businesses across multiple industries.",
    "We believe that our success is measured by the success of our clients, and that's why we are committed to delivering exceptional service, measurable results, and continuous improvement. Our vision is to become the go-to partner for businesses looking to grow their online presence and generate more leads."
  ];

  // Split text into words and create spans with enhanced styling
  const createWordElements = () => {
    const elements = [];
    textContent.forEach((paragraph, pIndex) => {
      const words = paragraph.split(' ');
      words.forEach((word, wIndex) => {
        elements.push(
          <span
            key={`${pIndex}-${wIndex}`}
            ref={el => {
              if (el) wordsRef.current.push(el);
            }}
            className="animated-word"
            style={{
              display: 'inline-block',
              marginRight: '0.3em',
              marginBottom: '0.15em',
              willChange: 'transform, opacity, filter',
              fontSize: '1.3rem',
              lineHeight: '1.9',
              color: isDarkMode ? '' : '#2d3748',
              fontWeight: '500',
              letterSpacing: '-0.02em',
              verticalAlign: 'top',
              position: 'relative',
              textShadow: isDarkMode 
                ? '0 2px 8px rgba(78,205,196,0.3)' 
                : '0 2px 8px rgba(14,165,233,0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            {word}
          </span>
        );
      });
      // Add paragraph break with enhanced styling
      if (pIndex < textContent.length - 1) {
        elements.push(
          <br 
            key={`br-${pIndex}`} 
            style={{ 
              display: 'block', 
              marginBottom: '32px',
              position: 'relative'
            }} 
          />
        );
      }
    });
    return elements;
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state for all words with enhanced effects
      gsap.set(wordsRef.current, {
        opacity: 0.05,
        y: 30,
        filter: 'blur(1px)',
        transform: 'translateY(30px) scale(0.95)',
        color: isDarkMode ? '#4ECDC4' : '#0ea5e9'
      });

      // Create enhanced scroll-based progressive reveal
      gsap.to(wordsRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transform: 'translateY(0px) scale(1)',
        color: isDarkMode ? 'white' : 'black',
        duration: 0.2,
        ease: 'power2.out',
        stagger: {
          each: 0.01,
          from: 'start',
          onStart: function() {
            gsap.set(this.targets, { willChange: 'auto' });
          },
          onComplete: function() {
            gsap.set(this.targets, { willChange: 'auto' });
          }
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'bottom 35%',
          scrub: 0.4,
          invalidateOnRefresh: true
        }
      });

      // Add subtle hover effects for individual words
      wordsRef.current.forEach((word, index) => {
        if (word) {
          word.addEventListener('mouseenter', () => {
            gsap.to(word, {
              scale: 1.05,
              color: isDarkMode ? '#4ECDC4' : '#0ea5e9',
              duration: 0.3,
              ease: 'power2.out'
            });
          });

          word.addEventListener('mouseleave', () => {
            gsap.to(word, {
              scale: 1,
              color: isDarkMode ? 'white' : 'black',
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={sectionRef}
      style={{
        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        borderRadius: '24px',
        padding: '40px 40px 60px',
        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        minHeight: '300px'
      }}
    >
      <div ref={wordsContainerRef} style={{ display: 'block' }}>
        {createWordElements()}
      </div>
    </div>
  );
};

const AboutUs = ({ isDarkMode, setIsDarkMode, navigate }) => {
  const mainRef = useRef(null);
  const videoRef = useRef(null);
  const headerRef = useRef(null);
  const lenisRef = useRef(null);

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
        )
        .fromTo('.video-container',
          { scale: 0.8, opacity: 0, rotation: 5 },
          { scale: 1, opacity: 1, rotation: 0, duration: 1.0 },
          '-=0.4'
        );

      // Story Section Animation
      gsap.utils.toArray('.story-card').forEach((card, index) => {
        gsap.fromTo(card,
          {
            y: 80,
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

      // Timeline Animation
      gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.fromTo(item,
          {
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'bottom 20%',
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

      // Helper function to safely animate elements
      const safeAnimate = (elements, animationProps, triggerElement = null) => {
        if (!elements || elements.length === 0) return;
        
        const scrollTriggerProps = triggerElement ? {
          trigger: triggerElement,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        } : undefined;

        elements.forEach(element => {
          if (element) {
            gsap.fromTo(element, animationProps.from, {
              ...animationProps.to,
              scrollTrigger: scrollTriggerProps
            });
          }
        });
      };

      // Helper function to safely set initial state
      const safeSet = (elements, props) => {
        if (!elements || elements.length === 0) return;
        gsap.set(elements, props);
      };

      // Helper function to safely create floating animation
      const safeFloat = (elements, baseDuration = 4) => {
        if (!elements || elements.length === 0) return;
        elements.forEach((element, index) => {
          if (element) {
            gsap.to(element, {
              y: -20 - (index * 5),
              duration: baseDuration + (index * 0.5),
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
        });
      };

      // Premium Hero Section Animations
      const heroSection = gsap.utils.toArray('.hero-section');
      const heroTitle = gsap.utils.toArray('.hero-title');
      const heroSubtitle = gsap.utils.toArray('.hero-subtitle');
      const heroBadge = gsap.utils.toArray('.hero-badge');
      const heroBgImage = gsap.utils.toArray('.hero-bg-image');
      const heroOrbs = gsap.utils.toArray('.hero-orb-1, .hero-orb-2');

      // Only run animations if elements exist
      if (heroSection.length > 0) {
        // Hero background parallax
        if (heroBgImage.length > 0) {
          gsap.to(heroBgImage, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection[0],
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5
            }
          });
        }

        // Hero orbs floating animation
        safeFloat(heroOrbs, 4);

        // Hero elements entrance
        safeAnimate(heroBadge, {
          from: { opacity: 0, y: -30, scale: 0.9 },
          to: { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
        }, heroSection[0]);

        safeAnimate(heroTitle, {
          from: { opacity: 0, y: 60, scale: 0.95 },
          to: { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power3.out' }
        }, heroSection[0]);

        safeAnimate(heroSubtitle, {
          from: { opacity: 0, y: 40, scale: 0.98 },
          to: { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: 0.3, ease: 'power2.out' }
        }, heroSection[0]);
      }

      // Vision Section Animations
      const visionSection = gsap.utils.toArray('.vision-section');
      const sectionTitle = gsap.utils.toArray('.section-title');
      const visionOrbs = gsap.utils.toArray('.vision-orb-1, .vision-orb-2');

      if (visionSection.length > 0) {
        safeFloat(visionOrbs, 5);
        safeAnimate(sectionTitle, {
          from: { opacity: 0, y: 50, scale: 0.95 },
          to: { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'power3.out' }
        }, visionSection[0]);
      }

      // Strategy Section Animations
      const strategySection = gsap.utils.toArray('.strategy-section');
      const strategyOrbs = gsap.utils.toArray('.strategy-orb-1, .strategy-orb-2');
      const premiumCards = gsap.utils.toArray('.premium-interactive-card');

      if (strategySection.length > 0) {
        safeFloat(strategyOrbs, 6);

        // Premium Interactive Cards Animation
        if (premiumCards.length > 0) {
          safeSet(premiumCards, {
            opacity: 0,
            y: 100,
            scale: 0.9,
            filter: 'blur(8px)',
            rotateX: 5
          });

          gsap.to(premiumCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            rotateX: 0,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.25,
            scrollTrigger: {
              trigger: strategySection[0],
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          });
        }
      }

      // CTA Section Animations
      const ctaSection = gsap.utils.toArray('.cta-section');
      const ctaBadge = gsap.utils.toArray('.cta-badge');
      const ctaTitle = gsap.utils.toArray('.cta-title');
      const ctaOrbs = gsap.utils.toArray('.cta-orb-1, .cta-orb-2');
      const ctaButton = gsap.utils.toArray('.cta-button');

      if (ctaSection.length > 0) {
        safeFloat(ctaOrbs, 7);

        safeAnimate(ctaBadge, {
          from: { opacity: 0, y: -40, scale: 0.85 },
          to: { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.7)' }
        }, ctaSection[0]);

        safeAnimate(ctaTitle, {
          from: { opacity: 0, y: 70, scale: 0.92 },
          to: { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: 'power3.out' }
        }, ctaSection[0]);

        safeAnimate(ctaButton, {
          from: { opacity: 0, y: 50, scale: 0.9 },
          to: { opacity: 1, y: 0, scale: 1, duration: 1.1, delay: 0.8, ease: 'back.out(1.4)' }
        }, ctaSection[0]);
      }

      // Legacy Interactive Cards Animation (for backward compatibility)
      const legacyCards = gsap.utils.toArray('.interactive-card');
      
      if (legacyCards.length > 0) {
        safeSet(legacyCards, {
          opacity: 0,
          y: 100,
          scale: 0.95,
          filter: 'blur(10px)'
        });

        gsap.to(legacyCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: legacyCards[0].parentElement,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      }

      // Continuous floating animation for all interactive cards
      const allCards = gsap.utils.toArray('.interactive-card, .premium-interactive-card');
      
      allCards.forEach((card, index) => {
        if (card) {
          const duration = 3 + (index * 0.5); // 3-5 seconds varying duration
          gsap.to(card, {
            y: -10,
            duration: duration,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          });
        }
      });

      // Remove 3D tilt effect - CSS hover effects will handle all interactions
      const premiumCardElements = gsap.utils.toArray('.premium-interactive-card');
      
      // No GSAP mouse events - let CSS handle all hover effects
      premiumCardElements.forEach((card) => {
        // Just ensure cards exist - CSS will handle hover effects
        if (card) {
          // No manipulation needed - CSS hover effects will work
        }
      });

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
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
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

  const milestones = [
    {
      year: '2012',
      title: 'Founded',
      description: 'TrueWaveites established with a vision to transform B2B demand generation.'
    },
    {
      year: '2015',
      title: 'Expansion',
      description: 'Expanded operations to serve enterprise clients across multiple industries.'
    },
    {
      year: '2018',
      title: 'Innovation',
      description: 'Launched proprietary AI-driven lead scoring and qualification platform.'
    },
    {
      year: '2021',
      title: 'Growth',
      description: 'Reached milestone of 1M+ qualified leads generated for clients.'
    },
    {
      year: '2024',
      title: 'Excellence',
      description: 'Recognized as leading B2B demand generation agency with global presence.'
    }
  ];

  const values = [
    {
      title: 'Outcome-Driven',
      description: 'We focus on measurable results that drive business growth and ROI.',
      icon: '🎯'
    },
    {
      title: 'Innovation',
      description: 'Continuously evolving our strategies and technologies to stay ahead.',
      icon: '💡'
    },
    {
      title: 'Partnership',
      description: 'We work as an extension of your team, committed to your success.',
      icon: '🤝'
    },
    {
      title: 'Excellence',
      description: 'Setting industry standards with quality, precision, and reliability.',
      icon: '⭐'
    }
  ];

  return (
    <>
      <div ref={mainRef} style={{
      minHeight: '100vh',
      backgroundColor: isDarkMode ? 'black' : 'white',
      color: isDarkMode ? 'white' : 'black',
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

      {/* Premium Hero Section with Sophisticated Animations */}
      <section className="hero-section" style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '140px 40px 100px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
       {/* Background Video with Enhanced Effects */}
<video
  autoPlay
  loop
  muted
  playsInline
  className="hero-bg-video"
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: -3,
    filter: 'brightness(0.8) contrast(1.4) saturate(1.5)',
    transform: 'translateZ(0) scale(1.05)',
    backfaceVisibility: 'hidden',
  }}
>
  <source
    src="/assets/hf_20260518_104304_bbd0dfa0-c698-419a-ad5e-63d93a6d0cd0.mp4"
    type="video/mp4"
  />
</video>
                
        {/* Animated Gradient Orbs */}
        <div className="hero-orb-1" style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,66,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div className="hero-orb-2" style={{
          position: 'absolute',
          bottom: '25%',
          left: '12%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.25) 0%, transparent 70%)',
          filter: 'blur(55px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />

        {/* Floating Particles */}
        <div className="particles-container" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none'
        }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: isDarkMode ? '#4ECDC4' : '#FF8C42',
                opacity: 0.6,
                left: `${10 + (i * 12)}%`,
                animation: `particle-float ${15 + (i * 2)}s linear infinite`,
                animationDelay: `${i * 2}s`
              }}
            />
          ))}
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          
          <h1 className="hero-title" style={{
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            fontWeight: '900',
            marginBottom: '32px',       
            background: 'white',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.05em',
            lineHeight: '1.1',
            position: 'relative'
          }}>
            <TextType 
              text={["About Us"]}
              typingSpeed={80}
              pauseDuration={2000}
              showCursor={false}
              startOnVisible={true}
              initialDelay={500}
            />
          </h1>
          <p className="hero-subtitle" style={{
            fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
            lineHeight: '1.8',
            maxWidth: '1000px',
            margin: '0 auto',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontWeight: '500',
            textShadow: '0 3px 12px rgba(0,0,0,0.5)',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.3) 100%)',
            padding: '32px 40px',
            borderRadius: '24px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            At Truewave Ites, our vision as a B2B demand generation company is to help businesses achieve sustainable growth by generating high-quality leads and nurturing them through every stage of the sales funnel.
          </p>
        </div>
      </section>

      {/* Premium Vision Section */}
      <section className="vision-section" style={{
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1,
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 25%, black 50%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 50%, white 100%)',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${isDarkMode ? '4ECDC4' : 'FF8C42'}' fill-opacity='0.03'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5
        }} />
        
        {/* Animated Gradient Orbs */}
        <div className="vision-orb-1" style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,66,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 12s ease-in-out infinite'
        }} />
        <div className="vision-orb-2" style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.12) 0%, transparent 70%)',
          filter: 'blur(45px)',
          animation: 'float 15s ease-in-out infinite reverse'
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="section-title" style={{
              fontSize: 'clamp(3rem, 7vw, 4rem)',
              fontWeight: '800',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #00D4FF  0%, #7B61FF  50%, #FF4ECD  100%)',
              textShadow: '0 4px 20px #7B61FF',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              lineHeight: '1.2',
            }}>
              <TextType 
                text={["Our Vision & Mission"]}
                typingSpeed={60}
                pauseDuration={2000}
                showCursor={false}
                startOnVisible={true}
                initialDelay={300}
              />
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: isDarkMode ? '#cbd5e1' : '#475569',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.7',
              letterSpacing: '-0.01em'
            }}>
              We are committed to excellence and innovation in B2B demand generation
            </p>
          </div>

          {/* Premium Animated Text Component */}
          <div style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(15,23,42,0.15) 0%, rgba(30,41,59,0.08) 50%, rgba(15,23,42,0.15) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 50%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(25px)',
            padding: '60px',
            borderRadius: '32px',
            border: `1px solid ${isDarkMode ? 'rgba(78,205,196,0.2)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: `0 25px 80px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)'}`
          }}>
            <AnimatedTextSection isDarkMode={isDarkMode} />
          </div>
        </div>
      </section>

      {/* Premium Strategy Section */}
      <section className="strategy-section" style={{
        padding: '50px 40px',
        position: 'relative',
        zIndex: 1,
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 50%, white 100%)',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${isDarkMode ? 'FF8C42' : '4ECDC4'}' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.4
        }} />
        
        {/* Animated Gradient Orbs */}
        <div className="strategy-orb-1" style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.18) 0%, transparent 70%)',
          filter: 'blur(55px)',
          animation: 'float 10s ease-in-out infinite'
        }} />
        <div className="strategy-orb-2" style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 14s ease-in-out infinite reverse'
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 className="section-title" style={{
              fontSize: 'clamp(3rem, 6vw, 4rem)',
              fontWeight: '900',
              marginBottom: '32px',
              background: 'linear-gradient(135deg, #FF383B 0%, #FF8C42 50%, #FF4ECD 100%)',
              textShadow: '0 4px 20px #FF8C42',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.04em',
              lineHeight: '1.1'
            }}>
              <TextType 
                text={["Our Strategic Approach"]}
                typingSpeed={70}
                pauseDuration={2500}
                showCursor={false}
                startOnVisible={true}
                initialDelay={400}
              />
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: isDarkMode ? '#cbd5e1' : '#475569',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.7',
              letterSpacing: '-0.02em'
            }}>
              We combine innovative strategies with cutting-edge technology to deliver exceptional results
            </p>
          </div>
          
          {/* Premium Interactive Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '50px'
          }}>
            {[
              {
                title: "Developing Custom Strategies",
                description: "We understand that every business is unique, and that's why we don't believe in a one-size-fits-all approach. We will work closely with our clients to develop custom lead generation strategies that meet their unique needs, goals, and budget.",
                icon: "🎯",
                gradient: "linear-gradient(135deg, #FF8C42 0%, #FF6B6B 100%)",
                color: "#FF8C42"
              },
              {
                title: "Leveraging the Latest Technologies",
                description: "We stay up-to-date with the latest trends, technologies, and best practices in B2B lead generation. We leverage cutting-edge tools and techniques to identify, target, and engage with potential customers across multiple channels.",
                icon: "🚀",
                gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A3AA 100%)",
                color: "#4ECDC4"
              },
              {
                title: "Delivering Measurable Results",
                description: "We believe in data-driven decision-making, and that's why we measure everything we do. We regularly analyze and optimize our strategies to ensure that we are driving the maximum return on investment for our clients.",
                icon: "📊",
                gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%)",
                color: "#FF6B6B"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="premium-interactive-card"
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(-8px) scale(1.02)';
                  card.style.boxShadow = `0 20px 40px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)'}`;
                  
                  const glow = card.querySelector('.card-glow');
                  if (glow) {
                    glow.style.opacity = '0.8';
                  }
                  
                  const icon = card.querySelector('.card-icon');
                  if (icon) {
                    icon.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(0) scale(1)';
                  card.style.boxShadow = 'none';
                  
                  const glow = card.querySelector('.card-glow');
                  if (glow) {
                    glow.style.opacity = '0.3';
                  }
                  
                  const icon = card.querySelector('.card-icon');
                  if (icon) {
                    icon.style.transform = 'scale(1)';
                  }
                }}
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 50%, rgba(255,255,255,0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  padding: '40px',
                  borderRadius: '24px',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
                  position: 'relative',
                  overflow: 'hidden',
                  willChange: 'transform',
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  boxShadow: 'none'
                }}
              >
                {/* Card Background Animation */}
                <div className="card-bg-anim" style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
                  animation: 'rotate 25s linear infinite',
                  pointerEvents: 'none'
                }} />
                
                {/* Card Glow Effect */}
                <div className="card-glow" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: item.gradient,
                  opacity: 0.3,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none',
                  borderRadius: '24px'
                }} />
                
                {/* Card Top Border */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: item.gradient,
                  borderRadius: '24px 24px 0 0'
                }} />
                
                {/* Icon */}
                <div 
                  className="card-icon"
                  style={{
                    fontSize: '3.5rem',
                    marginBottom: '24px',
                    filter: `drop-shadow(0 8px 16px ${item.color}40)`,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {item.icon}
                </div>
                
                {/* Title */}
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: '700',
                  marginBottom: '20px',
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.3',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {item.title}
                </h3>
                
                {/* Description */}
                <p style={{
                  fontSize: '1.05rem',
                  lineHeight: '1.7',
                  color: isDarkMode ? '#cbd5e1' : '#475569',
                  letterSpacing: '-0.01em',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Final CTA Section */}
      <section className="cta-section" style={{
        padding: '50px 40px',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 40%, black 80%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 40%, white 80%, white 100%)',
        overflow: 'hidden'
      }}>
        {/* Sophisticated Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${isDarkMode ? '4ECDC4' : 'FF8C42'}' fill-opacity='0.04'%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.6
        }} />
        
        {/* Animated Gradient Orbs */}
        <div className="cta-orb-1" style={{
          position: 'absolute',
          top: '15%',
          right: '12%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,66,0.25) 0%, rgba(255,140,66,0.05) 40%, transparent 70%)',
          filter: 'blur(65px)',
          animation: 'float 18s ease-in-out infinite'
        }} />
        <div className="cta-orb-2" style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.22) 0%, rgba(78,205,196,0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 22s ease-in-out infinite reverse'
        }} />
        
        {/* Floating Particles */}
        <div className="cta-particles" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="cta-particle"
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: i % 3 === 0 ? '#FF8C42' : i % 3 === 1 ? '#4ECDC4' : '#FF6B6B',
                opacity: 0.4,
                left: `${5 + (i * 8)}%`,
                top: `${10 + (i * 7)}%`,
                animation: `particle-float ${20 + (i * 3)}s linear infinite`,
                animationDelay: `${i * 1.5}s`
              }}
            />
          ))}
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          <h2 className="cta-title" style={{
            fontSize: 'clamp(3rem, 7vw, 4.5rem)',
            fontWeight: '900',
            marginBottom: '48px',
            background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B6B 35%, #4ECDC4 65%, #FFA500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.05em',
            lineHeight: '1.1',
            textShadow: '0 8px 32px rgba(255,140,66,0.3)',
            position: 'relative'
          }}>
            <TextType 
              text={["Drive Growth With Innovative B2B Marketing!"]}
              typingSpeed={65}
              pauseDuration={3000}
              showCursor={false}
              startOnVisible={true}
              initialDelay={600}
            />
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'center',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            <div style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 50%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(25px)',
              padding: '48px',
              borderRadius: '32px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: `0 25px 80px ${isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.15)'}`
            }}>
              <p style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                lineHeight: '1.8',
                color: isDarkMode ? '#e2e8f0' : '#475569',
                letterSpacing: '-0.02em',
                fontWeight: '400',
                marginBottom: '32px'
              }}>
                Together with our clients, we build differentiated B2B brands with fresh ideas that challenge convention, unexpected design that surprises and delights, and engaging experiences along the customer journey. We combine strong expertise across consulting, media activation and data functions to drive unified customer experiences across strategic audiences and accounts.
              </p>
              
              <div style={{
                width: '100px',
                height: '3px',
                background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B6B 50%, #4ECDC4 100%)',
                margin: '32px auto',
                borderRadius: '2px'
              }} />
              
              <p style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                lineHeight: '1.7',
                color: isDarkMode ? '#cbd5e1' : '#64748b',
                letterSpacing: '-0.01em',
                fontWeight: '500',
                fontStyle: 'italic'
              }}>
                By coloring outside of the traditional agency lines we break down silos, achieving measurable business success for marketing teams and their brands.
              </p>
            </div>
            
            {/* Premium CTA Button */}
            <button
              className="cta-button"
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.transform = 'translateY(-4px) scale(1.05)';
                btn.style.boxShadow = `0 20px 40px ${isDarkMode ? 'rgba(255,140,66,0.4)' : 'rgba(255,140,66,0.3)'}`;
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.transform = 'translateY(0) scale(1)';
                btn.style.boxShadow = `0 10px 25px ${isDarkMode ? 'rgba(255,140,66,0.3)' : 'rgba(255,140,66,0.2)'}`;
              }}
              onClick={() => navigate('/contact')}
              style={{
                padding: '20px 48px',
                fontSize: '1.1rem',
                fontWeight: '700',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B6B 50%, #4ECDC4 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 10px 25px ${isDarkMode ? 'rgba(255,140,66,0.3)' : 'rgba(255,140,66,0.2)'}`,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span style={{ position: 'relative', zIndex: 2 }}>
                Start Your Journey
              </span>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                pointerEvents: 'none'
              }} />
            </button>
          </div>
        </div>
      </section>
    </div>
      
      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />
    </>
  );
};

export default AboutUs;
