import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import AppProfessional from './AppProfessional';
import Solutions from './pages/Solutions';
import AboutUs from './pages/AboutUs';
import Resources from './pages/Resources';
import ContactUs from './pages/ContactUs';

function AppWrapper() {

  const navigate = useNavigate();

  // THEME STATE

  const [isDarkMode, setIsDarkMode] = useState(() => {

    const savedTheme =
      localStorage.getItem('theme');

    return savedTheme === 'dark';

  });

  // APPLY THEME

  useEffect(() => {

    if (isDarkMode) {

      document.documentElement.classList.add('dark');

    } else {

      document.documentElement.classList.remove('dark');

    }

    localStorage.setItem(
      'theme',
      isDarkMode ? 'dark' : 'light'
    );

  }, [isDarkMode]);

  return (

    <Routes>

      <Route
        path="/"
        element={
          <AppProfessional
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            navigate={navigate}
          />
        }
      />

      <Route
        path="/solutions"
        element={
          <Solutions
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            navigate={navigate}
          />
        }
      />

      <Route
        path="/about"
        element={
          <AboutUs
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            navigate={navigate}
          />
        }
      />

      <Route
        path="/resources"
        element={
          <Resources
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            navigate={navigate}
          />
        }
      />

      <Route
        path="/contact"
        element={
          <ContactUs
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            navigate={navigate}
          />
        }
      />

    </Routes>

  );
}

