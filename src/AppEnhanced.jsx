import React, { useState, useEffect, useRef } from 'react';

const AppEnhanced = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    services: [],
    message: ''
  });
  const [formStep, setFormStep] = useState(1);
  const [animatedStats, setAnimatedStats] = useState({ founded: 0, leads: 0, clients: 0, satisfaction: 0 });

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        document.body.style.backgroundColor = '#0f172a';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#f8fafc';
      }
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Theme application error:', error);
    }
  }, [isDarkMode]);

  // Animated counter effect
  useEffect(() => {
    const targetStats = { founded: 2012, leads: 10000, clients: 500, satisfaction: 99 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        founded: Math.floor(targetStats.founded * progress),
        leads: Math.floor(targetStats.leads * progress),
        clients: Math.floor(targetStats.clients * progress),
        satisfaction: Math.floor(targetStats.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: "Content Syndication Leads",
      description: "Initial-stage content marketing targeting prospects at the beginning of the sales funnel",
      icon: "https://img.icons8.com/fluency/48/document.png",
      features: ["100% engagement with opt-in leads", "Customized content distribution", "Real-time lead qualification"]
    },
    {
      title: "Marketing Qualified Leads",
      description: "Mid-funnel prospects with demonstrated engagement and profiling",
      icon: "https://img.icons8.com/fluency/48/user-group.png",
      features: ["Detailed prospect profiling", "Multi-touch attribution", "Lead scoring system"]
    },
    {
      title: "Sales Qualified Leads",
      description: "Bottom-of-funnel prospects with strong purchasing intent",
      icon: "https://img.icons8.com/fluency/48/currency-dollar-circle.png",
      features: ["High-intent buyers", "Ready-to-convert leads", "Direct sales handoff"]
    },
    {
      title: "Customized Programs",
      description: "Tailored solutions for specific industry requirements",
      icon: "https://img.icons8.com/fluency/48/settings.png",
      features: ["Industry-specific targeting", "Custom reporting", "Dedicated account management"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      position: "Marketing Director",
      content: "TrueWaveites transformed our lead generation strategy. We saw a 300% increase in qualified leads within the first quarter.",
      rating: 5
    },
    {
      name: "Michael Chen",
      company: "Innovation Labs",
      position: "CEO",
      content: "The quality of leads from TrueWaveites is exceptional. Their data-driven approach ensures we're always talking to the right prospects.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      company: "Global Solutions",
      position: "VP Sales",
      content: "We've tried many lead generation partners, but TrueWaveites stands out. Their compliance and quality standards are unmatched.",
      rating: 5
    }
  ];

  const valueProps = [
    { title: "Data-Driven Targeting", description: "Leverage advanced demographic and firmographic filters", icon: "https://img.icons8.com/fluency/48/target.png" },
    { title: "Uncompromising Quality", description: "100% reliability with active ICP engagement", icon: "https://img.icons8.com/fluency/48/quality.png" },
    { title: "Compliance at Core", description: "GDPR, CCPA, CASL, and LGPD compliant", icon: "https://img.icons8.com/fluency/48/shield.png" },
    { title: "Global Reach", description: "USA and UK offices with worldwide coverage", icon: "https://img.icons8.com/fluency/48/globe.png" },
    { title: "Real-Time Analytics", description: "Live dashboards and performance metrics", icon: "https://img.icons8.com/fluency/48/analytics.png" },
    { title: "Expert Support", description: "Dedicated account managers and strategic guidance", icon: "https://img.icons8.com/fluency/48/support.png" }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
    alert('Thank you for your inquiry! We\'ll contact you within 24 hours.');
    setFormData({ name: '', email: '', company: '', services: [], message: '' });
    setFormStep(1);
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service) 
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
      color: isDarkMode ? '#f1f5f9' : '#1e293b',
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)`,
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          transition: 'transform 0.3s ease'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)`,
          transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
          transition: 'transform 0.3s ease'
        }} />
      </div>

      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 0',
        backgroundColor: isDarkMode ? 'rgba(15,23,42,0.95)' : 'rgba(248,250,252,0.95)',
        backdropFilter: 'blur(10px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
        zIndex: 1000,
        transform: scrollY > 50 ? 'translateY(0)' : 'translateY(0)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: isDarkMode ? '#ffffff' : '#1e293b',
                margin: 0,
                background: `linear-gradient(135deg, ${isDarkMode ? '#ffffff' : '#1e293b'} 0%, #fb923c 50%, #3b82f6 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                TrueWaveites
              </h1>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#fb923c',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
            </div>
            
            {/* Desktop Navigation */}
            <nav style={{ display: { xs: 'none', md: 'flex' }, gap: '30px', alignItems: 'center' }}>
              {['Services', 'About', 'Case Studies', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  style={{
                    color: isDarkMode ? '#cbd5e1' : '#475569',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#fb923c'}
                  onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#cbd5e1' : '#475569'}
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#fb923c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(251,146,60,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f97316';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fb923c';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column',
                gap: '4px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '25px',
                height: '3px',
                backgroundColor: isDarkMode ? '#ffffff' : '#1e293b',
                transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                transition: 'all 0.3s ease'
              }} />
              <div style={{
                width: '25px',
                height: '3px',
                backgroundColor: isDarkMode ? '#ffffff' : '#1e293b',
                opacity: isMenuOpen ? 0 : 1,
                transition: 'all 0.3s ease'
              }} />
              <div style={{
                width: '25px',
                height: '3px',
                backgroundColor: isDarkMode ? '#ffffff' : '#1e293b',
                transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
                transition: 'all 0.3s ease'
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '20px',
              lineHeight: '1.2',
              background: `linear-gradient(135deg, ${isDarkMode ? '#ffffff' : '#1e293b'} 0%, #fb923c 50%, #3b82f6 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              We Slice Through The Clutter
            </h1>
            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto 40px',
              color: isDarkMode ? '#cbd5e1' : '#64748b',
              animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
            }}>
              Your trusted B2B demand generation partner since 2012. We prioritize what truly counts - Outcomes!
            </p>
            
            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
            }}>
              <button style={{
                padding: '16px 32px',
                backgroundColor: '#fb923c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px rgba(251,146,60,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f97316';
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 15px 35px rgba(251,146,60,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fb923c';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 25px rgba(251,146,60,0.3)';
              }}
              onClick={() => setFormStep(1)}
            >
              Get Free Lead Audit
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
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#3b82f6';
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
            >
              Watch Demo
            </button>
            </div>
          </div>

          {/* Animated Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {[
              { value: animatedStats.founded, label: 'Founded', suffix: '' },
              { value: animatedStats.leads, label: 'Leads Generated', suffix: '+' },
              { value: animatedStats.clients, label: 'Happy Clients', suffix: '+' },
              { value: animatedStats.satisfaction, label: 'Satisfaction', suffix: '%' }
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  padding: '30px',
                  backgroundColor: isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.1)' : 'rgba(203,213,225,0.3)'}`,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  animation: `fadeInUp 0.8s ease-out ${0.6 + index * 0.1}s backwards`,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-10px) scale(1.02)';
                  e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  e.target.style.borderColor = '#fb923c';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  e.target.style.borderColor = isDarkMode ? 'rgba(148,163,184,0.1)' : 'rgba(203,213,225,0.3)';
                }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  background: `linear-gradient(135deg, #fb923c 0%, #3b82f6 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section id="value-props" style={{
        padding: '80px 20px',
        backgroundColor: isDarkMode ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px',
            color: isDarkMode ? '#ffffff' : '#1e293b'
          }}>
            Why Choose TrueWaveites
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {valueProps.map((prop, index) => (
              <div
                key={index}
                style={{
                  padding: '30px',
                  backgroundColor: isDarkMode ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.1)' : 'rgba(203,213,225,0.3)'}`,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-10px) rotateX(5deg)';
                  e.target.style.boxShadow = '0 20px 40px rgba(251,146,60,0.2)';
                  e.target.style.borderColor = '#fb923c';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) rotateX(0)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                  e.target.style.borderColor = isDarkMode ? 'rgba(148,163,184,0.1)' : 'rgba(203,213,225,0.3)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#fb923c',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 8px 20px rgba(251,146,60,0.3)'
                }}>
                  <img src={prop.icon} alt={prop.title} style={{ width: '30px', height: '30px', filter: 'brightness(0) invert(1)' }} />
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '15px',
                  color: isDarkMode ? '#ffffff' : '#1e293b'
                }}>
                  {prop.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: isDarkMode ? '#94a3b8' : '#64748b'
                }}>
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{
        padding: '80px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            color: isDarkMode ? '#ffffff' : '#1e293b'
          }}>
            Our Services
          </h2>
          <p style={{
            fontSize: '1.2rem',
            textAlign: 'center',
            marginBottom: '60px',
            maxWidth: '800px',
            margin: '0 auto 60px',
            color: isDarkMode ? '#94a3b8' : '#64748b'
          }}>
            Comprehensive B2B demand generation solutions tailored to your business needs
          </p>

          {/* Service Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveService(index)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: activeService === index ? '#fb923c' : (isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)'),
                  color: activeService === index ? 'white' : (isDarkMode ? '#cbd5e1' : '#64748b'),
                  border: activeService === index ? '2px solid #fb923c' : `1px solid ${isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (activeService !== index) {
                    e.target.style.backgroundColor = isDarkMode ? 'rgba(251,146,60,0.1)' : 'rgba(251,146,60,0.05)';
                    e.target.style.borderColor = '#fb923c';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeService !== index) {
                    e.target.style.backgroundColor = isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)';
                    e.target.style.borderColor = isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)';
                  }
                }}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Service Content */}
          <div style={{
            padding: '40px',
            backgroundColor: isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.1)' : 'rgba(203,213,225,0.3)'}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            transition: 'all 0.5s ease'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: '40px', alignItems: 'center' }}>
              <div>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#fb923c',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '30px',
                  boxShadow: '0 10px 25px rgba(251,146,60,0.3)',
                  transform: 'rotate(-5deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  <img src={services[activeService].icon} alt={services[activeService].title} style={{ width: '40px', height: '40px', filter: 'brightness(0) invert(1)' }} />
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  color: isDarkMode ? '#ffffff' : '#1e293b'
                }}>
                  {services[activeService].title}
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  marginBottom: '30px',
                  color: isDarkMode ? '#94a3b8' : '#64748b'
                }}>
                  {services[activeService].description}
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {services[activeService].features.map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#fb923c',
                        borderRadius: '50%'
                      }} />
                      <span style={{ fontSize: '0.95rem', color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{
                position: 'relative',
                height: '300px',
                backgroundColor: isDarkMode ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.5)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  background: `conic-gradient(from 0deg, #fb923c, #3b82f6, #fb923c)`,
                  borderRadius: '50%',
                  animation: 'spin 8s linear infinite',
                  opacity: 0.1
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#fb923c',
                  textAlign: 'center'
                }}>
                  {activeService + 1}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{
        padding: '80px 20px',
        backgroundColor: isDarkMode ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '60px',
            color: isDarkMode ? '#ffffff' : '#1e293b'
          }}>
            Client Success Stories
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
            gap: '30px'
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  padding: '30px',
                  backgroundColor: isDarkMode ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.1)' : 'rgba(203,213,225,0.3)'}`,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: currentTestimonial === index ? 'scale(1.05)' : 'scale(1)',
                  opacity: currentTestimonial === index ? 1 : 0.7
                }}
                onMouseEnter={() => setCurrentTestimonial(index)}
                onMouseLeave={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
              >
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#fb923c', fontSize: '1.2rem' }}>{"\u2b50"}</span>
                  ))}
                </div>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  fontStyle: 'italic',
                  color: isDarkMode ? '#cbd5e1' : '#64748b'
                }}>
                  "{testimonial.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#fb923c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: isDarkMode ? '#ffffff' : '#1e293b' }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                      {testimonial.position}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" style={{
        padding: '80px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            color: isDarkMode ? '#ffffff' : '#1e293b'
          }}>
            Get In Touch
          </h2>
          <p style={{
            fontSize: '1.2rem',
            textAlign: 'center',
            marginBottom: '60px',
            color: isDarkMode ? '#94a3b8' : '#64748b'
          }}>
            Ready to transform your B2B demand generation? Let's discuss your goals
          </p>

          {/* Progress Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '40px'
          }}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: formStep >= step ? '#fb923c' : (isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)'),
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          <form onSubmit={handleFormSubmit} style={{
            padding: '40px',
            backgroundColor: isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.1)' : 'rgba(203,213,225,0.3)'}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            {formStep === 1 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '30px', color: isDarkMode ? '#ffffff' : '#1e293b' }}>
                  Tell us about yourself
                </h3>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      padding: '15px',
                      backgroundColor: isDarkMode ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.5)',
                      border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)'}`,
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fb923c';
                      e.target.style.boxShadow = '0 0 0 3px rgba(251,146,60,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Business Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      padding: '15px',
                      backgroundColor: isDarkMode ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.5)',
                      border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)'}`,
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fb923c';
                      e.target.style.boxShadow = '0 0 0 3px rgba(251,146,60,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    style={{
                      padding: '15px',
                      backgroundColor: isDarkMode ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.5)',
                      border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)'}`,
                      borderRadius: '8px',
                      color: isDarkMode ? '#ffffff' : '#1e293b',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fb923c';
                      e.target.style.boxShadow = '0 0 0 3px rgba(251,146,60,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  <div></div>
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    disabled={!formData.name || !formData.email}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: (!formData.name || !formData.email) ? 'rgba(251,146,60,0.3)' : '#fb923c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: (!formData.name || !formData.email) ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {formStep === 2 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '30px', color: isDarkMode ? '#ffffff' : '#1e293b' }}>
                  What services interest you?
                </h3>
                <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                  {services.map((service, index) => (
                    <label
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        padding: '15px',
                        backgroundColor: formData.services.includes(service.title) ? 'rgba(251,146,60,0.1)' : (isDarkMode ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.5)'),
                        border: `1px solid ${formData.services.includes(service.title) ? '#fb923c' : (isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)')}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.title)}
                        onChange={() => handleServiceChange(service.title)}
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: `2px solid ${formData.services.includes(service.title) ? '#fb923c' : (isDarkMode ? '#94a3b8' : '#64748b')}`,
                        borderRadius: '4px',
                        backgroundColor: formData.services.includes(service.title) ? '#fb923c' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}>
                        {formData.services.includes(service.title) && (
                          <span style={{ color: 'white', fontSize: '12px' }}>{"\u2713"}</span>
                        )}
                      </div>
                      <span style={{ color: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: '500' }}>
                        {service.title}
                      </span>
                    </label>
                  ))}
                </div>
                <textarea
                  placeholder="Tell us about your goals and requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: isDarkMode ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.5)',
                    border: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)'}`,
                    borderRadius: '8px',
                    color: isDarkMode ? '#ffffff' : '#1e293b',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fb923c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(251,146,60,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = isDarkMode ? 'rgba(148,163,184,0.2)' : 'rgba(203,213,225,0.5)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStep(3)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#fb923c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {formStep === 3 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '30px', color: isDarkMode ? '#ffffff' : '#1e293b' }}>
                  Review & Submit
                </h3>
                <div style={{
                  padding: '20px',
                  backgroundColor: isDarkMode ? 'rgba(15,23,42,0.5)' : 'rgba(241,245,249,0.5)',
                  borderRadius: '8px',
                  marginBottom: '30px'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#fb923c' }}>Name:</strong> {formData.name}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#fb923c' }}>Email:</strong> {formData.email}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#fb923c' }}>Company:</strong> {formData.company || 'Not provided'}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#fb923c' }}>Services:</strong> {formData.services.join(', ') || 'Not selected'}
                  </div>
                  {formData.message && (
                    <div>
                      <strong style={{ color: '#fb923c' }}>Message:</strong> {formData.message}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#fb923c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(251,146,60,0.3)'
                    }}
                  >
                    Submit Inquiry
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 20px 30px',
        backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' },
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#fb923c' }}>
                TrueWaveites
              </h3>
              <p style={{ lineHeight: '1.6', color: '#94a3b8', marginBottom: '20px' }}>
                We slice through the clutter and prioritize what truly counts - Outcomes! Your trusted B2B demand generation partner since 2012.
              </p>
              <div style={{ display: 'flex', gap: '15px' }}>
                {['LinkedIn', 'Twitter', 'Facebook'].map((social) => (
                  <div
                    key={social}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(251,146,60,0.1)',
                      border: '1px solid rgba(251,146,60,0.3)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fb923c';
                      e.target.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(251,146,60,0.1)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: '#ffffff' }}>
                Services
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {services.map((service, index) => (
                  <a
                    key={index}
                    href="#services"
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#fb923c'}
                    onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                  >
                    {service.title}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: '#ffffff' }}>
                Company
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['About Us', 'Case Studies', 'Blog', 'Careers'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    style={{
                      color: '#94a3b8',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#fb923c'}
                    onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '20px', color: '#ffffff' }}>
                Contact
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#94a3b8' }}>
                <div>+1-225-347-5362</div>
                <div>info@truewaveites.com</div>
                <div>74 E Glenwood Ave, Smyrna, DE 19977</div>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: `1px solid ${isDarkMode ? 'rgba(148,163,184,0.1)' : 'rgba(203,213,225,0.3)'}`,
            paddingTop: '30px',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <p>&copy; {new Date().getFullYear()} TrueWaveites. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AppEnhanced;
