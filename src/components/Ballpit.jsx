import React, { useEffect, useRef, useState } from 'react';

const keywords = [
  { text: 'Lead Generation', tier: 'premium' },
  { text: 'AI Automation', tier: 'premium' },
  { text: 'CRM', tier: 'standard' },
  { text: 'Sales Intelligence', tier: 'premium' },
  { text: 'Revenue Growth', tier: 'premium' },
  { text: 'LinkedIn Outreach', tier: 'standard' },
  { text: 'Data Enrichment', tier: 'standard' },
  { text: 'Pipeline', tier: 'standard' },
  { text: 'Prospecting', tier: 'standard' },
  { text: 'B2B Marketing', tier: 'premium' },
  { text: 'Merchant Services', tier: 'standard' },
  { text: 'Fintech', tier: 'standard' },
  { text: 'Analytics', tier: 'standard' },
  { text: 'Conversion', tier: 'premium' },
  { text: 'SaaS', tier: 'premium' },
  { text: 'Email Automation', tier: 'standard' },
  { text: 'Growth Engine', tier: 'premium' },
  { text: 'Customer Insights', tier: 'standard' },
  { text: 'Enterprise AI', tier: 'premium' },
  { text: 'Smart Outreach', tier: 'standard' },
  { text: 'B2B Scaling', tier: 'premium' },
  { text: 'Automation Suite', tier: 'standard' },
  { text: 'Digital Payments', tier: 'standard' },
  { text: 'Predictive Analytics', tier: 'premium' }
];