function App() {

  return (

    <>

      {/* GLOBAL PREMIUM ANIMATIONS */}

      <style>

        {`

          html {
            /* scroll-behavior: smooth; */ /* Removed - conflicts with Lenis */
          }

          body {
            overflow-x: hidden;
          }

          /* PREMIUM GLOW */

          @keyframes pulseGlow {

            0% {
              transform: scale(1);
              opacity: 0.7;
            }

            50% {
              transform: scale(1.08);
              opacity: 1;
            }

            100% {
              transform: scale(1);
              opacity: 0.7;
            }
          }

          /* SHINE SWEEP */

          @keyframes shineMove {

            0% {
              transform:
                translateX(-120%)
                rotate(25deg);
            }

            100% {
              transform:
                translateX(120%)
                rotate(25deg);
            }
          }

          /* FLOATING */

          @keyframes floatingOrb {

            0% {
              transform:
                translateY(0px)
                rotate(0deg);
            }

            50% {
              transform:
                translateY(-18px)
                rotate(4deg);
            }

            100% {
              transform:
                translateY(0px)
                rotate(0deg);
            }
          }

          /* SLOW ROTATION */

          @keyframes slowRotate {

            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          /* CARD HOVER GLOW */

          @keyframes cardGlow {

            0% {
              box-shadow:
                0 0 20px rgba(255,140,66,0.08);
            }

            50% {
              box-shadow:
                0 0 60px rgba(255,140,66,0.22);
            }

            100% {
              box-shadow:
                0 0 20px rgba(255,140,66,0.08);
            }
          }

          /* TEXT SHIMMER */

          @keyframes shimmerText {

            0% {
              background-position:
                -200% center;
            }

            100% {
              background-position:
                200% center;
            }
          }

          /* PREMIUM BORDER FLOW */

          @keyframes borderFlow {

            0% {
              background-position:
                0% 50%;
            }

            50% {
              background-position:
                100% 50%;
            }

            100% {
              background-position:
                0% 50%;
            }
          }

          /* FLOAT LIGHT */

          @keyframes float-light {

            0% {
              transform:
                translateY(0px)
                translateX(0px);
            }

            50% {
              transform:
                translateY(-15px)
                translateX(10px);
            }

            100% {
              transform:
                translateY(0px)
                translateX(0px);
            }
          }

          /* ROTATE */

          @keyframes rotate {

            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          /* PREMIUM SCROLLBAR */

          ::-webkit-scrollbar {
            width: 10px;
          }

          ::-webkit-scrollbar-track {
            background: #0f172a;
          }

          ::-webkit-scrollbar-thumb {
            background:
              linear-gradient(
                180deg,
                #FF8C42,
                #FF6B6B,
                #4ECDC4
              );

            border-radius: 999px;
          }

          ::selection {
            background:
              rgba(255,140,66,0.3);
          }

          @keyframes spinRing {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}



@keyframes particleFloat {

  0% {
    transform: translateY(0px);
    opacity: 0.2;
  }

  50% {
    transform: translateY(-20px);
    opacity: 0.8;
  }

  100% {
    transform: translateY(0px);
    opacity: 0.2;
  }
}

@keyframes shimmerMove {

  0% {
    transform:
      translateX(-220%)
      skewX(-20deg);
  }

  100% {
    transform:
      translateX(260%)
      skewX(-20deg);
  }
}
  @keyframes counterPulse {

  0% {
    transform: scale(0.9);
    opacity: 0.4;
  }

  50% {
    transform: scale(1.15);
    opacity: 0.9;
  }

  100% {
    transform: scale(0.9);
    opacity: 0.4;
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

/* =========================
   PREMIUM STACK SECTION
========================= */

.premium-stack-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  perspective: 1800px;
}

.premium-stack-container {
  width: 340px;
  height: 230px;
  position: relative;
}

/* =========================
   CARD BASE
========================= */

.premium-card {
  width: 100%;
  height: 100%;
  border-radius: 32px;
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 28px;
  text-align: center;
  color: white;

  backdrop-filter: blur(20px);

  border: 1px solid rgba(255,255,255,0.15);

  transform-style: preserve-3d;

  transition:
    transform 0.5s ease,
    box-shadow 0.5s ease,
    filter 0.5s ease;
}

/* Hover feel */

.premium-card:hover {
  transform:
    translateY(-8px)
    scale(1.03)
    rotateX(4deg)
    rotateY(-4deg);

  filter: brightness(1.08);
}

/* =========================
   CARD COLORS
========================= */

.orange-card {
  background:
    linear-gradient(
      135deg,
      #ff8c42 0%,
      #ff6b6b 50%,
      #ffb347 100%
    );

  box-shadow:
    0 35px 80px rgba(255,107,107,0.35),
    inset 0 1px 1px rgba(255,255,255,0.25);
}

.cyan-card {
  background:
    linear-gradient(
      135deg,
      #4ecdc4 0%,
      #06b6d4 50%,
      #44a08d 100%
    );

  box-shadow:
    0 35px 80px rgba(78,205,196,0.35),
    inset 0 1px 1px rgba(255,255,255,0.25);
}

.red-card {
  background:
    linear-gradient(
      135deg,
      #ff6b6b 0%,
      #ff1744 50%,
      #ff8c42 100%
    );

  box-shadow:
    0 35px 80px rgba(255,107,107,0.35),
    inset 0 1px 1px rgba(255,255,255,0.25);
}

.gold-card {
  background:
    linear-gradient(
      135deg,
      #ffa500 0%,
      #ff8c42 50%,
      #ffcc33 100%
    );

  box-shadow:
    0 35px 80px rgba(255,165,0,0.35),
    inset 0 1px 1px rgba(255,255,255,0.25);
}

/* =========================
   ICON
========================= */

.icon-wrapper {
  width: 88px;
  height: 88px;

  border-radius: 28px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(255,255,255,0.12);

  border: 1px solid rgba(255,255,255,0.18);

  backdrop-filter: blur(12px);

  margin-bottom: 18px;

  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.25),
    0 10px 30px rgba(0,0,0,0.18);

  animation: iconFloat 4s ease-in-out infinite;

  z-index: 3;
}

.premium-icon {
  font-size: 2.9rem;

  filter:
    drop-shadow(0 4px 8px rgba(0,0,0,0.25));
}

/* =========================
   TEXT
========================= */

.premium-card-title {
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.45;
  letter-spacing: 0.4px;

  text-shadow:
    0 2px 10px rgba(0,0,0,0.25);

  z-index: 3;
}

/* =========================
   GLOW EFFECTS
========================= */

.card-glow {
  position: absolute;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(255,255,255,0.22),
      transparent 70%
    );

  filter: blur(55px);

  top: -25%;
  right: -25%;

  animation: pulseGlow 6s ease-in-out infinite;
}

.card-shine {
  position: absolute;

  top: -150%;
  left: -40%;

  width: 60%;
  height: 400%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.2),
      transparent
    );

  transform: rotate(25deg);

  animation: glassShine 6s linear infinite;
}

.card-noise {
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
    radial-gradient(circle at 80% 80%, white 1px, transparent 1px);

  background-size: 20px 20px;
}

/* =========================
   FLOATING ORBS
========================= */

.floating-orb {
  position: absolute;
  border-radius: 50%;

  background: rgba(255,255,255,0.15);

  filter: blur(2px);
}

.orb-1 {
  width: 16px;
  height: 16px;

  top: 18%;
  left: 15%;

  animation: orbFloat 5s ease-in-out infinite;
}

.orb-2 {
  width: 10px;
  height: 10px;

  bottom: 20%;
  right: 18%;

  animation: orbFloat 7s ease-in-out infinite reverse;
}

/* =========================
   ANIMATIONS
========================= */

@keyframes iconFloat {
  0%,100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulseGlow {
  0%,100% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.15);
    opacity: 0.9;
  }
}

@keyframes glassShine {
  0% {
    transform:
      translateX(-250%)
      rotate(25deg);
  }

  100% {
    transform:
      translateX(350%)
      rotate(25deg);
  }
}

@keyframes orbFloat {
  0%,100% {
    transform:
      translateY(0px)
      translateX(0px);
  }

  50% {
    transform:
      translateY(-14px)
      translateX(8px);
  }
}

        `}

      </style>

      <Router>

        <AppWrapper />

      </Router>

    </>

  );
}

export default App;