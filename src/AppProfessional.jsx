import { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from '@studio-freight/lenis';
import Header from './components/Header';
import Footer from './components/Footer';
import CardParticleBackground from './components/CardParticleBackground';
import DecryptedText from './components/DecryptedText';
import ClickSpark from './components/ClickSpark';
import CircularText from './components/CircularText';
import Folder from './components/Folder';
import Stack from './components/Stack';
import SpotlightCard from './components/SpotlightCard';
import BorderGlow from './components/BorderGlow';
import TextType from './components/TextType';
import GradientText from './components/GradientText';
import './fonts.css';
import './components/TestimonialCard.css';
import './components/GradientText.css';

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-20px) rotate(2deg); }
    50% { transform: translateY(0px) rotate(-1deg); }
    75% { transform: translateY(-10px) rotate(1deg); }
  }
  
  @keyframes float-light {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
    25% { transform: translate(10px, -5px) scale(1.1); opacity: 0.5; }
    50% { transform: translate(-5px, 10px) scale(0.9); opacity: 0.4; }
    75% { transform: translate(5px, 5px) scale(1.05); opacity: 0.6; }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
  }

  @keyframes progress {
    0% { width: 0%; opacity: 0.3; }
    50% { opacity: 1; }
    100% { width: 70%; opacity: 0.3; }
  }

  @keyframes borderGlow {
    0%, 100% { 
      background-position: 0% 50%;
      opacity: 0.3;
    }
    50% { 
      background-position: 100% 50%;
      opacity: 0.6;
    }
  }
  
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .service-card {
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  
  .animated-gradient-text {
    position: relative;
    margin: 0 auto;
    display: flex;
    max-width: fit-content;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 1.25rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
    transition: box-shadow 0.5s ease-out;
    overflow: hidden;
    cursor: pointer;
  }

  .animated-gradient-text.with-border {
    padding: 0.35rem 0.75rem;
  }

  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    z-index: 0;
    pointer-events: none;
  }

  .gradient-overlay::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    border-radius: inherit;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #120F17;
    z-index: -1;
  }

  .text-content {
    display: inline-block;
    position: relative;
    z-index: 2;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
  
  /* DecryptedText styles */
  .tagline-container .revealed {
    color: #FF8C42;
    display: inline-block;
    transition: all 0.3s ease;
  }
  
  .tagline-container .encrypted {
    color: #FF8C42;
    display: inline-block;
    opacity: 0.3;
    filter: blur(1px);
    transition: all 0.3s ease;
  }
  
  .tagline-container .encrypted:hover {
    opacity: 0.6;
    filter: blur(0.5px);
  }
`;
document.head.appendChild(style);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const AppProfessional = ({ isDarkMode: propIsDarkMode, setIsDarkMode: propSetIsDarkMode, navigate }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Use prop if provided, otherwise check localStorage, then default to light mode
    if (propIsDarkMode !== undefined) return propIsDarkMode;
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark'; // Only return true if explicitly saved as 'dark'
  });
  
  // Safety check for navigate function
  const safeNavigate = (path) => {
    if (navigate && typeof navigate === 'function') {
      navigate(path);
    } else {
      // Fallback to window.location if navigate is not available
      window.location.href = path;
    }
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    services: [],
    message: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredServiceIndex, setHoveredServiceIndex] = useState(null);

  // Vision card hover handlers (moved to component level)
  const handleVisionCardHover = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(e.currentTarget, {
      rotationX: y * 0.01,
      rotationY: -x * 0.01,
      scale: 1.02 + Math.abs(x) * 0.0001 + Math.abs(y) * 0.0001,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Show glow effect
    gsap.to(visionGlowRef.current[index], {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Move light to mouse position
    const lightX = (x / rect.width) * 100;
    const lightY = (y / rect.height) * 100;
    
    gsap.to(visionLightRef.current[index], {
      opacity: 1,
      x: lightX,
      y: lightY,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  const handleVisionCardLeave = (e, index) => {
    gsap.to(e.currentTarget, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Hide glow effect
    gsap.to(visionGlowRef.current[index], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Hide light effect
    gsap.to(visionLightRef.current[index], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  // Update local dark mode when prop changes
  useEffect(() => {
    if (propIsDarkMode !== undefined) {
      setIsDarkMode(propIsDarkMode);
    }
  }, [propIsDarkMode]);

  // Update prop when local dark mode changes
  useEffect(() => {
    if (propSetIsDarkMode) {
      propSetIsDarkMode(isDarkMode);
    }
  }, [isDarkMode, propSetIsDarkMode]);

  // Refs for animations
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroCtaRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const visionRef = useRef(null);
  const mainRef = useRef(null);
  const lenisRef = useRef(null);
  const ctxRef = useRef(null);
  const popupRef = useRef(null);
  const popupContentRef = useRef(null);
  const visionCardsRef = useRef([null, null]);
  const visionGlowRef = useRef([null, null]);
  const visionLightRef = useRef([null, null]);
  const aboutUsContentRef = useRef(null);
  const aboutUsTextRef = useRef(null);
  const aboutUsVideoRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const testimonialCardsRef = useRef([]);
  const statsRef = useRef([]);
  const contactFormRef = useRef(null);
  const floatingElementsRef = useRef([]);
  const slidingTextRef = useRef(null);
  const headerRef = useRef(null);
  
  // Parallax refs
  const parallaxBgRef = useRef([]);
  const parallaxMidRef = useRef([]);
  const parallaxFgRef = useRef([]);

  // Lenis smooth scroll setup
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

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Smart Header Scroll - Instant with no animations
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    const updateHeaderPosition = () => {
      const currentScrollY = window.scrollY;
      
      if (!header) return;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - instantly hide header
        header.style.transform = 'translateY(-120px)';
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - instantly show header
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    };
    
    const scrollHandler = () => {
      updateHeaderPosition();
    };
    
    // Add scroll listener
    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  // GSAP Context for scoped animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // Hero Timeline - Premium entrance
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      heroTl
        .fromTo(heroTitleRef.current, 
          { y: 120, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2 }
        )
        .fromTo(heroSubtitleRef.current,
          { y: 80, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(heroTextRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(heroCtaRef.current,
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8 },
          '-=0.3'
        );

      // Floating elements with continuous motion
      floatingElementsRef.current.forEach((el, index) => {
        gsap.to(el, {
          y: -15 - (index * 5),
          duration: 2 + (index * 0.5),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.1
        });
      });

      // Sliding text timeline
      const slidingTl = gsap.timeline({
        scrollTrigger: {
          trigger: slidingTextRef.current,
          start: 'top 90%',
          end: 'bottom 50%',
          scrub: 1.2
        }
      });

      slidingTl
        .fromTo(slidingTextRef.current,
          { x: -150, opacity: 0, scale: 0.8 },
          { x: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
        );

      // Ultra-Premium Vision & Mission Timeline - Smooth appearing animations
      visionCardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // Set initial state
        gsap.set(card, {
          y: 80,
          opacity: 0,
          scale: 0.9,
          rotationX: index === 0 ? 15 : -15,
          filter: 'blur(8px)'
        });
        
        // Animate to final state
        gsap.to(card, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          filter: 'blur(0px)',
          duration: 1,
          delay: index * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // About Us Timeline - Optimized smooth animations
      // Content side animation
      if (aboutUsContentRef.current) {
        gsap.fromTo(aboutUsContentRef.current,
          { x: -40, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: aboutUsContentRef.current,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1,
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Text animation
      if (aboutUsTextRef.current) {
        gsap.fromTo(aboutUsTextRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: aboutUsTextRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Video animation
      if (aboutUsVideoRef.current) {
        gsap.fromTo(aboutUsVideoRef.current,
          { x: 40, opacity: 0, scale: 0.92 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: aboutUsVideoRef.current,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1,
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      // Services Section - Exact Animation Requirements
      const servicesSection = document.querySelector('.services-section');
      const serviceCards = document.querySelectorAll('.service-card');
      const servicesTitle = document.querySelector('.services-title');
      const servicesSubtitle = document.querySelector('.services-subtitle');
      
      if (servicesSection && serviceCards.length > 0) {
        // Set initial states
        gsap.set(serviceCards, { 
          y: -300, 
          opacity: 0, 
          scale: 0.8,
          rotationX: -15,
          zIndex: 1
        });
        gsap.set(servicesTitle, { y: 60, opacity: 0 });
        gsap.set(servicesSubtitle, { y: 40, opacity: 0 });
        
        // Create the main timeline with pinning
        const servicesScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: servicesSection,
            start: "top top",
            end: "+=150%", // Much less scroll distance
            scrub: 1, // Normal scroll speed
            pin: true,
            anticipatePin: 1,
            snap: {
              snapTo: 1 / (serviceCards.length + 2),
              duration: { min: 0.3, max: 0.6 },
              ease: "power2.inOut"
            }
          }
        });
        
        // Step 1: Title appears
        servicesScrollTl.to(servicesTitle, {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut"
        });
        
        servicesScrollTl.to(servicesSubtitle, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.inOut"
        }, "-=0.8");
        
        // Step 2: Card 1 comes from top, takes title place
        servicesScrollTl.to(serviceCards[0], {
          y: -50,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          zIndex: 10,
          duration: 1.2,
          ease: "power2.inOut"
        }, "+=0.5");
        
        // Title fades out as Card 1 takes its place
        servicesScrollTl.to([servicesTitle, servicesSubtitle], {
          y: -50,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=0.8");
        
        // Step 3: Card 2 overlaps
        servicesScrollTl.to(serviceCards[1], {
          y: -30,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          zIndex: 8,
          duration: 1,
          ease: "power2.inOut"
        }, "+=0.3");
        
        // Push Card 1 back
        servicesScrollTl.to(serviceCards[0], {
          y: -80,
          scale: 0.92,
          opacity: 0.8,
          zIndex: 5,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=0.8");
        
        // Step 4: Card 3 overlaps
        servicesScrollTl.to(serviceCards[2], {
          y: -10,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          zIndex: 6,
          duration: 1,
          ease: "power2.inOut"
        }, "+=0.3");
        
        // Push previous cards back
        servicesScrollTl.to(serviceCards[0], {
          y: -100,
          scale: 0.85,
          opacity: 0.6,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=0.8");
        
        servicesScrollTl.to(serviceCards[1], {
          y: -60,
          scale: 0.92,
          opacity: 0.8,
          zIndex: 7,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=0.8");
        
        // Final: All three cards appear together
        servicesScrollTl.to(serviceCards[0], {
          y: -120,
          x: -180,
          scale: 0.85,
          opacity: 0.9,
          rotationY: -8,
          duration: 1,
          ease: "power2.inOut"
        }, "+=0.5");
        
        servicesScrollTl.to(serviceCards[1], {
          y: -120,
          x: 0,
          scale: 0.9,
          opacity: 1,
          zIndex: 10,
          duration: 1,
          ease: "power2.inOut"
        }, "-=0.8");
        
        servicesScrollTl.to(serviceCards[2], {
          y: -120,
          x: 180,
          scale: 0.85,
          opacity: 0.9,
          rotationY: 8,
          duration: 1,
          ease: "power2.inOut"
        }, "-=0.8");
      }
      
      // Background parallax
      gsap.to(".services-bg", {
        yPercent: -15,
        scrollTrigger: {
          trigger: ".services-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      });
      
      // Card click animations - bring clicked card to center
      serviceCards.forEach((card, index) => {
        if (!card) return;
        
        card.addEventListener('click', () => {
          // Reset all cards to background
          gsap.to(serviceCards, {
            y: (i) => i === index ? -150 : -200,
            x: (i) => i === index ? 0 : (i - index) * 250,
            scale: (i) => i === index ? 1.1 : 0.7,
            opacity: (i) => i === index ? 1 : 0.3,
            rotationY: (i) => i === index ? 0 : (i - index) * 15,
            zIndex: (i) => i === index ? 20 : 1,
            duration: 0.8,
            ease: "power3.out"
          });
        });
      });

      // Engage Covert Nurture - Clean Animation System
      ScrollTrigger.refresh(); // Refresh to ensure smooth scrolling
      
      gsap.utils.toArray('[data-section="engage-covert-nurture"]').forEach(section => {
        // Kill any existing animations
        gsap.killTweensOf(section);
        
        // Title entrance
        gsap.fromTo(section.querySelector('h2'), 
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
          { scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true
          }}
        );
        
        // Caption lines staggered entrance
        gsap.fromTo(section.querySelectorAll('.caption-line'),
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" },
          { scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true
          }}
        );
        
        // Image entrance
        gsap.fromTo(section.querySelector('img'),
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: "back.out(1.4)" },
          { scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true
          }}
        );
      });

      // 360° Demand Generation - Clean Animation System
      ScrollTrigger.refresh(); // Refresh to ensure smooth scrolling

      gsap.utils.toArray('[data-section="360-demand-generation"]').forEach(section => {
        // Kill any existing animations
        gsap.killTweensOf(section);

        // Title entrance
        gsap.fromTo(section.querySelector('h2'),
          { scale: 0.5, opacity: 0, rotation: 180 },
          { scale: 1, opacity: 1, rotation: 0, duration: 1.8, ease: "back.out(1.4)" },
          { scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true
          }}
        );

        // Text lines staggered entrance
        gsap.fromTo(section.querySelectorAll('.demand-text'),
          (index) => ({ y: 40 + (index * 15), opacity: 0, scale: 0.9 }),
          { y: 0, opacity: 1, scale: 1, duration: 1.0, stagger: 0.15, ease: "power2.out" },
          { scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true
          }}
        );

        // Image entrance
        gsap.fromTo(section.querySelector('img'),
          { scale: 0.6, opacity: 0, rotation: 15 },
          { scale: 1, opacity: 1, rotation: 0, duration: 1.4, ease: "back.out(1.4)" },
          { scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true
          }}
        );

        // Card particle effects on hover
        const cards = section.querySelectorAll('.feature-card');
        cards.forEach(card => {
          const particlesContainer = card.querySelector('.card-particles');
          if (!particlesContainer) return;

          const createParticle = () => {
            const particle = document.createElement('div');
            const size = Math.random() * 6 + 2;
            const colors = ['#0ea5e9', '#4ECDC4', '#FF6B6B', '#FFA500'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              background: ${color};
              border-radius: 50%;
              pointer-events: none;
              left: ${Math.random() * 100}%;
              top: ${Math.random() * 100}%;
              opacity: 0;
              box-shadow: 0 0 ${size * 2}px ${color};
            `;

            particlesContainer.appendChild(particle);

            gsap.to(particle, {
              opacity: 0.8,
              scale: Math.random() * 1.5 + 0.5,
              duration: 0.3,
              ease: 'power2.out'
            });

            gsap.to(particle, {
              y: -50 - Math.random() * 50,
              x: (Math.random() - 0.5) * 100,
              opacity: 0,
              duration: 1 + Math.random(),
              ease: 'power2.out',
              onComplete: () => particle.remove()
            });
          };

          let particleInterval;

          card.addEventListener('mouseenter', () => {
            particleInterval = setInterval(createParticle, 100);
          });

          card.addEventListener('mouseleave', () => {
            clearInterval(particleInterval);
          });
        });
      });

      // Data Excellence Section - Clean Animation System
      ScrollTrigger.refresh(); // Refresh to ensure smooth scrolling
      
      gsap.utils.toArray('[data-section="data-excellence"]').forEach(section => {
        // Kill any existing animations
        gsap.killTweensOf(section);
        
        // Background Parallax
        gsap.fromTo(section,
          { yPercent: 0 },
          { yPercent: -15, duration: 2, ease: "expo.out" },
          { scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 1.5
          }}
        );
        
        // Main Title entrance
        gsap.fromTo(section.querySelector('h2'),
          { y: 80, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1.8, ease: "power3.out" },
          { scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true
          }}
        );
        
        // Subtitle entrance
        gsap.fromTo(section.querySelector('p'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
          { scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true
          }}
        );
        
        // Feature folders entrance
        gsap.fromTo(section.querySelectorAll('div[style*="gridTemplateColumns"] > div'),
          { y: 60, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1.4, stagger: 0.2, ease: "power2.out" },
          { scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true
          }}
        );
      });

      // Card Hover Effects (Enhanced)
      gsap.utils.toArray("section:nth-child(7) > div > div:nth-child(2) > div").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Feature Items Hover Effects
      gsap.utils.toArray(".feature-item").forEach((item) => {
        item.addEventListener("mouseenter", () => {
          gsap.to(item, {
            y: -10,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Our Media Brands Section - Enhanced Premium Animation
      const mediaBrandsTl = gsap.timeline({
        scrollTrigger: {
          trigger: "section:nth-child(9)", // Our Media Brands section
          start: "top 75%",
          end: "bottom 25%",
          scrub: 2.0
        },
        defaults: { ease: "expo.out" }
      });

      mediaBrandsTl
        // Background Parallax First
        .fromTo("section:nth-child(9)",
          { yPercent: 0 },
          { yPercent: -12, duration: 2 }
        )
        // Title with Complex Motion
        .fromTo("section:nth-child(9) h2",
          { 
            y: 100, 
            opacity: 0, 
            scale: 0.8, 
            rotationX: 15,
            filter: "blur(5px)"
          },
          { 
            y: 0, 
            opacity: 1, 
            scale: 1, 
            rotationX: 0,
            filter: "blur(0px)",
            duration: 1.8 
          }
        )
        // Subtitle with Slide Effect
        .fromTo("section:nth-child(9) h3",
          { y: 80, opacity: 0, x: -60, rotationY: 10 },
          { y: 0, opacity: 1, x: 0, rotationY: 0, duration: 1.4 },
          "-=1.2"
        )
        // Content Lines with Wave Effect
        .fromTo(".media-content",
          (index) => ({
            y: 50 + (index * 20),
            opacity: 0,
            x: -40 - (index * 10),
            rotation: 3
          }),
          { 
            y: 0, 
            opacity: 1, 
            x: 0,
            rotation: 0,
            duration: 1.2,
            stagger: {
              each: 0.2,
              from: "start",
              ease: "power3.out"
            }
          },
          "-=0.8"
        )
        // Feature Items with Advanced 3D Entrance
        .fromTo(".media-feature",
          (index) => ({
            y: 80 + (index * 25),
            opacity: 0,
            scale: 0.85,
            rotationY: 20 - (index * 5),
            rotationX: 10,
            x: 60 - (index * 15)
          }),
          { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            x: 0,
            duration: 1.5,
            stagger: {
              each: 0.2,
              from: "start",
              ease: "back.out(1.4)"
            }
          },
          "-=0.6"
        )
        // Feature Icons with Bouncy Spin
        .fromTo(".media-feature > div:first-child",
          { 
            scale: 0, 
            rotation: 720,
            y: -20
          },
          { 
            scale: 1, 
            rotation: 0,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.6)"
          },
          "-=1.0"
        )
        
        // Continuous Floating for Features
        .to(".media-feature", {
          y: -4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 3,
          stagger: 0.25
        }, "-=0.3")
        // Icon Breathing Effect
        .to(".media-feature > div:first-child", {
          scale: 1.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 2.5,
          stagger: 0.3
        }, "-=0.2")
        // Image Gentle Rotation
        .to("section:nth-child(9) img", {
          rotation: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 6
        }, "-=0.1");

      // Background Parallax for Media Brands Section
      gsap.to("section:nth-child(9)", {
        yPercent: -8,
        scrollTrigger: {
          trigger: "section:nth-child(9)",
          start: "top 75%",
          end: "bottom 25%",
          scrub: 1.8
        }
      });

      // Media Feature Hover Effects
      gsap.utils.toArray(".media-feature").forEach((feature) => {
        feature.addEventListener("mouseenter", () => {
          gsap.to(feature, {
            y: -5,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        feature.addEventListener("mouseleave", () => {
          gsap.to(feature, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Testimonials Timeline - Instant entrance
      const testimonialsTl = gsap.timeline({
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: 0.1
        },
        defaults: { ease: 'power1.out' }
      });

      testimonialsTl
        .fromTo(testimonialCardsRef.current,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.05
          }
        );

      // Stats Timeline - Bouncing effect
      const statsTl = gsap.timeline({
        scrollTrigger: {
          trigger: statsRef.current[0],
          start: 'top 85%',
          end: 'bottom 30%',
          scrub: 1
        },
        defaults: { ease: 'back.out(1.2)' }
      });

      statsTl
        .fromTo(statsRef.current,
          { y: 80, opacity: 0, scale: 0.7 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.06
          }
        );

      // Contact Form Timeline - Sliding entrance
      const contactTl = gsap.timeline({
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        defaults: { ease: 'power3.out' }
      });

      contactTl
        .fromTo(contactFormRef.current,
          { x: 150, opacity: 0, rotationY: 10 },
          { x: 0, opacity: 1, rotationY: 0, duration: 1.2 }
        );

      // Multi-layer Parallax System
      // Background layer - slowest
      parallaxBgRef.current.forEach(el => {
        gsap.to(el, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Mid layer - medium speed
      parallaxMidRef.current.forEach(el => {
        gsap.to(el, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Foreground layer - fastest
      parallaxFgRef.current.forEach(el => {
        gsap.to(el, {
          yPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });

      // Enhanced hover animations with smooth transitions
      const cards = gsap.utils.toArray('.interactive-card');
      cards.forEach(card => {
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl
          .to(card, {
            y: -8,
            scale: 1.02,
            rotationX: 3,
            duration: 0.4,
            ease: 'power2.out'
          });

        card.addEventListener('mouseenter', () => hoverTl.play());
        card.addEventListener('mouseleave', () => hoverTl.reverse());
      });

      // Text reveal enhancement for headings (exclude GradientText elements)
      const headings = gsap.utils.toArray('.reveal-text');
      headings.forEach(heading => {
        // Skip if this heading contains GradientText
        if (heading.querySelector('.animated-gradient-text')) {
          return;
        }
        
        const words = heading.innerText.split(' ');
        heading.innerHTML = words.map(word => `<span style="display: inline-block; margin-right: 0.05em;">${word}</span>`).join('');
        
        const spans = heading.querySelectorAll('span');
        gsap.fromTo(spans,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

// ... (rest of the code remains the same)
    }, mainRef);

    // Global ScrollTrigger refresh for smooth scrolling
    ScrollTrigger.refresh();

    // Additional refresh after a short delay to ensure all sections are properly initialized
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
    };
  }, []);

  // Popup animation
  const openPopup = (content) => {
    setPopupContent(content);
    setShowPopup(true);
    
    const popupTl = gsap.timeline();
    
    popupTl
      .fromTo(popupRef.current,
        { scale: 0.7, opacity: 0, rotationX: 25 },
        { 
          scale: 1, 
          opacity: 1, 
          rotationX: 0,
          duration: 0.6,
          ease: 'back.out(1.2)'
        }
      )
      .fromTo(popupContentRef.current,
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out'
        },
        '-=0.3'
      );
  };

  const closePopup = () => {
    const popupTl = gsap.timeline();
    
    popupTl
      .to(popupContentRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in'
      })
      .to(popupRef.current, {
        scale: 0.7,
        opacity: 0,
        rotationX: -25,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => setShowPopup(false)
      },
      '-=0.2'
      );
  };

  // Theme management
  useEffect(() => {
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
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#0a0a0a';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#ffffff';
      }
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Theme application error:', error);
    }
  }, [isDarkMode]);

  // Smooth scroll to section
  const scrollToSection = (sectionRef) => {
    if (sectionRef.current && lenisRef.current) {
      lenisRef.current.scrollTo(sectionRef.current, { offset: -80 });
    }
    setIsMenuOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({
      name: '',
      email: '',
      company: '',
      services: [],
      message: '',
      budget: '',
      timeline: ''
    });
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const services = [
    {
      title: "Content Syndication",
      description: "Strategic content distribution to targeted B2B audiences",
      icon: "https://img.icons8.com/fluency/48/document.png",
      features: ["Multi-channel distribution", "100% opt-in leads", "Real-time analytics"],
      color: "#FF6B6B",
      details: "Our content syndication service leverages advanced AI-driven targeting to distribute your content across premium B2B platforms. We guarantee 100% opt-in leads with real-time performance analytics."
    },
    {
      title: "Marketing Qualified Leads",
      description: "Mid-funnel prospects with demonstrated engagement",
      icon: "https://img.icons8.com/fluency/48/user-group.png",
      features: ["Lead scoring", "Progressive profiling", "CRM integration"],
      color: "#FF8C42",
      details: "Transform your funnel with our MQL system that scores and nurtures prospects through intelligent automation. Progressive profiling builds comprehensive prospect profiles over time."
    },
    {
      title: "Sales Qualified Leads",
      description: "Bottom-of-funnel prospects ready to convert",
      icon: "https://img.icons8.com/fluency/48/currency-dollar-circle.png",
      features: ["High-intent buyers", "Direct sales handoff", "Conversion tracking"],
      color: "#FFA500",
      details: "Our SQL program identifies and delivers high-intent buyers ready for immediate sales engagement. Advanced qualification ensures maximum conversion rates."
    },
    {
      title: "Account-Based Marketing",
      description: "Targeted campaigns for high-value accounts",
      icon: "https://img.icons8.com/fluency/48/target.png",
      features: ["Custom account research", "Personalized outreach", "ROI tracking"],
      color: "#FFB347",
      details: "Precision-targeted ABM campaigns for your highest-value accounts. Custom research and personalized outreach strategies that deliver measurable ROI."
    }
  ];

  const testimonials = [
    {
      name: "Alexandra Chen",
      company: "TechVision Inc.",
      position: "VP Marketing",
      content: "TrueWaveites transformed our lead generation strategy. The quality of leads and conversion rates exceeded our expectations by 300%.",
      rating: 5,
      avatar: "AC",
      story: "We were struggling with low-quality leads until TrueWaveites implemented their multi-channel approach. The results were immediate and impressive."
    },
    {
      name: "Marcus Williams",
      company: "Global Solutions Ltd",
      position: "CEO",
      content: "Working with TrueWaveites has been a game-changer. Their data-driven approach and compliance standards are unmatched in the industry.",
      rating: 5,
      avatar: "MW",
      story: "The compliance-first approach combined with sophisticated targeting helped us scale our demand generation without compromising quality."
    },
    {
      name: "Sophia Rodriguez",
      company: "Innovation Labs",
      position: "Sales Director",
      content: "The ROI we've achieved with TrueWaveites is remarkable. Their team understands B2B marketing like no other agency we've worked with.",
      rating: 5,
      avatar: "SR",
      story: "From strategy to execution, TrueWaveites delivered exceptional results. Our pipeline increased by 250% in just 6 months."
    }
  ];

  const stats = [
    { value: 2012, label: "Founded", suffix: "", color: "#FF6B6B" },
    { value: 15000, label: "Leads Generated", suffix: "+", color: "#FF8C42" },
    { value: 750, label: "Happy Clients", suffix: "+", color: "#FFA500" },
    { value: 98, label: "Satisfaction", suffix: "%", color: "#FFB347" }
  ];

const AnimatedCounter = ({
  target,
  suffix = "",
  duration = 2200,
  color,
  loop = true
}) => {

  const [count, setCount] = useState(0);

  const [isVisible, setIsVisible] =
    useState(false);

  const counterRef = useRef(null);

  /* OBSERVER */

  useEffect(() => {

    const observer =
      new IntersectionObserver(

        ([entry]) => {

          if (
            entry.isIntersecting
          ) {

            setIsVisible(true);

          }

        },

        {
          threshold: 0.4
        }

      );

    if (counterRef.current) {

      observer.observe(
        counterRef.current
      );

    }

    return () => {

      observer.disconnect();

    };

  }, []);

  /* COUNTER ANIMATION */

  useEffect(() => {

    if (!isVisible) return;

    let frame = 0;

    const fps = 60;

    const totalFrames =
      Math.round(
        duration / (1000 / fps)
      );

    const animateCounter = () => {

      const counter =
        setInterval(() => {

          frame++;

          const progress =
            frame / totalFrames;

          const easeOutExpo =
            progress === 1
              ? 1
              : 1 -
                Math.pow(
                  2,
                  -10 * progress
                );

          const current =
            Math.floor(
              easeOutExpo * target
            );

          setCount(current);

          if (
            frame >= totalFrames
          ) {

            clearInterval(counter);

            setTimeout(() => {

              if (loop) {

                frame = 0;

                setCount(0);

                animateCounter();

              }

            }, 3000);

          }

        }, 1000 / fps);

    };

    animateCounter();

  }, [
    isVisible,
    target,
    duration,
    loop
  ]);

  return (

    <div
      ref={counterRef}

      style={{
        position: 'relative',

        display: 'inline-flex',

        justifyContent: 'center',

        alignItems: 'center'
      }}
    >

      {/* GLOW */}

      <div
        style={{

          position: 'absolute',

          width: '180px',

          height: '180px',

          borderRadius: '50%',

          background: `
            radial-gradient(
              circle,
              ${color}25,
              transparent 70%
            )
          `,

          filter: 'blur(45px)',

          animation:
            'counterPulse 2.5s ease-in-out infinite'
        }}
      />

      {/* NUMBER */}

      <div
        style={{

    position: 'relative',

    fontSize: '5rem',

    fontWeight: '600',

    lineHeight: '1',

    letterSpacing: '-0.08em',

    color: isDarkMode ? '#ffffff' : '#000000',

    WebkitTextFillColor: isDarkMode ? '#ffffff' : '#000000',

    textShadow: isDarkMode
      ? `0 0 25px ${color}35`
      : '0 8px 20px rgba(0,0,0,0.08)',

    filter: 'none',

    animation: 'none'
        }}
      >

        {count}
        {suffix}

      </div>

    </div>

  );

};

  return (
    <ClickSpark
      sparkColor="#000000"
      sparkSize={20}
      sparkRadius={25}
      sparkCount={12}
      duration={600}
      easing="ease-out"
      extraScale={1.2}
    >
      <div ref={mainRef} style={{
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        minHeight: '100vh',
        overflowX: 'hidden'
      }}>
      {/* Header Component */}
      <Header 
        ref={headerRef}
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        navigate={navigate} 
      />

      {/* Hero Section */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 40px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.8) contrast(1.4) saturate(1.5)',
            zIndex: 0,
            transform: 'scale(1.1)'
          }}
        >
          <source src="/assets/background.mp4" type="video/mp4" />
        </video>
        
                
        <div style={{ maxWidth: '1200px', position: 'relative', zIndex: 2 }}>
          <h1 ref={heroTitleRef} className="reveal-text" style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '900',
            marginBottom: '24px',
            color: 'white',
            textShadow: '0 4px 20px red',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            willChange: 'transform'
          }}>
            TOP&nbsp;B2B 
            <br />
           DEMAND&nbsp; GENERATION 
           <br />
           COMPANY
          </h1>
          <h2 ref={heroSubtitleRef} style={{
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            fontWeight: '700',
            marginBottom: '40px',
            color: '#FF8C42',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            willChange: 'transform'
          }}>
            <DecryptedText 
              text="Engage-Nature-Convert!"
              speed={80}
              maxIterations={15}
              sequential={true}
              revealDirection="center"
              useOriginalCharsOnly={true}
              animateOn="view"
              className="revealed"
              parentClassName="tagline-container"
              encryptedClassName="encrypted"
            />
          </h2>
          <p ref={heroTextRef} style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
            color: isDarkMode ? '#e0e0e0' : '#e0e0e0',
            marginBottom: '48px',
            maxWidth: '800px',
            margin: '0 auto 48px',
            lineHeight: '1.6',
            letterSpacing: '-0.01em'
          }}>
            A demand generation company that runs on a data-driven approach and omnichannel media expertise
          </p>
          <button
            ref={heroCtaRef}
            onClick={() => scrollToSection(contactRef)}
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)',
              color: 'white',
              border: 'none',
              padding: '18px 48px',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '32px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 30px rgba(255,107,107,0.3)',
              willChange: 'transform',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={(e) => {
              gsap.to(e.target, {
                scale: 1.05,
                y: -3,
                boxShadow: '0 15px 40px rgba(255,107,107,0.4)',
                duration: 0.3,
                ease: 'power2.out'
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.target, {
                scale: 1,
                y: 0,
                boxShadow: '0 10px 30px rgba(255,107,107,0.3)',
                duration: 0.3,
                ease: 'power2.out'
              });
            }}
          >
            Get Started
          </button>
        </div>
        
        </section>

      
      {/* Vision & Mission Section */}
      <section ref={visionRef} style={{
        padding: '70px 40px',
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 className="reveal-text" style={{
              fontSize: 'clamp(5rem, 8vw, 6rem)',
              fontWeight: '800',
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }}>
              <GradientText
                colors={["#FF6B6B", "#4ECDC4", "#FF8C42", "#9B59B6", "#FF6B6B"]}
                animationSpeed={4}
                direction="horizontal"
                pauseOnHover={true}
              >
                Our Vision & Mission
              </GradientText>
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: isDarkMode ? '#b0b0b0' : '#666666',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Building the future of B2B demand generation through innovation and excellence
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: '48px',
            flexWrap: 'wrap',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Vision Card */}
            <div
              style={{
                flex: '1',
                minWidth: '250px',
                maxWidth: '350px',
                padding: '36px',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(167,110,238,0.08) 0%, rgba(203,148,247,0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(167,110,238,0.04) 0%, rgba(203,148,247,0.01) 100%)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                border: `1px solid ${isDarkMode ? 'rgba(167,110,238,0.3)' : 'rgba(167,110,238,0.2)'}`,
                boxShadow: isDarkMode
                  ? `0 0 0 1px #A76EEE, 0 0 20px #E6E6FA, 0 0 40px #CB94F7, inset 0 1px 0 #A76EEE)`
                  : `0 0 0 1px rgba(167,110,238,0.3), 0 0 20px rgba(167,110,238,0.2), 0 0 40px rgba(203,148,247,0.1), inset 0 1px 0 rgba(255,255,255,0.8)`
              }}
            >
              {/* Border Glow Effect */}
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                borderRadius: '24px',
                background: `linear-gradient(45deg, ${isDarkMode ? '#CB94F7' : '#CB94F7'}, transparent, ${isDarkMode ? '#CB94F7' : '#CB94F7'})`,
                backgroundSize: '200% 200%',
                animation: 'borderGlow 3s ease-in-out infinite',
                zIndex: -1
              }} />
              
              <div
                ref={el => visionCardsRef.current[0] = el}
                onMouseEnter={(e) => handleVisionCardHover(e, 0)}
                onMouseLeave={(e) => handleVisionCardLeave(e, 0)}
              >
              {/* Dynamic Glow Layer */}
              <div 
                ref={el => visionGlowRef.current[0] = el}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at var(--mouse-x, var(--mouse-y), #CB94F7 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              
              {/* Light Follow Effect */}
              <div 
                ref={el => visionLightRef.current[0] = el}
                style={{
                  position: 'absolute',
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, #A76EEE 0%, #CB94F7 40%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(25px)',
                  opacity: 0,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2
                }}
              />
              
              {/* Interactive Particle Background */}
              <CardParticleBackground color="167,110,238" />
              
              <div style={{
                width: '80px',
                height: '80px',
                left: '120px',
                background: 'linear-gradient(135deg, #CB94F7 0%, #A76EEE 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                fontSize: '2rem',
                color: 'white',
                boxShadow: '0 10px 30px rgba(167,110,238,0.3)',
                position: 'relative',
                zIndex: 3,
              
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">           
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '25px',
                color: '#A76EEE',
                letterSpacing: '-0.02em',
                paddingLeft: '81px'
              }}>
                Our Vision
              </h3>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: isDarkMode ? 'white' : 'black'
              }}>
                Helping businesses achieve sustainable growth through custom strategies, latest technologies, exceptional service, and measurable results.
              </p>
              </div>
              </div>

            {/* Mission Card */}
            <div
              style={{
                flex: '1',
                minWidth: '250px',
                maxWidth: '350px',
                padding: '36px',
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(45,212,191,0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(20,184,166,0.04) 0%, rgba(45,212,191,0.01) 100%)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                border: `1px solid ${isDarkMode ? 'rgba(20,184,166,0.5)' : 'rgba(20,184,166,0.4)'}`,
                boxShadow: isDarkMode
                  ? `0 0 0 1px #14B8A6, 0 0 20px #2DD4BF, 0 0 40px #14B8A6, inset 0 1px 0 #14B8A6`
                  : `0 0 0 1px rgba(20,184,166,0.5), 0 0 20px rgba(20,184,166,0.4), 0 0 40px rgba(45,212,191,0.3), inset 0 1px 0 rgba(255,255,255,0.8)`
              }}
            >
              {/* Border Glow Effect */}
              <div style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                borderRadius: '24px',
                background: `linear-gradient(45deg, ${isDarkMode ? '#2DD4BF' : 'rgba(20,184,166,0.3)'}, transparent, ${isDarkMode ? '#14B8A6' : 'rgba(45,212,191,0.3)'})`,
                backgroundSize: '200% 200%',
                animation: 'borderGlow 3s ease-in-out infinite',
                zIndex: -1
              }} />
              
              <div
                ref={el => visionCardsRef.current[1] = el}
                onMouseEnter={(e) => handleVisionCardHover(e, 1)}
                onMouseLeave={(e) => handleVisionCardLeave(e, 1)}
              >
              {/* Dynamic Glow Layer */}
              <div 
                ref={el => visionGlowRef.current[1] = el}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at var(--mouse-x, var(--mouse-y), #2DD4BF 0%, transparent 50%)',
                  opacity: 0,
                  transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              
              {/* Light Follow Effect */}
              <div 
                ref={el => visionLightRef.current[1] = el}
                style={{
                  position: 'absolute',
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, #14B8A6 0%, #2DD4BF 40%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(25px)',
                  opacity: 0,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2
                }}
              />
              
              {/* Interactive Particle Background */}
              <CardParticleBackground color="20,184,166" />
              
              <div style={{
                width: '80px',
                height: '80px',
                left: '120px',
                background: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                fontSize: '2rem',
                color: 'white',
                boxShadow: '0 10px 30px rgba(20,184,166,0.5)',
                position: 'relative',
                zIndex: 3
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M21 16V8A2 2 0 0 0 19 6H5A2 2 0 0 0 3 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '20px',
                color: '#14B8A6',
                letterSpacing: '-0.02em',
                paddingLeft: '77px'
              }}>
                Our Mission
              </h3>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: isDarkMode ? '#e0e0e0' : '#333333'
              }}>
                Empowering clients to connect with right prospects at precise buying moment, staying ahead of competition through partnership and value.
              </p>
              </div>
              </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section style={{
        padding: '50px 20px',
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 className="reveal-text" style={{
              fontSize: 'clamp(4rem, 8vw, 5.5rem)',
              fontWeight: '800',
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }}>
              <GradientText
                colors={["#8E44AD", "#3498DB", "#9B59B6", "#FF6B6B", "#8E44AD"]}
                animationSpeed={4}
                direction="horizontal"
                pauseOnHover={true}
              >
                About Us
              </GradientText>
            </h2>
            <p style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '600',
              color: isDarkMode ? 'white' : 'black',
              marginBottom: '40px',
              letterSpacing: '-0.02em'
            }}>
              The Leading B2B Marketing Agency
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '80px',
            alignItems: 'start'
          }}>
            {/* Content Side */}
            <div
              ref={aboutUsContentRef}
              style={{
                padding: '40px',
                position: 'relative',
                transform: 'translateZ(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            >
              <div 
                ref={aboutUsTextRef}
                style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.8',
                  color: isDarkMode ? 'white' : 'black',
                  letterSpacing: '-0.01em'
                }}
              >
                At <span style={{ color: 'orange', fontWeight: '700' }}>TrueWaveItes</span>, our vision as a B2B demand generation company is to help businesses achieve sustainable growth by generating high-quality leads and nurturing them through every stage of sales funnel. We aim to be a trusted partner for businesses looking to improve their online presence, increase brand awareness, and drive more traffic to their website.
              </div>
            </div>

            {/* Video Side */}
            <div
              ref={aboutUsVideoRef}
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px black',
                background: isDarkMode ? '#000000' : '#f5f5f5',
                marginTop: '-20px',
                transform: 'translateZ(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  minHeight: '280px',
                  maxHeight: '350px',
                  filter: 'brightness(1.0) contrast(1.2) saturate(1)'
                }}
              >
                <source src="/assets/Team.mp4" type="video/mp4" />
              </video>
              
              {/* Video Overlay Gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,107,107,0.05) 0%, transparent 50%), linear-gradient(45deg, rgba(78,205,196,0.05) 0%, transparent 50%)',
                pointerEvents: 'none',
                borderRadius: '24px'
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Premium Services Section */}
      <section className="services-section" ref={servicesRef} style={{
        padding: '35px 20px',
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 50%, black 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #f8fafc 50%, #FFFFFF 100%)',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
       

        <div style={{ maxWidth: '1400px', margin: '25px auto', position: 'relative', zIndex: 2 }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
            zIndex: 10
          }}>
            <h2 className="services-title" style={{
              fontSize: 'clamp(3.5rem, 7vw, 5rem)',
              fontWeight: '900',
              marginBottom: '0',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(255,107,107,0.3)'
            }}>
              <GradientText
                colors={["#00D4FF", "#7B61FF", "#FF4ECD", "#7B61FF", "#FFD700"]}
                animationSpeed={4}
                direction="horizontal"
                pauseOnHover={true}
              >
                Our Services
              </GradientText>
            </h2>
            
            <div className="services-subtitle" style={{
              fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
              color: isDarkMode ? '#e2e8f0' : 'black',
              fontWeight: '500',
              marginBottom: '0',
              letterSpacing: '-0.01em',
              maxWidth: '700px',
              lineHeight: '1.7'
            }}>
              Lead generation solutions designed to accelerate your B2B growth and maximize ROI
            </div>
          </div>

          {/* Premium 3D Card Stack */}
          <div className="services-grid" style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2px',
            maxWidth: '1000px',
            margin: '0 auto',
            perspective: '1000px',
            zIndex: 5
          }}>
            {[
              {
                title: 'Content Syndication Leads',
                description: 'Initial-stage content marketing efforts targeting prospects at the beginning of the sales funnel, generating opt-in leads that have exhibited 100% engagement with the content.',
                stage: 'Top of Funnel',
                icon: '📊',
                color: '#4ECDC4',
                features: ['100% Content Engagement', 'Opt-in Leads', 'Initial Funnel Stage']
              },
              {
                title: 'Marketing Qualified Leads',
                description: 'Mid-funnel prospects that have demonstrated engagement, undergone profiling, and met your pipeline criteria through customized questioning.',
                stage: 'Middle of Funnel',
                icon: '🎯',
                color: '#FF6B6B',
                features: ['Profiled Prospects', 'Pipeline Criteria Met', 'Custom Qualification']
              },
              {
                title: 'Sales Qualified Leads',
                description: 'Bottom-of-funnel prospects exhibiting strong purchasing intent, assessed using BANT and I2P strategies to ensure their high qualification status.',
                stage: 'Bottom of Funnel',
                icon: '🚀',
                color: '#FFA500',
                features: ['Strong Purchase Intent', 'BANT & I2P Assessment', 'High Qualification']
              }
            ].map((service, index) => (
              <div
                key={index}
                className="service-card"
                ref={el => serviceCardsRef.current[index] = el}
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.12) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 50%, rgba(255,255,255,0.95) 100%)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  padding: '32px',
                  borderRadius: '20px',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)'}`,
                  boxShadow: isDarkMode 
                    ? '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.1)'
                    : '0 30px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  willChange: 'transform, opacity',
                  transformStyle: 'preserve-3d',
                  transition: 'border-color 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  
                  // Kill any ongoing animations to prevent conflicts
                  gsap.killTweensOf(card);
                  
                  // Animate card lift and glow with professional easing
                  gsap.fromTo(card,
                    { 
                      y: 0,
                      scale: 1,
                      boxShadow: isDarkMode 
                        ? '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.1)'
                        : '0 30px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.8)'
                    },
                    {
                      y: -10,
                      scale: 1.02,
                      boxShadow: `0 40px 80px ${service.color}30, 0 0 60px ${service.color}15, inset 0 1px 0 ${service.color}15`,
                      duration: 0.4,
                      ease: 'power3.out'
                    }
                  );
                  
                  // Animate border glow
                  gsap.to(card, {
                    borderColor: service.color,
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                  
                  // Stagger animate internal elements
                  const icon = card.querySelector('.service-icon');
                  const title = card.querySelector('h3');
                  const features = card.querySelectorAll('.service-feature');
                  
                  if (icon) {
                    gsap.to(icon, {
                      scale: 1.08,
                      filter: `drop-shadow(0 10px 28px ${service.color}55)`,
                      duration: 0.4,
                      ease: 'power2.out'
                    });
                  }
                  
                  if (features.length > 0) {
                    gsap.fromTo(features,
                      { x: 0 },
                      { 
                        x: 3,
                        stagger: 0.04,
                        duration: 0.25,
                        ease: 'power2.out'
                      }
                    );
                  }
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  
                  // Kill any ongoing animations
                  gsap.killTweensOf(card);
                  
                  // Reset all animations
                  gsap.to(card, {
                    y: 0,
                    scale: 1,
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                    boxShadow: isDarkMode 
                      ? '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.1)'
                      : '0 30px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.8)',
                    duration: 0.4,
                    ease: 'power3.out'
                  });
                  
                  // Reset internal elements
                  const icon = card.querySelector('.service-icon');
                  const title = card.querySelector('h3');
                  const features = card.querySelectorAll('.service-feature');
                  
                  if (icon) {
                    gsap.to(icon, {
                      scale: 1,
                      filter: `drop-shadow(0 8px 24px ${service.color}50)`,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                  
                  if (features.length > 0) {
                    gsap.to(features, {
                      x: 0,
                      duration: 0.25,
                      ease: 'power2.out'
                    });
                  }
                }}
              >
                {/* Enhanced Stage Badge */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: isDarkMode 
                    ? `linear-gradient(135deg, ${service.color}25 0%, ${service.color}15 100%)`
                    : `linear-gradient(135deg, ${service.color}15 0%, ${service.color}08 100%)`,
                  backdropFilter: 'blur(10px)',
                  color: service.color,
                  padding: '10px 18px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  border: `1px solid ${service.color}35`,
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  boxShadow: `0 4px 15px ${service.color}25`
                }}>
                  {service.stage}
                </div>

                {/* Enhanced Icon with Glow */}
                <div className="service-icon" style={{
                  fontSize: '3.5rem',
                  marginBottom: '24px',
                  filter: `drop-shadow(0 8px 24px ${service.color}50)`,
                  display: 'inline-block',
                  transition: 'filter 0.4s ease',
                  position: 'relative',
                  transform: 'translateZ(20px)'
                }}>
                  {/* Icon glow background */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    background: `radial-gradient(circle, ${service.color}30 0%, transparent 70%)`,
                    borderRadius: '50%',
                    filter: 'blur(15px)',
                    zIndex: -1
                  }} />
                  {service.icon}
                </div>
                
                {/* Enhanced Title */}
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: isDarkMode ? '#ffffff' : '#09243F',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.2',
                  backgroundImage: `linear-gradient(135deg, ${isDarkMode ? '#ffffff' : '#09243F'} 0%, ${service.color} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 100%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transition: 'color 0.3s ease, background-image 0.3s ease'
                }}>
                  {service.title}
                </h3>
                
                {/* Enhanced Description */}
                <p style={{
                  fontSize: '0.95rem',
                  color: isDarkMode ? '#e2e8f0' : '#4a5568',
                  marginBottom: '20px',
                  lineHeight: '1.6',
                  letterSpacing: '-0.01em',
                  fontWeight: '400'
                }}>
                  {service.description}
                </p>
                
                {/* Enhanced Features */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="service-feature"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: isDarkMode 
                          ? `${service.color}12`
                          : `${service.color}06`,
                        backdropFilter: 'blur(10px)',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: isDarkMode ? '#ffffff' : '#09243F',
                        border: `1px solid ${service.color}25`,
                        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        transform: 'translateZ(10px)'
                      }}
                      onMouseEnter={(e) => {
                        gsap.to(e.target, {
                          x: 6,
                          backgroundColor: isDarkMode 
                            ? `${service.color}20`
                            : `${service.color}12`,
                          boxShadow: `0 4px 15px ${service.color}20`,
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.target, {
                          x: 0,
                          backgroundColor: isDarkMode 
                            ? `${service.color}12`
                            : `${service.color}06`,
                          boxShadow: 'none',
                          duration: 0.2,
                          ease: 'power2.out'
                        });
                      }}
                    >
                      <div style={{
                        width: '10px',
                        height: '10px',
                        background: service.color,
                        borderRadius: '50%',
                        flexShrink: 0,
                        boxShadow: `0 0 10px ${service.color}50`
                      }} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* Engage Covert Nurture Section */}
      <section data-section="engage-covert-nurture" style={{
        padding: '90px 40px',
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '60px',
            alignItems: 'center'
          }}>
            {/* Content Side */}
            <div style={{ padding: '40px' }}>
              <h2 style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                marginBottom: '24px',
                color: isDarkMode ? '#ffffff' : '#09243F',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #00D4FF 0%, #7B61FF 50%, #FF4ECD 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Engage Covert Nurture
              </h2>
              
              {/* Caption Reading Effect */}
              <div className="caption-text" style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#e0e0e0' : '#333333',
                letterSpacing: '-0.01em',
                overflow: 'hidden'
              }}>
                <span className="caption-line" style={{
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  Step onto the stage of marketing brilliance and shape your own narrative.
                </span>
                <span className="caption-line" style={{
                  display: 'block',
                  marginBottom: '12px'
                }}>
                  Embark on this transformative journey today, and discover the limitless potential that awaits when you connect with your audience and generate leads at every stage of the buying cycle.
                </span>
                <span className="caption-line" style={{
                  display: 'block'
                }}>
                  Together, let's redefine the art of engagement and chart a course towards resounding success!
                </span>
              </div>
            </div>

            {/* Border Glow Image */}
            <div style={{
              width: '100%',
              maxWidth: '800px',
              height: '400px',
              margin: '0 auto'
            }}>
              <BorderGlow
                edgeSensitivity={25}
                glowColor="16 85 60"
                backgroundColor={isDarkMode ? '#000000' : '#f5f5f5'}
                borderRadius={24}
                glowRadius={35}
                glowIntensity={1.2}
                coneSpread={20}
                colors={['#FF8C42', '#FF6B6B', '#FFA500']}
              >
                <video 
                  src="/assets/funnel.mp4"
                  alt="Engage Covert Nurture Funnel"
                  autoPlay
                  loop
                  muted
                  playsInline
                  ref={el => { if (el) el.play().catch(() => {}); }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '24px'
                  }}
                />
              </BorderGlow>
            </div>
          </div>
        </div>
      </section>

      {/* 360° Demand Generation Section - Sophisticated Redesign */}
      <section data-section="360-demand-generation" style={{
        padding: '50px 20px 100px 40px',
        background: isDarkMode 
          ? 'linear-gradient(135deg, black 0%, black 40%, black 80%, black 100%)'
          : 'linear-gradient(135deg, white 0%, white 40%, white 80%, white 100%)',
        position: 'relative',
        zIndex: 1,
        overflow: 'visible',
        minHeight: '800px'
      }}>
        {/* Sophisticated Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDarkMode ? '4ECDC4' : '0ea5e9'}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }} />
        
        {/* Animated Gradient Orbs */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.2) 0%, rgba(78,205,196,0.05) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float 12s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '12%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.18) 0%, rgba(255,107,107,0.04) 40%, transparent 70%)',
          filter: 'blur(55px)',
          animation: 'float 15s ease-in-out infinite reverse'
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
          {/* Premium Section Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <h2 style={{
              fontSize: 'clamp(3.5rem, 7vw, 5rem)',
              fontWeight: '900',
              marginBottom: '0',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #4ECDC4 35%, #FF6B6B 65%, #FFA500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.05em',
              lineHeight: '1.05',
              textShadow: '0 8px 32px rgba(14,165,233,0.3)',
              position: 'relative'
            }}>
              <TextType 
                text={["360° Demand Generation"]}
                typingSpeed={60}
                pauseDuration={2500}
                showCursor={false}
                startOnVisible={true}
                initialDelay={300}
              />
            </h2>
            <p style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
              color: isDarkMode ? 'white' : 'black',
              maxWidth: '800px',
              margin: '0',
              fontWeight: '400',
              lineHeight: '1.8',
              letterSpacing: '-0.02em'
            }}>
              Experience the future of marketing with our comprehensive 360° demand generation platform that combines cutting-edge technology with proven strategies to deliver exceptional results
            </p>
          </div>

          {/* Sophisticated Content Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '80px',
            alignItems: 'start',
            width: '100%'
          }}>
            {/* Premium Hero Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '30px'
            }}>
              {/* Enhanced Video with Premium Effects */}
              <video 
                src="/assets/demand 360.mp4"
                alt="360° Demand Generation"
                autoPlay
                loop
                muted
                playsInline
                ref={el => { if (el) el.play().catch(() => {}); }}
                style={{
                  width: '100%',
                  maxWidth: '700px',
                  height: '600px',
                  objectFit: 'contain',
                  borderRadius: '24px',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 25px 60px ${isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.1)'}`
                }}
              />

              {/* Premium Feature Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '50px',
                width: '100%',
                maxWidth: '900px'
              }}>
                {[
                  {
                    title: "Strategic Targeting",
                    description: "Precision targeting that reaches your ideal customers with laser-focused accuracy.",
                    icon: "🎯",
                    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    stats: "98% Accuracy"
                  },
                  {
                    title: "Data-Driven Insights",
                    description: "Advanced analytics that transform raw data into actionable marketing intelligence.",
                    icon: "📊",
                    gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                    stats: "250+ Metrics"
                  },
                  {
                    title: "Revenue Growth",
                    description: "Proven strategies that drive measurable business growth and ROI.",
                    icon: "📈",
                    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    stats: "45% Increase"
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="feature-card"
                    ref={el => {
                      if (el) {
                        gsap.fromTo(el, 
                          { 
                            opacity: 0, 
                            y: 80, 
                            scale: 0.85,
                            rotationX: 20,
                            filter: 'blur(10px)'
                          },
                          {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotationX: 0,
                            filter: 'blur(0px)',
                            duration: 1.2,
                            delay: index * 0.15,
                            ease: 'power4.out',
                            scrollTrigger: {
                              trigger: el,
                              start: 'top 90%',
                              toggleActions: 'play none none reverse'
                            }
                          }
                        );
                      }
                    }}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget;
                      gsap.to(card, {
                        y: -16,
                        scale: 1.08,
                        rotationY: 8,
                        rotationX: -8,
                        boxShadow: `0 30px 60px ${isDarkMode ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}`,
                        duration: 0.6,
                        ease: 'power3.out'
                      });
                      
                      // Animate icon with elastic bounce
                      const icon = card.querySelector('.card-icon');
                      if (icon) {
                        gsap.to(icon, {
                          scale: 1.4,
                          rotation: 360,
                          y: -8,
                          duration: 0.6,
                          ease: 'elastic.out(1, 0.5)'
                        });
                      }
                      
                      // Animate stats badge with glow
                      const stats = card.querySelector('.card-stats');
                      if (stats) {
                        gsap.to(stats, {
                          scale: 1.15,
                          background: isDarkMode ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.25)',
                          boxShadow: `0 8px 25px ${isDarkMode ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.3)'}`,
                          duration: 0.4,
                          ease: 'power3.out'
                        });
                      }

                      // Animate background pattern with pulse
                      const bgPattern = card.querySelector('.bg-pattern');
                      if (bgPattern) {
                        gsap.to(bgPattern, {
                          opacity: 0.8,
                          scale: 1.4,
                          duration: 0.6,
                          ease: 'power3.out'
                        });
                      }

                      // Animate accent bar with smooth expand
                      const accent = card.querySelector('.accent-bar');
                      if (accent) {
                        gsap.to(accent, {
                          height: '100%',
                          opacity: 0.9,
                          duration: 0.5,
                          ease: 'power3.inOut'
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget;
                      gsap.to(card, {
                        y: 0,
                        scale: 1,
                        rotationY: 0,
                        rotationX: 0,
                        boxShadow: 'none',
                        duration: 0.6,
                        ease: 'power3.out'
                      });
                      
                      // Reset icon with smooth return
                      const icon = card.querySelector('.card-icon');
                      if (icon) {
                        gsap.to(icon, {
                          scale: 1,
                          rotation: 0,
                          y: 0,
                          duration: 0.5,
                          ease: 'power3.out'
                        });
                      }
                      
                      // Reset stats badge
                      const stats = card.querySelector('.card-stats');
                      if (stats) {
                        gsap.to(stats, {
                          scale: 1,
                          background: isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)',
                          boxShadow: isDarkMode ? '0 4px 15px rgba(99,102,241,0.2)' : '0 4px 15px rgba(99,102,241,0.15)',
                          duration: 0.4,
                          ease: 'power3.out'
                        });
                      }

                      // Reset background pattern
                      const bgPattern = card.querySelector('.bg-pattern');
                      if (bgPattern) {
                        gsap.to(bgPattern, {
                          opacity: 0,
                          scale: 1,
                          duration: 0.6,
                          ease: 'power3.out'
                        });
                      }

                      // Reset accent bar
                      const accent = card.querySelector('.accent-bar');
                      if (accent) {
                        gsap.to(accent, {
                          height: '3px',
                          opacity: 1,
                          duration: 0.5,
                          ease: 'power3.inOut'
                        });
                      }
                    }}
                    style={{
                      background: isDarkMode 
                        ? 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)'
                        : 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.99) 50%, rgba(255,255,255,0.98) 100%)',
                      backdropFilter: 'blur(24px)',
                      padding: '36px 28px',
                      borderRadius: '28px',
                      border: `1.5px solid ${isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'}`,
                      textAlign: 'center',
                      transition: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: isDarkMode 
                        ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' 
                        : '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
                      transformStyle: 'preserve-3d',
                      perspective: '1200px'
                    }}
                  >
                    {/* Card Background Accent */}
                    <div 
                      className="accent-bar"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: item.gradient,
                        transition: 'none'
                      }} />
                    
                    {/* Animated Background Pattern */}
                    <div 
                      className="bg-pattern"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at 50% 50%, ${item.gradient.replace('135deg, ', '').replace(' 100%', '')}30 0%, transparent 70%)`,
                        opacity: 0,
                        transition: 'none',
                        pointerEvents: 'none'
                      }} />
                    
                    {/* Floating Particles Container */}
                    <div 
                      className="card-particles"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        overflow: 'hidden'
                      }}
                    />
                    
                    <div 
                      className="card-icon"
                      style={{
                        fontSize: '3rem',
                        marginBottom: '20px',
                        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))',
                        transition: 'none',
                        position: 'relative',
                        zIndex: 2,
                        display: 'inline-block'
                      }}
                    >
                      {item.icon}
                    </div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      marginBottom: '14px',
                      color: isDarkMode ? '#ffffff' : '#0f172a',
                      letterSpacing: '-0.03em',
                      lineHeight: '1.3',
                      position: 'relative',
                      zIndex: 2,
                      transition: 'none',
                      textShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: isDarkMode ? '#cbd5e1' : '#475569',
                      lineHeight: '1.7',
                      letterSpacing: '-0.01em',
                      marginBottom: '20px',
                      position: 'relative',
                      zIndex: 2,
                      transition: 'none'
                    }}>
                      {item.description}
                    </p>
                    <div 
                      className="card-stats"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        color: isDarkMode ? '#8b5cf6' : '#6366f1',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        background: isDarkMode 
                          ? 'rgba(99,102,241,0.15)' 
                          : 'rgba(99,102,241,0.08)',
                        padding: '12px 20px',
                        borderRadius: '16px',
                        display: 'inline-block',
                        position: 'relative',
                        zIndex: 2,
                        transition: 'none',
                        boxShadow: isDarkMode ? '0 4px 20px rgba(99,102,241,0.25)' : '0 4px 20px rgba(99,102,241,0.15)',
                        border: `1px solid ${isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'}`
                      }}
                    >
                      {item.stats}
                  </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div style={{ gap: '30px' }}></div>
      

      {/* Data Excellence Section */}
      <section data-section="data-excellence" style={{
        padding: '-20px 20px',
        backgroundColor: isDarkMode ? 'black' : 'white',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Main Title */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '800',
              marginBottom: '24px',
              color: isDarkMode ? 'white' : 'black',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #35F70A 0%, #00CB96 50%, #00E5AB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              We slice through the clutter and prioritize what truly counts – Outcomes!
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: isDarkMode ? '#e0e0e0' : '#333333',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.8',
              letterSpacing: '-0.01em'
            }}>
              Our extensive experience has led us to develop a data platform, campaign operations, and delivery model that are not only efficient and scalable but also sustainable. We take great pride in our ability to guarantee 100% reliability while ensuring active engagement with your Ideal Customer Profiles (ICP).
            </p>
          </div>

          {/* Feature Folders */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
            marginBottom: '80px'
          }}>
            {/* Folder 1: Data Targeting */}
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              borderRadius: '20px',
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(255,140,66,0.05) 0%, rgba(255,107,107,0.02) 100%)'
                : 'linear-gradient(135deg, rgba(255,140,66,0.02) 0%, rgba(255,107,107,0.01) 100%)',
              border: `1px solid ${isDarkMode ? 'rgba(255,140,66,0.1)' : 'rgba(255,140,66,0.05)'}`,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ marginBottom: '10px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Folder 
                  size={2.5} 
                  color="#21209C"
                  hoverToOpen={true}
                  items={[
                    <div key="1" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>🎯 Targeting</div>,
                    <div key="2" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>📊 Analytics</div>,
                    <div key="3" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>👥 ICP Focus</div>
                  ]}
                />
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: isDarkMode ? 'white' : 'black',
                letterSpacing: '-0.02em'
              }}>
                Leverage the Power of Data Targeting
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: isDarkMode ? 'white' : 'black',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                Empower your campaigns with the ability to reach the right people at the right time, unlocking new avenues of success. Our advanced targeting capabilities enable you to refine your strategies based on demographic and firmographic factors.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {['Demographic Targeting', 'Firmographic Analysis', 'ICP Focus'].map((tag) => (
                  <span key={tag} style={{
                    padding: '8px 16px',
                    background: isDarkMode ? 'rgba(76, 144, 253, 0.2)' : 'rgba(14, 169, 246, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: "blue",                   
                    fontWeight: '500'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Folder 2: Excellence */}
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              borderRadius: '20px',
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(78,205,196,0.05) 0%, rgba(255,107,107,0.02) 100%)'
                : 'linear-gradient(135deg, rgba(78,205,196,0.02) 0%, rgba(255,107,107,0.01) 100%)',
              border: `1px solid ${isDarkMode ? 'rgba(78,205,196,0.1)' : 'rgba(78,205,196,0.05)'}`,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ marginBottom: '40px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Folder 
                  size={2.5} 
                  color="#B2D430"
                  hoverToOpen={true}
                  items={[
                    <div key="1" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>⭐ Quality</div>,
                    <div key="2" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>🎯 Accuracy</div>,
                    <div key="3" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>⚡ Efficiency</div>
                  ]}
                />
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: isDarkMode ? 'white' : 'black',
                letterSpacing: '-0.02em'
              }}>
                Uncompromising Excellence in Quality and Delivery
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: isDarkMode ? 'white' : 'black',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                Experience the epitome of quality and delivery. Discover a partnership built on trust, accuracy, and efficiency. Together, let's raise the bar and redefine what it means to deliver excellence in the world of data-driven insights.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {['100% Reliability', 'Trust & Accuracy', 'Efficiency'].map((tag) => (
                  <span key={tag} style={{
                    padding: '8px 16px',
                    background: isDarkMode ? 'rgba(45, 253, 70, 0.2)' : 'rgba(20, 221, 64, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: 'green',
                    fontWeight: '500'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Folder 3: Compliance */}
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              borderRadius: '20px',
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(255,107,107,0.05) 0%, rgba(78,205,196,0.02) 100%)'
                : 'linear-gradient(135deg, rgba(255,107,107,0.02) 0%, rgba(78,205,196,0.01) 100%)',
              border: `1px solid ${isDarkMode ? 'rgba(255,107,107,0.1)' : 'rgba(255,107,107,0.05)'}`,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ marginBottom: '40px', minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Folder 
                  size={2.5} 
                  color="#F361AF"
                  hoverToOpen={true}
                  items={[
                    <div key="1" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>🛡️ GDPR</div>,
                    <div key="2" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>📋 CCPA</div>,
                    <div key="3" style={{ padding: '10px', fontSize: '12px', color: '#333' }}>🌍 Multilingual</div>
                  ]}
                />
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: isDarkMode ? 'white' : 'black',
                letterSpacing: '-0.02em'
              }}>
                Empower Your Marketing with Compliance at Its Core
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: isDarkMode ? 'white' : 'black',
                lineHeight: '1.7',
                marginBottom: '20px'
              }}>
                Expand your horizons with multilingual lead generation capabilities, breaking barriers and connecting with prospects in their preferred language. Our marketing operations comply with GDPR, CCPA, CASL, and LGPD to safeguard individuals' data privacy.
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {['GDPR', 'CCPA', 'CASL', 'LGPD', 'Multilingual'].map((tag) => (
                  <span key={tag} style={{
                    padding: '8px 16px',
                    background: isDarkMode ? 'rgba(234, 98, 98, 0.8)' : 'rgba(251, 87, 87, 0.1)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    color: '#F361AF',
                    fontWeight: '500'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Intelligence Section */}
      <section data-section="audience-intelligence" style={{
        padding: '120px 80px',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/World.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: isDarkMode ? 'brightness(0.7) saturate(1.5)' : 'brightness(0.8) saturate(1.5)',
          zIndex: -2
        }} />
        
        {/* Overlay Gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(9,36,63,0.4) 0%, rgba(9,36,63,0.2) 50%, rgba(9,36,63,0.4) 100%)'
            : 'linear-gradient(135deg, rgba(9,36,63,0.4) 0%, rgba(9,36,63,0.2) 50%, rgba(9,36,63,0.4) 100%)',
          zIndex: -1
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Animated Title with Alphabetical Letters */}
          <div className="audience-title" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            marginBottom: '40px',
            color: isDarkMode ? '#ffffff' : 'white',
            letterSpacing: '-0.03em',
            lineHeight: '1.2'
          }}>
            <span className="alpha-letter" style={{ color: '#FF8C42' }}>A</span>
            <span className="alpha-letter" style={{ color: '#FF6B6B' }}>B</span>
            <span className="alpha-letter" style={{ color: '#4ECDC4' }}>M</span>
            <span style={{ color: isDarkMode ? '#ffffff' : 'white', margin: '0 8px' }}>
              Enhanced
            </span>
            <span className="alpha-letter" style={{ color: '#FF8C42' }}>A</span>
            <span className="alpha-letter" style={{ color: '#FF6B6B' }}>u</span>
            <span className="alpha-letter" style={{ color: '#4ECDC4' }}>d</span>
            <span className="alpha-letter" style={{ color: '#FF8C42' }}>i</span>
            <span className="alpha-letter" style={{ color: '#FF6B6B' }}>e</span>
            <span className="alpha-letter" style={{ color: '#4ECDC4' }}>n</span>
            <span className="alpha-letter" style={{ color: '#FF8C42' }}>c</span>
            <span className="alpha-letter" style={{ color: '#FF6B6B' }}>e</span>
            <span style={{ color: isDarkMode ? '#ffffff' : 'white', margin: '0 8px' }}>
              Intelligence
            </span>
          </div>

          {/* Main Content */}
          <div className="audience-content" style={{
            fontSize: '1.4rem',
            lineHeight: '1.8',
            color: isDarkMode ? '#e0e0e0' : 'white',
            maxWidth: '900px',
            margin: '0 auto',
            letterSpacing: '-0.01em',
            fontWeight: '500'
          }}>
            <p className="content-line" style={{ marginBottom: '20px' }}>
              Leverage our <span className="highlight-word" style={{ 
                color: '#FF8C42', 
                fontWeight: '700',
                background: isDarkMode ? 'rgba(255,140,66,0.2)' : 'rgba(255,140,66,0.1)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>audience intelligence</span> data platform to enhance your ABM programs.
            </p>
            <p className="content-line" style={{ marginBottom: '20px' }}>
              Utilize <span className="highlight-word" style={{ 
                color: '#4ECDC4', 
                fontWeight: '700',
                background: isDarkMode ? 'rgba(78,205,196,0.2)' : 'rgba(78,205,196,0.1)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>demographic</span>, <span className="highlight-word" style={{ 
                color: '#FF6B6B', 
                fontWeight: '700',
                background: isDarkMode ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>firmographic</span>, and <span className="highlight-word" style={{ 
                color: '#FF8C42', 
                fontWeight: '700',
                background: isDarkMode ? 'rgba(255,140,66,0.2)' : 'rgba(255,140,66,0.1)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>technographic</span> filters, target first-party intent data, and create AI-driven lookalike data models for precise targeting and better results.
            </p>
          </div>

          {/* Animated Features */}
         <div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(240px, 1fr))',

    gap: '34px',

    marginTop: '80px',

    position: 'relative',

    zIndex: 5
  }}
>

  {[
    {
      icon: '🎯',
      text: 'Precise Targeting',
      color: '#FF8C42',
      glow: 'rgba(255,140,66,0.35)'
    },

    {
      icon: '🤖',
      text: 'AI-Driven Models',
      color: '#FF6B6B',
      glow: 'rgba(255,107,107,0.35)'
    },

    {
      icon: '📊',
      text: 'Data Intelligence',
      color: '#4ECDC4',
      glow: 'rgba(78,205,196,0.35)'
    },

    {
      icon: '🚀',
      text: 'Better Results',
      color: '#FF8C42',
      glow: 'rgba(255,140,66,0.35)'
    }

  ].map((feature, index) => (

    <div

      key={index}

      className="premium-feature-card"

      onMouseEnter={(e) => {

        e.currentTarget.style.transform =
          'translateY(-18px) scale(1.04) rotateX(6deg)';

        e.currentTarget.style.boxShadow =
          isDarkMode

            ? `
            0 45px 120px rgba(0,0,0,0.55),
            0 0 60px ${feature.glow}
            `

            : `
            0 45px 120px rgba(15,23,42,0.14),
            0 0 60px ${feature.glow}
            `;
      }}

      onMouseLeave={(e) => {

        e.currentTarget.style.transform =
          'translateY(0px) scale(1) rotateX(0deg)';

        e.currentTarget.style.boxShadow =
          isDarkMode

            ? `
            0 20px 60px rgba(0,0,0,0.35)
            `

            : `
            0 20px 60px rgba(15,23,42,0.08)
            `;
      }}

      style={{

        position: 'relative',

        overflow: 'hidden',

        padding: '42px 32px',

        borderRadius: '32px',

        background: isDarkMode

          ? `
          linear-gradient(
            145deg,
            rgba(255,255,255,0.12),
            rgba(255,255,255,0.03)
          )
          `

          : `
          linear-gradient(
            145deg,
            rgba(255,255,255,0.88),
            rgba(255,255,255,0.55)
          )
          `,

        backdropFilter:
          'blur(30px) saturate(180%)',

        border: isDarkMode

          ? '1px solid rgba(255,255,255,0.08)'

          : '1px solid rgba(255,255,255,0.95)',

        boxShadow: isDarkMode

          ? `
          0 20px 60px rgba(0,0,0,0.35)
          `

          : `
          0 20px 60px rgba(15,23,42,0.08)
          `,

        transition:
          'all 0.8s cubic-bezier(0.16,1,0.3,1)',

        transformStyle: 'preserve-3d',

        cursor: 'pointer',

        animation:
          `cardFloat 6s ease-in-out infinite ${index * 0.4}s`
      }}
    >

      {/* ANIMATED BORDER */}

      <div
        style={{
          position: 'absolute',

          inset: '0',

          borderRadius: '32px',

          padding: '1px',

          background: `
            linear-gradient(
              135deg,
              transparent,
              ${feature.color},
              transparent
            )
          `,

          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',

          WebkitMaskComposite: 'xor',

          opacity: 0.5,

          pointerEvents: 'none'
        }}
      />

      {/* LIGHT SWEEP */}

      <div
        style={{
          position: 'absolute',

          top: '-120%',

          left: '-30%',

          width: '90px',

          height: '320%',

          background: `
            linear-gradient(
              180deg,
              transparent,
              rgba(255,255,255,0.22),
              transparent
            )
          `,

          transform: 'rotate(25deg)',

          animation:
            `lightSweep 5s linear infinite ${index * 0.6}s`
        }}
      />

      {/* AMBIENT GLOW */}

      <div
        style={{
          position: 'absolute',

          width: '180px',
          height: '180px',

          borderRadius: '50%',

          background: `
            radial-gradient(
              circle,
              ${feature.glow},
              transparent 70%
            )
          `,

          top: '-60px',
          right: '-60px',

          filter: 'blur(50px)',

          opacity: 0.7
        }}
      />

      {/* ICON CONTAINER */}

      <div
        style={{
          position: 'relative',

          width: '82px',
          height: '82px',

          margin: '0 auto 24px',

          borderRadius: '24px',

          background: `
            linear-gradient(
              135deg,
              ${feature.color},
              rgba(255,255,255,0.15)
            )
          `,

          display: 'flex',

          alignItems: 'center',

          justifyContent: 'center',

          boxShadow: `
            0 20px 40px ${feature.glow}
          `,

          animation:
            `iconPulse 4s ease-in-out infinite ${index * 0.3}s`
        }}
      >

        <div
          style={{
            fontSize: '2.6rem',

            filter:
              'drop-shadow(0 6px 16px rgba(0,0,0,0.2))'
          }}
        >
          {feature.icon}
        </div>

      </div>

      {/* TEXT */}

      <div
        style={{
          position: 'relative',

          fontSize: '1.15rem',

          fontWeight: '700',

          color: isDarkMode
            ? '#ffffff'
            : '#0f172a',

          letterSpacing: '-0.02em',

          textAlign: 'center',

          lineHeight: '1.5',

          textShadow: isDarkMode

            ? '0 4px 20px rgba(0,0,0,0.35)'

            : '0 4px 20px rgba(255,255,255,0.6)'
        }}
      >
        {feature.text}
      </div>

    </div>

  ))}

</div>
        </div>
      </section>

      {/* Our Media Brands Section */}
      <section style={{
        padding: '80px 40px',
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '60px',
            alignItems: 'center'
          }}>
            {/* Content Side - Left */}
            <div style={{ padding: '40px' }}>
              <h2 style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                marginBottom: '24px',
                letterSpacing: '-0.03em'
              }}>
                <GradientText
                  colors={["#4ECDC4", "#FFD700", "#F39C12", "#9B59B6", "#4ECDC4"]}
                  animationSpeed={4}
                  direction="horizontal"
                  pauseOnHover={true}
                >
                  OUR MEDIA BRANDS
                </GradientText>
              </h2>
              
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '20px',
                color: '#FF6B6B',
                letterSpacing: '-0.02em'
              }}>
                Our Media Partner - Truemarktech
              </h3>
              
              {/* Main Content */}
              <div style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: isDarkMode ? '#e0e0e0' : '#333333',
                letterSpacing: '-0.01em'
              }}>
                <p className="media-content" style={{ marginBottom: '16px' }}>
                  Our carefully positioned network of content publishing platforms effectively connects with and captivates millions of influential individuals and decision-makers annually, encompassing various business sectors.
                </p>
                <p className="media-content" style={{ marginBottom: '24px' }}>
                  This enables you to promote your sponsored content, gather valuable lead information, generate impressions, and enhance the recognition of your brand.
                </p>
              </div>

                      {/* =========================
                PREMIUM STACK CARD SECTION
              ========================= */}

              <div className="premium-stack-wrapper">
                <div className="premium-stack-container">
                  <Stack
                    randomRotation={false}
                    sensitivity={240}
                    sendToBackOnClick={true}
                    autoplay={true}
                    autoplayDelay={800}
                    pauseOnHover={true}
                    cards={[
                      <div key="card1" className="premium-card orange-card">
                        <div className="card-noise"></div>
                        <div className="card-glow"></div>
                        <div className="card-shine"></div>

                        <div className="icon-wrapper">
                          <span className="premium-icon">🚀</span>
                        </div>

                        <div className="premium-card-title">
                          Content Publishing
                          <br />
                          Platforms
                        </div>

                        <div className="floating-orb orb-1"></div>
                        <div className="floating-orb orb-2"></div>
                      </div>,

                      <div key="card2" className="premium-card cyan-card">
                        <div className="card-noise"></div>
                        <div className="card-glow"></div>
                        <div className="card-shine"></div>

                        <div className="icon-wrapper">
                          <span className="premium-icon">🌍</span>
                        </div>

                        <div className="premium-card-title">
                          Millions of
                          <br />
                          Influential Individuals
                        </div>

                        <div className="floating-orb orb-1"></div>
                        <div className="floating-orb orb-2"></div>
                      </div>,

                      <div key="card3" className="premium-card red-card">
                        <div className="card-noise"></div>
                        <div className="card-glow"></div>
                        <div className="card-shine"></div>

                        <div className="icon-wrapper">
                          <span className="premium-icon">⚡</span>
                        </div>

                        <div className="premium-card-title">
                          Decision-Makers
                          <br />
                          Engagement
                        </div>

                        <div className="floating-orb orb-1"></div>
                        <div className="floating-orb orb-2"></div>
                      </div>,

                      <div key="card4" className="premium-card gold-card">
                        <div className="card-noise"></div>
                        <div className="card-glow"></div>
                        <div className="card-shine"></div>

                        <div className="icon-wrapper">
                          <span className="premium-icon">📈</span>
                        </div>

                        <div className="premium-card-title">
                          Brand Recognition
                          <br />
                          Enhancement
                        </div>

                        <div className="floating-orb orb-1"></div>
                        <div className="floating-orb orb-2"></div>
                      </div>
                    ]}
                    animationConfig={{
                      stiffness: 260,
                      damping: 18
                    }}
                  />
                </div>
              </div>
            </div>

