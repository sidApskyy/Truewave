import React, {
  useState,
  useRef,
  useEffect,
  forwardRef
} from 'react';

import { gsap } from 'gsap';

import './HeaderGooey.css';

const Header = forwardRef(
  (
    {
      isDarkMode,
      setIsDarkMode,
      navigate
    },
    ref
  ) => {

    const [solutionsDropdown, setSolutionsDropdown] =
      useState(false);

    const internalHeaderRef = useRef(null);

    const logoRef = useRef(null);

    const navRef = useRef(null);

    const headerRef =
      ref || internalHeaderRef;

    /* =========================================
       ENTRANCE ANIMATIONS
    ========================================= */

    useEffect(() => {

      const ctx = gsap.context(() => {

        gsap.set(headerRef.current, {
          y: -40,
          opacity: 0
        });

        gsap.to(headerRef.current, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.15
        });

        gsap.set(logoRef.current, {
          scale: 0.8,
          opacity: 0,
          rotation: -8
        });

        gsap.to(logoRef.current, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1.4,
          ease: 'expo.out',
          delay: 0.3
        });

        gsap.set(navRef.current.children, {
          y: -20,
          opacity: 0
        });

        gsap.to(navRef.current.children, {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 1,
          ease: 'power3.out',
          delay: 0.45
        });

      }, headerRef);

      return () => ctx.revert();

    }, []);

    /* =========================================
       SAFE NAVIGATION
    ========================================= */

    const safeNavigate = (path) => {

      if (
        navigate &&
        typeof navigate === 'function'
      ) {

        navigate(path);

      } else {

        window.location.href = path;

      }

    };

    /* =========================================
       PREMIUM HOVER EFFECTS
    ========================================= */

    const hoverIn = (e) => {

      gsap.to(e.currentTarget, {
        y: -2,
        scale: 1.02,
        duration: 0.55,
        ease: 'power3.out'
      });

      gsap.fromTo(
        e.currentTarget.querySelector(
          '.gooey-shine'
        ),
        {
          x: '-120%',
          opacity: 0
        },
        {
          x: '320%',
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out'
        }
      );

    };

    const hoverOut = (e) => {

      gsap.to(e.currentTarget, {
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out'
      });

    };

    /* =========================================
       NAV ITEMS
    ========================================= */

    const navItems = [
      {
        name: 'Home',
        path: '/'
      },
      {
        name: 'Solutions',
        path: '/solutions'
      },
      {
        name: 'About Us',
        path: '/about'
      },
      {
        name: 'Resources',
        path: '/resources'
      },
      {
        name: 'Contact Us',
        path: '/contact'
      }
    ];

    return (

      <header
        ref={headerRef}
        style={{

          position: 'fixed',

          top: 0,
          left: 0,
          right: 0,

          zIndex: 1000,

          padding: '16px 0',

          background: isDarkMode
            ? `
              linear-gradient(
                135deg,
                rgba(10,10,15,0.82) 0%,
                rgba(15,15,20,0.78) 100%
              )
            `
            : `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.82) 0%,
                rgba(248,250,252,0.72) 100%
              )
            `,

          backdropFilter:
            'blur(30px) saturate(180%)',

          WebkitBackdropFilter:
            'blur(30px) saturate(180%)',

          borderBottom: isDarkMode
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(0,0,0,0.06)',

          boxShadow: isDarkMode
            ? `
              0 10px 50px rgba(0,0,0,0.45),
              inset 0 1px 0 rgba(255,255,255,0.05),
              inset 0 -1px 0 rgba(255,255,255,0.02)
            `
            : `
              0 10px 40px rgba(0,0,0,0.08),
              inset 0 1px 0 rgba(255,255,255,0.9)
            `,

          transition:
            'all 0.5s cubic-bezier(0.16,1,0.3,1)'

        }}
      >

        {/* =========================================
            CONTAINER
        ========================================= */}

        <div
          style={{

            maxWidth: '1400px',

            margin: '0 auto',

            padding: '0 40px',

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'space-between'

          }}
        >

          {/* =========================================
              LOGO
          ========================================= */}

          <div
            ref={logoRef}
            onClick={() => safeNavigate('/')}
            style={{

              display: 'flex',

              alignItems: 'center',

              justifyContent: 'flex-start',

              position: 'relative',

              cursor: 'pointer',

              willChange: 'transform'

            }}
          >

            {/* Glow */}

            <div
              style={{

                position: 'absolute',

                inset: 0,

                margin: 'auto',

                width: '100px',

                height: '100px',

                borderRadius: '50%',

                background: isDarkMode
                  ? `
                    radial-gradient(
                      circle,
                      rgba(255,140,66,0.18),
                      transparent 70%
                    )
                  `
                  : `
                    radial-gradient(
                      circle,
                      rgba(78,205,196,0.15),
                      transparent 70%
                    )
                  `,

                filter: 'blur(30px)',

                zIndex: -1

              }}
            />

            <img
              src="/assets/logo_white-removebg-preview.png"
              alt="Logo"
              style={{

                height: '110px',

                width: 'auto',

                objectFit: 'contain',

                display: 'block',

                transform: 'translateZ(0)',

                filter: isDarkMode
                  ? `
                    drop-shadow(
                      0 10px 30px rgba(255,140,66,0.18)
                    )
                  `
                  : `
                    drop-shadow(
                      0 10px 25px rgba(78,205,196,0.15)
                    )
                  `,

                transition:
                  'all 0.5s cubic-bezier(0.16,1,0.3,1)'

              }}
            />

          </div>

          {/* =========================================
              NAVIGATION
          ========================================= */}

          <nav
            ref={navRef}
            className="gooey-nav"
          >

            {navItems.map((item, index) => (

              <button
                key={index}
                className="gooey-nav-item"
                onClick={() =>
                  safeNavigate(item.path)
                }

                onMouseEnter={(e) => {
                  hoverIn(e);
                }}

                onMouseMove={(e) => {

                  const item =
                    e.currentTarget;

                  const rect =
                    item.getBoundingClientRect();

                  const x =
                    e.clientX -
                    rect.left -
                    rect.width / 2;

                  const y =
                    e.clientY -
                    rect.top -
                    rect.height / 2;

                  gsap.to(item, {
                    x: x * 0.12,
                    y: y * 0.12,
                    duration: 0.6,
                    ease: 'power3.out'
                  });

                }}

                onMouseLeave={(e) => {

                  hoverOut(e);

                  gsap.to(
                    e.currentTarget,
                    {
                      x: 0,
                      y: 0,
                      duration: 0.8,
                      ease:
                        'elastic.out(1,0.4)'
                    }
                  );

                }}
              >

                {/* Ambient Glow */}

                <div className="gooey-ambient" />

                {/* Shine Sweep */}

                <div className="gooey-shine" />

                {/* Text */}

                <span className="gooey-text">
                  {item.name}
                </span>

              </button>

            ))}

            {/* =========================================
                THEME BUTTON
            ========================================= */}

            <button
              onClick={() =>
                setIsDarkMode(!isDarkMode)
              }
              style={{

                position: 'relative',

                overflow: 'hidden',

                border: 'none',

                outline: 'none',

                cursor: 'pointer',

                padding: '14px 22px',

                borderRadius: '999px',

                background:
                  'linear-gradient(135deg,#FF8C42,#FF6B6B)',

                color: '#fff',

                fontSize: '1.1rem',

                fontWeight: 600,

                backdropFilter: 'blur(20px)',

                boxShadow: `
                  0 12px 35px rgba(255,140,66,0.25),
                  inset 0 1px 0 rgba(255,255,255,0.2)
                `,

                transition:
                  'all 0.5s cubic-bezier(0.16,1,0.3,1)'

              }}

              onMouseEnter={(e) => {

                gsap.to(
                  e.currentTarget,
                  {
                    scale: 1.04,
                    y: -2,
                    duration: 0.45,
                    ease: 'power3.out'
                  }
                );

              }}

              onMouseLeave={(e) => {

                gsap.to(
                  e.currentTarget,
                  {
                    scale: 1,
                    y: 0,
                    duration: 0.45,
                    ease: 'power3.out'
                  }
                );

              }}
            >

              <span
                style={{

                  display: 'inline-block',

                  transform: isDarkMode
                    ? 'rotate(0deg)'
                    : 'rotate(180deg)',

                  transition:
                    'transform 0.7s cubic-bezier(0.16,1,0.3,1)'

                }}
              >
                {isDarkMode
                  ? '🌙'
                  : '☀️'}
              </span>

            </button>

          </nav>

        </div>

      </header>

    );

  }
);

Header.displayName = 'Header';

export default Header;