const Ballpit = ({ className = '' }) => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const [positions, setPositions] = useState([]);

  // Generate non-overlapping positions with tier-based sizing
  useEffect(() => {
    const newPositions = [];
    const gridSize = 5;
    const cellWidth = 100 / gridSize;
    const cellHeight = 100 / gridSize;
    const occupiedCells = new Set();

    keywords.forEach((keyword, index) => {
      let position;
      let attempts = 0;
      const maxAttempts = 50;

      const isPremium = keyword.tier === 'premium';
      const baseScale = isPremium ? 1.1 : 0.9;
      const fontSize = isPremium ? 15 : 13;

      do {
        const cellX = Math.floor(Math.random() * gridSize);
        const cellY = Math.floor(Math.random() * gridSize);
        const cellKey = `${cellX}-${cellY}`;

        if (!occupiedCells.has(cellKey)) {
          occupiedCells.add(cellKey);
          position = {
            left: cellX * cellWidth + Math.random() * (cellWidth - 12),
            top: cellY * cellHeight + Math.random() * (cellHeight - 8),
            animationType: index % 5,
            animationDuration: 12 + Math.random() * 10,
            animationDelay: Math.random() * 4,
            scale: baseScale + Math.random() * 0.2,
            rotation: (Math.random() - 0.5) * 6,
            fontSize,
            isPremium,
            colorIndex: index % 3
          };
        }
        attempts++;
      } while (!position && attempts < maxAttempts);

      if (!position) {
        position = {
          left: Math.random() * 85 + 7.5,
          top: Math.random() * 85 + 7.5,
          animationType: index % 5,
          animationDuration: 12 + Math.random() * 10,
          animationDelay: Math.random() * 4,
          scale: baseScale + Math.random() * 0.2,
          rotation: (Math.random() - 0.5) * 6,
          fontSize,
          isPremium,
          colorIndex: index % 3
        };
      }

      newPositions.push(position);
    });

    setPositions(newPositions);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      const items = container.querySelectorAll('.floating-keyword');
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemX = itemRect.left - rect.left + itemRect.width / 2;
        const itemY = itemRect.top - rect.top + itemRect.height / 2;

        const dx = mouseX - itemX;
        const dy = mouseY - itemY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 220) {
          const force = (220 - distance) / 220;
          const moveX = -(dx / distance) * force * 35;
          const moveY = -(dy / distance) * force * 35;
          const rotate = (Math.random() - 0.5) * force * 15;

          item.style.transform = `
            translate(${moveX}px, ${moveY}px)
            scale(${1.15 + force * 0.2})
            rotate(${rotate}deg)
          `;
          item.style.zIndex = 100;
          item.style.filter = `brightness(${1 + force * 0.3})`;
        } else {
          const pos = positions[index];
          if (pos) {
            item.style.transform = `
              translate(0px, 0px)
              scale(${pos.scale})
              rotate(${pos.rotation}deg)
            `;
            item.style.zIndex = 1;
            item.style.filter = 'brightness(1)';
          }
        }
      });

      // Update spotlight
      const spotlight = container.querySelector('.spotlight');
      if (spotlight) {
        spotlight.style.left = `${mouseX}px`;
        spotlight.style.top = `${mouseY}px`;
      }
    };

    const handleMouseLeave = () => {
      const items = container.querySelectorAll('.floating-keyword');
      items.forEach((item, index) => {
        const pos = positions[index];
        if (pos) {
          item.style.transform = `
            translate(0px, 0px)
            scale(${pos.scale})
            rotate(${pos.rotation}deg)
          `;
          item.style.zIndex = 1;
          item.style.filter = 'brightness(1)';
        }
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [positions]);

  // Canvas-based connection lines effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || positions.length === 0) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const items = container.querySelectorAll('.floating-keyword');
      const keywordPositions = Array.from(items).map(item => {
        const rect = item.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        };
      });

      // Draw connections between nearby keywords
      keywordPositions.forEach((pos1, i) => {
        keywordPositions.forEach((pos2, j) => {
          if (i >= j) return;

          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);
            ctx.strokeStyle = `rgba(167, 110, 238, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      // Draw connections to mouse
      keywordPositions.forEach(pos => {
        const dx = mouseRef.current.x - pos.x;
        const dy = mouseRef.current.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          const opacity = (1 - distance / 200) * 0.3;
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      requestAnimationFrame(drawConnections);
    };

    drawConnections();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [positions]);

  const getAnimationKeyframes = (type) => {
    const animations = {
      0: `
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        25% { transform: translateY(-18px) translateX(12px) rotate(2deg); }
        50% { transform: translateY(10px) translateX(-15px) rotate(-2deg); }
        75% { transform: translateY(-12px) translateX(8px) rotate(1deg); }
      `,
      1: `
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        33% { transform: translateY(-15px) translateX(-10px) rotate(-3deg); }
        66% { transform: translateY(12px) translateX(15px) rotate(3deg); }
      `,
      2: `
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        20% { transform: translateY(-22px) translateX(8px) rotate(2deg); }
        40% { transform: translateY(6px) translateX(-12px) rotate(-2deg); }
        60% { transform: translateY(-14px) translateX(10px) rotate(1deg); }
        80% { transform: translateY(10px) translateX(-6px) rotate(-1deg); }
      `,
      3: `
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        50% { transform: translateY(-25px) translateX(18px) rotate(4deg); }
      `,
      4: `
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        25% { transform: translateY(-8px) translateX(20px) rotate(-2deg); }
        50% { transform: translateY(15px) translateX(-5px) rotate(3deg); }
        75% { transform: translateY(-5px) translateX(-15px) rotate(-1deg); }
      `
    };
    return animations[type] || animations[0];
  };

  const getColorScheme = (colorIndex) => {
    const schemes = [
      { primary: '#A76EEE', secondary: '#CB94F7', glow: 'rgba(167,110,238,0.6)' },
      { primary: '#14B8A6', secondary: '#2DD4BF', glow: 'rgba(20,184,166,0.6)' },
      { primary: '#F59E0B', secondary: '#FBBF24', glow: 'rgba(245,158,11,0.6)' }
    ];
    return schemes[colorIndex];
  };

  return (
    <>
      <style>
        {`
          .premium-ballpit {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: linear-gradient(135deg, #000000 0%, #050505 50%, #000000 100%);
            perspective: 1000px;
            animation: containerBreath 8s ease-in-out infinite;
          }

          .premium-ballpit::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 15% 25%, rgba(167,110,238,0.12) 0%, transparent 35%),
              radial-gradient(circle at 85% 75%, rgba(20,184,166,0.1) 0%, transparent 35%),
              radial-gradient(circle at 50% 50%, rgba(245,158,11,0.06) 0%, transparent 45%);
            pointer-events: none;
            animation: gradientShift 20s ease-in-out infinite;
          }

          .premium-ballpit::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
              linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
            background-size: 40px 40px;
            mask-image: radial-gradient(circle at center, black 25%, transparent 75%);
            pointer-events: none;
          }

          @keyframes containerBreath {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.005);
            }
          }

          @keyframes gradientShift {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          .spotlight {
            position: absolute;
            width: 400px;
            height: 400px;
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(255,255,255,0.08) 0%,
              transparent 70%
            );
            transform: translate(-50%, -50%);
            pointer-events: none;
            transition: left 0.1s ease, top 0.1s ease;
          }

          .ambient-glow {
            position: absolute;
            width: 700px;
            height: 700px;
            border-radius: 50%;
            background: radial-gradient(
              circle,
              rgba(167,110,238,0.15) 0%,
              rgba(20,184,166,0.08) 30%,
              transparent 70%
            );
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: ambientPulse 15s ease-in-out infinite;
            pointer-events: none;
          }

          .keywords-layer {
            position: absolute;
            inset: 0;
            z-index: 2;
            transform-style: preserve-3d;
          }

          .floating-keyword {
            position: absolute;
            font-weight: 700;
            letter-spacing: 0.4px;
            padding: 14px 24px;
            border-radius: 999px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow:
              0 10px 40px rgba(0,0,0,0.4),
              inset 0 2px 0 rgba(255,255,255,0.1),
              0 0 0 1px rgba(255,255,255,0.03),
              0 0 20px rgba(0,0,0,0.2);
            white-space: nowrap;
            will-change: transform, filter;
            transition:
              transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
              background 0.4s ease,
              border 0.4s ease,
              box-shadow 0.4s ease,
              filter 0.4s ease,
              z-index 0s;
            cursor: pointer;
            opacity: 0;
            animation: fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            transform-style: preserve-3d;
          }

          .floating-keyword.premium {
            background: linear-gradient(
              135deg,
              rgba(255,255,255,0.05) 0%,
              rgba(255,255,255,0.02) 100%
            );
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow:
              0 12px 50px rgba(0,0,0,0.5),
              inset 0 2px 0 rgba(255,255,255,0.15),
              0 0 0 1px rgba(255,255,255,0.05),
              0 0 30px rgba(0,0,0,0.3);
          }

          .floating-keyword::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 999px;
            background: linear-gradient(
              135deg,
              rgba(255,255,255,0.15) 0%,
              transparent 50%
            );
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
          }

          .floating-keyword::after {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 999px;
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(255,255,255,0.1) 50%,
              transparent 70%
            );
            background-size: 200% 200%;
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            animation: shimmer 3s linear infinite;
          }

          .floating-keyword:hover {
            background: rgba(255,255,255,0.1);
            transform: scale(1.15) translateY(-5px);
            z-index: 100;
          }

          .floating-keyword.premium:hover {
            animation: chromaticShift 0.3s ease;
          }

          .floating-keyword:hover::before {
            opacity: 1;
          }

          .floating-keyword:hover::after {
            opacity: 1;
          }

          @keyframes chromaticShift {
            0% {
              text-shadow: -2px 0 rgba(255,0,0,0.5), 2px 0 rgba(0,255,255,0.5);
            }
            100% {
              text-shadow: 0 0 transparent;
            }
          }

          .keyword-text {
            position: relative;
            z-index: 2;
            background: linear-gradient(
              135deg,
              rgba(255,255,255,0.95) 0%,
              rgba(255,255,255,0.85) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            transition: all 0.4s ease;
          }

          .floating-keyword:hover .keyword-text {
            background: linear-gradient(
              135deg,
              #ffffff 0%,
              rgba(255,255,255,0.9) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.5));
          }

          .floating-keyword.premium .keyword-text {
            background: linear-gradient(
              135deg,
              rgba(255,255,255,1) 0%,
              rgba(255,255,255,0.9) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.8) rotate(-5deg);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1) rotate(0deg);
            }
          }

          @keyframes ambientPulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.5;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.8;
            }
          }

          @keyframes shimmer {
            0% { background-position: 200% 200%; }
            100% { background-position: -200% -200%; }
          }

          .particle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 18s linear infinite;
          }

          .particle:nth-child(3n) {
            width: 2px;
            height: 2px;
            background: rgba(167,110,238,0.6);
            box-shadow: 0 0 10px rgba(167,110,238,0.4);
          }

          .particle:nth-child(3n+1) {
            width: 3px;
            height: 3px;
            background: rgba(20,184,166,0.6);
            box-shadow: 0 0 10px rgba(20,184,166,0.4);
          }

          .particle:nth-child(3n+2) {
            width: 1.5px;
            height: 1.5px;
            background: rgba(245,158,11,0.6);
            box-shadow: 0 0 8px rgba(245,158,11,0.4);
          }

          @keyframes particleFloat {
            0% {
              transform: translateY(100vh) translateX(0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translateY(80vh) translateX(20px) scale(1);
            }
            90% {
              opacity: 1;
              transform: translateY(-20vh) translateX(80px) scale(1);
            }
            100% {
              transform: translateY(-100vh) translateX(100px) scale(0);
              opacity: 0;
            }
          }

          .geometric-shape {
            position: absolute;
            pointer-events: none;
            opacity: 0.03;
            animation: geometricFloat 25s linear infinite;
          }

          @keyframes geometricFloat {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-50px) rotate(180deg);
            }
          }

          .central-core {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            pointer-events: none;
            z-index: 1;
          }

          .core-ring {
            position: absolute;
            inset: 0;
            border: 1px solid rgba(167, 110, 238, 0.2);
            border-radius: 50%;
            animation: corePulse 4s ease-in-out infinite;
          }

          .core-ring:nth-child(2) {
            inset: 10px;
            animation-delay: 0.5s;
            border-color: rgba(20, 184, 166, 0.2);
          }

          .core-ring:nth-child(3) {
            inset: 20px;
            animation-delay: 1s;
            border-color: rgba(245, 158, 11, 0.2);
          }

          .core-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: radial-gradient(
              circle,
              rgba(167, 110, 238, 0.3) 0%,
              rgba(20, 184, 166, 0.1) 50%,
              transparent 100%
            );
            border-radius: 50%;
            animation: coreGlow 3s ease-in-out infinite;
          }

          @keyframes corePulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }

          @keyframes coreGlow {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.6;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.3);
              opacity: 1;
            }
          }

          .connection-canvas {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
          }

          .noise-texture {
            position: absolute;
            inset: 0;
            opacity: 0.02;
            pointer-events: none;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            z-index: 10;
          }

          .vignette {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: radial-gradient(
              circle at center,
              transparent 0%,
              transparent 50%,
              rgba(0,0,0,0.4) 100%
            );
            z-index: 11;
          }

          .glow-orb {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            animation: orbFloat 20s ease-in-out infinite;
          }

          @keyframes orbFloat {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(30px, -20px) scale(1.1);
            }
            50% {
              transform: translate(-20px, 30px) scale(0.9);
            }
            75% {
              transform: translate(-30px, -10px) scale(1.05);
            }
          }
        `}
      </style>

      <div
        ref={containerRef}
        className={`premium-ballpit ${className}`}
      >
        <canvas ref={canvasRef} className="connection-canvas" />
        <div className="ambient-glow" />
        <div className="spotlight" />

        {/* Central Core */}
        <div className="central-core">
          <div className="core-ring" />
          <div className="core-ring" />
          <div className="core-ring" />
          <div className="core-center" />
        </div>

        {/* Floating Glow Orbs */}
        <div
          className="glow-orb"
          style={{
            width: '200px',
            height: '200px',
            left: '10%',
            top: '20%',
            background: 'radial-gradient(circle, rgba(167,110,238,0.2) 0%, transparent 70%)',
            animationDelay: '0s'
          }}
        />
        <div
          className="glow-orb"
          style={{
            width: '150px',
            height: '150px',
            right: '15%',
            bottom: '25%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)',
            animationDelay: '5s'
          }}
        />
        <div
          className="glow-orb"
          style={{
            width: '180px',
            height: '180px',
            left: '60%',
            top: '60%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
            animationDelay: '10s'
          }}
        />

        {/* Noise Texture */}
        <div className="noise-texture" />

        {/* Vignette */}
        <div className="vignette" />

        {/* Geometric shapes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="geometric-shape"
            style={{
              left: `${10 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              width: `${100 + i * 30}px`,
              height: `${100 + i * 30}px`,
              border: `2px solid rgba(255,255,255,${0.1 + i * 0.02})`,
              borderRadius: i % 2 === 0 ? '50%' : '10px',
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 3}s`
            }}
          />
        ))}

        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 18}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}

        <div className="keywords-layer">
          {keywords.map((keyword, index) => {
            const pos = positions[index];
            if (!pos) return null;

            const colors = getColorScheme(pos.colorIndex);

            return (
              <div
                key={index}
                className={`floating-keyword ${pos.isPremium ? 'premium' : ''}`}
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  fontSize: `${pos.fontSize}px`,
                  animation: `
                    fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards ${pos.animationDelay}s,
                    float${pos.animationType} ${pos.animationDuration}s ease-in-out infinite ${pos.animationDelay + 0.8}s
                  `,
                  transform: `scale(${pos.scale}) rotate(${pos.rotation}deg)`,
                  borderColor: pos.isPremium ? colors.primary : 'rgba(255,255,255,0.1)',
                  boxShadow: pos.isPremium
                    ? `0 12px 50px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.15), 0 0 0 1px ${colors.glow}, 0 0 30px ${colors.glow}`
                    : undefined
                }}
              >
                <span className="keyword-text">{keyword.text}</span>
              </div>
            );
          })}
        </div>

        <style>
          {keywords.map((_, index) => `
            @keyframes float${index % 5} {
              ${getAnimationKeyframes(index % 5)}
            }
          `).join('')}
        </style>
      </div>
    </>
  );
};

export default Ballpit;