{/* Rotating Brand Text Section */}

<div
  style={{
    position: 'relative',

    display: 'flex',

    alignItems: 'center',

    justifyContent: 'center',

    minHeight: '500px'
  }}
>

  
  {/* GLASS CIRCLE */}

  <div
    style={{
      width: '420px',
      height: '420px',

      borderRadius: '50%',

      background: isDarkMode
        ? `
        linear-gradient(
         145deg,
          rgba(238, 250, 6, 1),
          rgba(147, 142, 5, 0.86)
        )
        `
        : `
        linear-gradient(
          145deg,
          rgba(238, 250, 6, 1)),
          rgba(147, 142, 5, 0.86)
        )
        `,

      border: isDarkMode
        ? '1px solid white'
        : '1px solid black',

      backdropFilter: 'blur(30px)',

      display: 'flex',

      alignItems: 'center',

      justifyContent: 'center',

      position: 'relative',

      boxShadow: isDarkMode
        ? `
        0 30px 80px rgba(0,0,0,0.45),
        0 0 60px rgba(255,140,66,0.15)
        `
        : `
        0 30px 80px rgba(15,23,42,0.12),
        0 0 60px rgba(255,140,66,0.08)
        `
    }}
  >

              {/* ROTATING TEXT */}

              <div
                style={{
                  position: 'absolute',

                  transform: 'scale(1.05)'
                }}
              >
                <CircularText
                  text="TRUSTED*MEDIA*PARTNER*GLOBAL*REACH*B2B*MARKETING*"
                  spinDuration={14}
                  onHover="speedUp"
                />
              </div>

              {/* CENTER CONTENT */}

              <div
                style={{
                  width: '170px',
                  height: '170px',

                  borderRadius: '50%',

                  background: `
                  black
                  `,

                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'center',

                  flexDirection: 'column',

                  boxShadow:
                    '0 25px 60px rgba(255,107,107,0.35)',

                  position: 'relative',

                  overflow: 'hidden'
                }}
              >

                {/* SHINE */}

                <div
                  style={{
                    position: 'absolute',

                    top: '-40%',

                    left: '-40%',

                    width: '180%',

                    height: '180%',

                    background: `
                      linear-gradient(
                        135deg,
                        transparent,
                        rgba(255,255,255,0.25),
                        transparent
                      )
                    `,

                    transform: 'rotate(25deg)',

                    animation:
                      'shineMove 5s linear infinite'
                  }}
                />

                <div
                  style={{
                    fontSize: '0.8rem',

                    fontWeight: '700',

                    color: '#ffffff',

                    letterSpacing: '0.25em',

                    marginBottom: '6px',

                    zIndex: 2
                  }}
                >
                  GLOBAL
                </div>

                <div
                  style={{
                    fontSize: '1.2rem',

                    fontWeight: '900',

                    color: '#ffffff',

                    letterSpacing: '-0.03em',

                    zIndex: 2
                  }}
                >
                  MEDIA
                </div>

                <div
                  style={{
                    fontSize: '0.8rem',

                    fontWeight: '700',

                    color: '#ffffff',

                    letterSpacing: '0.18em',

                    marginTop: '6px',

                    zIndex: 2
                  }}
                >
                  NETWORK
                </div>

              </div>

            </div>

          </div>
          </div>
        </div>
      </section>

