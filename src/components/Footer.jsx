import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon
} from '@heroicons/react/24/outline';
import {
  ShareIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid';

const Footer = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const footerLinks = {
    solutions: [
      { name: 'Content Syndication Leads', href: '/solutions', onClick: (e) => { e.preventDefault(); navigate('/solutions'); } },
      { name: 'Marketing Qualified Leads', href: '/solutions', onClick: (e) => { e.preventDefault(); navigate('/solutions'); } },
      { name: 'Sales Qualified Leads', href: '/solutions', onClick: (e) => { e.preventDefault(); navigate('/solutions'); } },
      { name: 'Customized Programs', href: '/solutions', onClick: (e) => { e.preventDefault(); navigate('/solutions'); } }
    ],
    company: [
      { name: 'About Us', href: '/about', onClick: (e) => { e.preventDefault(); navigate('/about'); } },
      { name: 'Our Solutions', href: '/solutions', onClick: (e) => { e.preventDefault(); navigate('/solutions'); } },
      { name: 'Blog', href: '/resources', onClick: (e) => { e.preventDefault(); navigate('/resources'); } },
      { name: 'Contact Us', href: '/contact', onClick: (e) => { e.preventDefault(); navigate('/contact'); } }
    ],
   
  };

  const socialLinks = [
    { icon: '/assets/facebook.png', fallback: 'f', unicode: '📘', href: 'https://www.facebook.com/truewaveites', label: 'Facebook' },
    { icon: '/assets/linkedin.png', fallback: 'in', unicode: '💼', href: 'https://www.linkedin.com/company/true-wave-ites/', label: 'LinkedIn' },
    { icon: '/assets/instagram.png', fallback: 'ig', unicode: '📷', href: 'https://www.instagram.com/truewaveites', label: 'Instagram' },
    { icon: '/assets/twitter.png', fallback: 'tw', unicode: '🐦', href: 'https://www.twitter.com/truewaveites', label: 'Twitter' }
  ];

  return (
    <footer style={{
      background: '#000000',
      color: '#ffffff',
      position: 'relative',
      zIndex: 50,
      marginTop: 'auto',
      overflow: 'hidden',
      boxShadow: isDarkMode 
        ? 'none'
        : '0 -4px 20px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Logo and Animated Background Particles */}
      <>
        {/* Logo */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 3,
          pointerEvents: 'none'
        }}>
          <img
            src="/assets/logo black.jpeg"
            alt="TrueWaveites Logo"
            style={{
              width: '300px',
              height: '150px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              backgroundColor: 'transparent',
              borderRadius: '8px'
            }}
            onError={(e) => {
              console.error('Logo load error:', e);
              e.target.src = isDarkMode ? "/assets/logo_white-removebg-preview.png" : "/assets/logo black.jpeg";
            }}
          />
        </div>

        {/* Animated Background Particles */}
        {!isDarkMode && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#10b981' : '#60a5fa',
                  opacity: 0.6,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${15 + (i * 2)}s ease-in-out infinite`,
                  boxShadow: `0 0 10px rgba(59, 130, 246, 0.3)`
                }}
              />
            ))}
          </div>
        )}
      </>

      {/* Main Footer Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 16px',
        paddingTop: '180px',
        paddingBottom: '48px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px'
        }}>
          {/* Company Info */}
          <div style={{
            gridColumn: 'span 1',
            position: 'relative'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
                            
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                True<span style={{ 
                  color: '#ff7e0eff',
                  fontWeight: '900',
                  textShadow: '0 2px 8px rgba(255, 126, 14, 0.5)'
                }}>Wave</span>ITES
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#e2e8f0',
                marginBottom: '24px',
                lineHeight: '1.7',
                fontWeight: '500'
              }}>
                Your trusted B2B demand generation partner since 2012. We slice through the clutter and prioritize what truly counts - Outcomes!
              </p>
              
                          </motion.div>
          </div>

          {/* Solutions Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>Solutions</h4>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {footerLinks.solutions.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    style={{
                      color: '#e2e8f0',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(96, 165, 250, 0.2)';
                      e.target.style.color = '#ffffff';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.color = '#e2e8f0';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>Company</h4>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    style={{
                      color: '#e2e8f0',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '500',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(96, 165, 250, 0.2)';
                      e.target.style.color = '#ffffff';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.color = '#e2e8f0';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
                        <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '20px',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <PhoneIcon style={{ 
                  height: '20px', 
                  width: '20px', 
                  color: '#ff7e0eff',
                  filter: 'drop-shadow(0 2px 4px rgba(96, 165, 250, 0.3))'
                }} />
                <span style={{ 
                  color: '#ffffff',
                  fontWeight: '500'
                }}>+1-225-347-5362</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <EnvelopeIcon style={{ 
                  height: '20px', 
                  width: '20px', 
                  color: '#ff7e0eff',
                  filter: 'drop-shadow(0 2px 4px rgba(96, 165, 250, 0.3))'
                }} />
                <span style={{ 
                  color: '#ffffff',
                  fontWeight: '500'
                }}>info@truewaveites.com</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <MapPinIcon style={{ 
                  height: '20px', 
                  width: '20px', 
                  color: '#ff7e0eff',
                  marginTop: '2px',
                  filter: 'drop-shadow(0 2px 4px rgba(96, 165, 250, 0.3))'
                }} />
                <div style={{ 
                  color: '#ffffff',
                  fontWeight: '500'
                }}>
                  <p style={{ margin: '0 0 4px 0' }}>74 E Glenwood Ave, Smyrna, DE 19977, USA</p>
                  <p style={{ margin: '0' }}>62 Anson Rd, London NW2 6AD, UK</p>
                </div>
              </div>
            </div>
          </motion.div>

                  </div>

        {/* Bottom Footer */}
        <div style={{
          borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          paddingTop: '24px',
          paddingBottom: '24px'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}>
              {/* Copyright */}
              <div style={{
                color: '#9ca3af',
                fontSize: '0.875rem',
                marginBottom: '0'
              }}>
                &copy; {new Date().getFullYear()} TruewaveITES. All Rights Reserved.
              </div>

              {/* Social Links */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
              }}>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#9ca3af',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                    whileHover={{ scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* Try local image first */}
                    <img 
                      src={social.icon} 
                      alt={social.label}
                      style={{ 
                        height: '20px', 
                        width: '20px',
                        filter: 'brightness(0) invert(1)',
                        transition: 'all 0.3s ease',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.log(`Image failed for ${social.label}, trying fallback...`);
                        // Hide failed image and show text fallback
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          // Show fallback text
                          parent.innerHTML = social.fallback;
                          parent.style.fontSize = '16px';
                          parent.style.fontWeight = 'bold';
                          parent.style.color = '#ffffff';
                          parent.style.textTransform = 'uppercase';
                        }
                      }}
                    />
                    {/* Unicode fallback as last resort */}
                    <span 
                      style={{
                        position: 'absolute',
                        fontSize: '20px',
                        display: 'none'
                      }}
                    >
                      {social.unicode}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