{/* ULTRA PREMIUM STATISTICS SECTION */}

<section
  style={{
    padding: '60px 24px',
    position: 'relative',
    overflow: 'hidden',
    background: isDarkMode

      ? `
        radial-gradient(circle at top left,
        rgba(255,140,66,0.10),
        transparent 30%),

        radial-gradient(circle at bottom right,
        rgba(78,205,196,0.10),
        transparent 30%),

        linear-gradient(
          180deg,
          #020202 0%,
          #000000 100%
        )
      `

      : `
        radial-gradient(circle at top left,
        rgba(255,140,66,0.08),
        transparent 30%),

        radial-gradient(circle at bottom right,
        rgba(78,205,196,0.08),
        transparent 30%),

        linear-gradient(
          180deg,
          #ffffff 0%,
          #f8fafc 100%
        )
      `,

    zIndex: 1
  }}
>

  {/* AMBIENT GLOW EFFECTS */}

  <div
    style={{
      position: 'absolute',
      top: '-200px',
      left: '-200px',
      width: '500px',
      height: '500px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(255,140,66,0.15), transparent 70%)',
      filter: 'blur(120px)',
      animation: 'floatGlow 8s ease-in-out infinite',
      zIndex: 0
    }}
  />

  <div
    style={{
      position: 'absolute',
      bottom: '-250px',
      right: '-250px',
      width: '600px',
      height: '600px',
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(78,205,196,0.15), transparent 70%)',
      filter: 'blur(140px)',
      animation: 'floatGlow 10s ease-in-out infinite reverse',
      zIndex: 0
    }}
  />


  {/* PREMIUM COUNTER GRID */}

  <div
    style={{
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 5
    }}
  >

    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '40px',
        perspective: '1800px'
      }}
    >

      {stats.map((stat, index) => (

        <div
          key={index}
          ref={el => statsRef.current[index] = el}

          style={{
            position: 'relative',

            minHeight: '200px',

            borderRadius: '36px',

            overflow: 'hidden',

            cursor: 'pointer',

            transformStyle: 'preserve-3d',

            background: isDarkMode

              ? `
                linear-gradient(
                  145deg,
                  rgba(255,255,255,0.08),
                  rgba(255,255,255,0.02)
                )
              `

              : `
                linear-gradient(
                  145deg,
                  rgba(255,255,255,0.92),
                  rgba(255,255,255,0.72)
                )
              `,

            backdropFilter: 'blur(30px)',

            border: isDarkMode
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(255,255,255,0.9)',

            boxShadow: isDarkMode

              ? `
                0 30px 80px rgba(0,0,0,0.55),
                inset 0 1px 0 rgba(255,255,255,0.08)
              `

              : `
                0 30px 80px rgba(15,23,42,0.08),
                inset 0 1px 0 rgba(255,255,255,0.9)
              `,

            transition:
              'all 0.8s cubic-bezier(0.16,1,0.3,1)'
          }}

          onMouseMove={(e) => {

            const card = e.currentTarget;

            const rect =
              card.getBoundingClientRect();

            const x =
              e.clientX - rect.left;

            const y =
              e.clientY - rect.top;

            const centerX =
              rect.width / 2;

            const centerY =
              rect.height / 2;

            const rotateX =
              ((y - centerY) / centerY) * -12;

            const rotateY =
              ((x - centerX) / centerX) * 12;

            gsap.to(card, {

              rotateX,
              rotateY,

              scale: 1.04,

              y: -12,

              duration: 0.8,

              ease: 'power3.out'
            });

          }}

          onMouseLeave={(e) => {

            gsap.to(e.currentTarget, {

              rotateX: 0,
              rotateY: 0,
              scale: 1,
              y: 0,

              duration: 1,

              ease: 'elastic.out(1,0.5)'
            });

          }}
        >

          {/* ROTATING HOLOGRAPHIC BORDER */}

          <div
            style={{
              position: 'absolute',
              inset: '-2px',
              borderRadius: '36px',

              background: `
                conic-gradient(
                  from 0deg,
                  transparent,
                  ${stat.color},
                  transparent,
                  rgba(255,255,255,0.2),
                  transparent
                )
              `,

              animation:
                `spinRing ${10 + index * 2}s linear infinite`,

              filter: 'blur(2px)'
            }}
          />

          {/* INNER GLASS PANEL */}

          <div
            style={{
              position: 'absolute',
              inset: '1px',
              borderRadius: '35px',

              background: isDarkMode

                ? `
                 linear-gradient(135deg, #885CFB 0%, #4F46EF 50%, #06B6D4 100%)
                `

                : `
                 linear-gradient(135deg, #885CFB 0%, #4F46EF 50%, #06B6D4 100%)
                `,

              backdropFilter: 'blur(40px)'
            }}
          />

          {/* FLOATING GLOW */}

          <div
            style={{
              position: 'absolute',
              width: '240px',
              height: '240px',
              top: '-70px',
              right: '-70px',
              borderRadius: '50%',

              background: `
                radial-gradient(
                  circle,
                  ${stat.color}35,
                  transparent 70%
                )
              `,

              filter: 'blur(70px)',

              animation:
                `floatGlow ${5 + index}s ease-in-out infinite`
            }}
          />

          {/* PARTICLES */}

          {[...Array(7)].map((_, i) => (

            <div
              key={i}

              style={{
                position: 'absolute',

                width: `${4 + i}px`,
                height: `${4 + i}px`,

                borderRadius: '50%',

                background: 'black',

                opacity: 0.35,

                top: `${15 + i * 10}%`,
                left: `${12 + i * 9}%`,

                filter: 'blur(1px)',

                animation:
                  `particleFloat ${
                    4 + i
                  }s ease-in-out infinite`
              }}
            />

          ))}

          {/* CONTENT */}

          <div
            style={{
              position: 'relative',
              zIndex: 5,
              height: '100%',

              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',

              textAlign: 'center',

              padding: '10px 20px'
            }}
          >


            {/* COUNTER */}

            <div
              style={{
                position: 'relative',

                fontSize: '5rem',

                fontWeight: '900',

                lineHeight: '1',

                letterSpacing: '-0.08em',

                marginBottom: '22px',

                background: `
                  linear-gradient(
                    135deg,
                    #ffffff,
                    ${stat.color},
                    #ffffff
                  )
                `,

                WebkitBackgroundClip: 'text',

                WebkitTextFillColor: 'transparent',

                filter: `
                  drop-shadow(
                    0 10px 30px ${stat.color}40
                  )
                `
              }}
            >

              {/* SHIMMER */}

              <div
                style={{
                  position: 'absolute',

                  inset: 0,

                  background: `
                    linear-gradient(
                      90deg,
                      transparent,
                      rgba(255,255,255,0.8),
                      transparent
                    )
                  `,

                  transform: 'skewX(-20deg)',

                  animation:
                    `shimmerMove 3s infinite`
                }}
              />

              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                color={stat.color}
                loop={true}
              />

            </div>

            {/* LABEL */}

            <div
              style={{
                maxWidth: '220px',

                fontSize: '1.05rem',

                lineHeight: '1.8',

                color: isDarkMode

                  ? 'white'

                  : 'black',

                fontWeight: '500'
              }}
            >
              {stat.label}
            </div>

          </div>

        </div>

      ))}

    </div>

  </div>

</section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} style={{
        padding: '50px 20px',
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 className="reveal-text" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '800',
              marginBottom: '24px',
              color: isDarkMode ? '#ffffff' : '#09243F',
              letterSpacing: '-0.03em'
            }}>
              Client Success Stories
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: isDarkMode ? '#b0b0b0' : '#666666',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Hear what our clients have to say about working with us
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            width: '100%'
          }}>
            {testimonials.map((testimonial, index) => (
              <SpotlightCard
                key={index}
                className="testimonial-spotlight-card"
                spotlightColor={isDarkMode ? "rgba(255, 140, 66, 0.25)" : "rgba(255, 107, 107, 0.3)"}
              >
                <div
                  ref={el => testimonialCardsRef.current[index] = el}
                  className="interactive-card"
                  style={{
                    '--hover-shadow': isDarkMode 
                      ? '0 16px 48px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.4)'
                      : '0 20px 60px rgba(0,0,0,0.2), inset 0 3px 0 rgba(255,255,255,0.95), inset 0 -3px 0 rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.7)',
                    padding: '28px',
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 100%)' 
                      : 'linear-gradient(145deg, #f0f0f0 0%, #fafafa 30%, #e8e8e8 60%, #f5f5f5 100%)',
                    borderRadius: '24px',
                    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(200,200,200,0.8)'}`,
                    backdropFilter: 'blur(25px)',
                    cursor: 'pointer',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '380px',
                    height: '320px',
                    minHeight: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: isDarkMode 
                      ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3)'
                      : '0 12px 40px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -2px 0 rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateZ(0)',
                    willChange: 'transform'
                  }}
                  onClick={() => {
                    openPopup({
                      title: `${testimonial.name}'s Story`,
                      content: testimonial.story,
                      color: '#FF6B6B'
                    });
                  }}
                >
                  <div style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px'
                  }}>
                    {/* Button */}
                    <div className="story-button" style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      zIndex: 10,
                      boxShadow: '0 4px 16px rgba(255,107,107,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Read full story
                    </div>

                    {/* Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '20px',
                      paddingRight: '80px'
                    }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 50%, #FFA500 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                        flexShrink: 0,
                        boxShadow: '0 6px 20px rgba(255,107,107,0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
                        border: '2px solid rgba(255,255,255,0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div className="avatar-shine" style={{
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                          transform: 'translateX(-100%)',
                          transition: 'transform 0.6s ease'
                        }} />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                      }}>
                        <h4 style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          color: isDarkMode ? '#ffffff' : '#09243F',
                          margin: '0 0 12px 0',
                          letterSpacing: '-0.01em',
                          lineHeight: '1.3',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}>
                          {testimonial.name}
                        </h4>
                        <p style={{
                          fontSize: '0.85rem',
                          color: isDarkMode ? '#b0b0b0' : '#666666',
                          margin: '0 0 12px 0',
                          lineHeight: '1.4',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}>
                          {testimonial.position}
                        </p>
                        <p style={{
                          fontSize: '0.75rem',
                          color: isDarkMode ? '#999999' : '#888888',
                          margin: '0',
                          lineHeight: '1.4',
                          fontWeight: '400',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          paddingTop: '4px'
                        }}>
                          {testimonial.company}
                        </p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                      width: '100%',
                      height: '2px',
                      background: isDarkMode 
                        ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)'
                        : 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
                      marginBottom: '20px',
                      borderRadius: '1px'
                    }} />

                    {/* Testimonial Content */}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}>
                      <blockquote style={{
                        position: 'relative',
                        margin: '0',
                        padding: '0 16px',
                        fontSize: '0.95rem',
                        color: isDarkMode ? '#e0e0e0' : '#333333',
                        lineHeight: '1.6',
                        fontStyle: 'italic',
                        letterSpacing: '-0.005em'
                      }}>
                        <span style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '-8px',
                          fontSize: '2rem',
                          color: isDarkMode ? 'rgba(255,107,107,0.3)' : 'rgba(255,107,107,0.2)',
                          fontFamily: 'Georgia, serif',
                          lineHeight: '1'
                        }}>"</span>
                        {testimonial.content}
                        <span style={{
                          position: 'absolute',
                          bottom: '-16px',
                          right: '-8px',
                          fontSize: '2rem',
                          color: isDarkMode ? 'rgba(255,107,107,0.3)' : 'rgba(255,107,107,0.2)',
                          fontFamily: 'Georgia, serif',
                          lineHeight: '1'
                        }}>"</span>
                      </blockquote>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} style={{
        padding: '60px 20px',
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 className="reveal-text" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '800',
              marginBottom: '24px',
              color: isDarkMode ? '#ffffff' : '#09243F',
              letterSpacing: '-0.03em'
            }}>
              Get In Touch
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: isDarkMode ? '#b0b0b0' : '#666666',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Ready to transform your demand generation strategy? Let's talk!
            </p>
          </div>

          <form 
            ref={contactFormRef}
            onSubmit={handleSubmit} 
            style={{
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              padding: '56px',
              borderRadius: '24px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              backdropFilter: 'blur(20px)'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              marginBottom: '24px'
            }}>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{
                  padding: '18px',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                  borderRadius: '12px',
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
                  color: isDarkMode ? '#ffffff' : '#09243F',
                  fontSize: '1rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  gsap.to(e.target, {
                    borderColor: '#FF6B6B',
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                }}
                onBlur={(e) => {
                  gsap.to(e.target, {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                style={{
                  padding: '18px',
                  border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                  borderRadius: '12px',
                  background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
                  color: isDarkMode ? '#ffffff' : '#09243F',
                  fontSize: '1rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  gsap.to(e.target, {
                    borderColor: '#FF6B6B',
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                }}
                onBlur={(e) => {
                  gsap.to(e.target, {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                }}
              />
            </div>

            <input
              type="text"
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              style={{
                width: '100%',
                padding: '18px',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                borderRadius: '12px',
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
                color: isDarkMode ? '#ffffff' : '#09243F',
                fontSize: '1rem',
                marginBottom: '24px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none'
              }}
              onFocus={(e) => {
                gsap.to(e.target, {
                  borderColor: '#FF6B6B',
                  scale: 1.02,
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
              onBlur={(e) => {
                gsap.to(e.target, {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  scale: 1,
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
            />

            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              rows="5"
              style={{
                width: '100%',
                padding: '18px',
                border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                borderRadius: '12px',
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
                color: isDarkMode ? '#ffffff' : '#09243F',
                fontSize: '1rem',
                resize: 'vertical',
                marginBottom: '32px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                gsap.to(e.target, {
                  borderColor: '#FF6B6B',
                  scale: 1.02,
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
              onBlur={(e) => {
                gsap.to(e.target, {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  scale: 1,
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? '#cccccc' : 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)',
                color: 'white',
                border: 'none',
                padding: '18px 48px',
                fontSize: '1.1rem',
                fontWeight: '600',
                borderRadius: '32px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(255,107,107,0.3)',
                width: '100%',
                willChange: 'transform',
                letterSpacing: '0.02em'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  gsap.to(e.target, {
                    scale: 1.02,
                    y: -2,
                    boxShadow: '0 15px 40px rgba(255,107,107,0.4)',
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  gsap.to(e.target, {
                    scale: 1,
                    y: 0,
                    boxShadow: '0 10px 30px rgba(255,107,107,0.3)',
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                }
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {showSuccess && (
              <div style={{
                marginTop: '24px',
                padding: '20px',
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                borderRadius: '12px',
                color: '#4CAF50',
                textAlign: 'center',
                fontSize: '1rem'
              }}>
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer Component */}
      <Footer isDarkMode={isDarkMode} />

      {/* Popup Modal */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}
        onClick={closePopup}
        >
          <div 
            ref={popupRef}
            style={{
              background: isDarkMode ? '#000000' : '#ffffff',
              borderRadius: '24px',
              padding: '48px',
              maxWidth: '600px',
              width: '100%',
              position: 'relative',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                color: isDarkMode ? '#ffffff' : '#000000',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                gsap.to(e.target, {
                  scale: 1.2,
                  color: '#FF6B6B',
                  duration: 0.2,
                  ease: 'power2.out'
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.target, {
                  scale: 1,
                  color: isDarkMode ? '#ffffff' : '#000000',
                  duration: 0.2,
                  ease: 'power2.out'
                });
              }}
            >
              ×
            </button>
            
            <div ref={popupContentRef}>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '24px',
                color: popupContent?.color || '#FF6B6B',
                letterSpacing: '-0.02em'
              }}>
                {popupContent?.title}
              </h3>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: isDarkMode ? '#e0e0e0' : '#333333',
                marginBottom: '32px'
              }}>
                {popupContent?.content}
              </p>
              <button
                onClick={closePopup}
                style={{
                  background: popupContent?.color || '#FF6B6B',
                  color: 'white',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.target, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: 'power2.out'
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.target, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                  });
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => scrollToSection(contactRef)}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%)',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          fontSize: '1.6rem',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255,107,107,0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform'
        }}
        onMouseEnter={(e) => {
          gsap.to(e.target, {
            scale: 1.1,
            y: -5,
            boxShadow: '0 15px 40px rgba(255,107,107,0.4)',
            duration: 0.3,
            ease: 'power2.out'
          });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.target, {
            scale: 1,
            y: 0,
            boxShadow: '0 10px 30px rgba(255,107,107,0.3)',
            duration: 0.3,
            ease: 'power2.out'
          });
        }}
      >
        {"\u2709"}
      </button>
    </div>
  </ClickSpark>
  );
};

export default AppProfessional;
