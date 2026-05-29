import React, { useRef, useEffect, useCallback } from 'react';

const ParticleBurst = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // Particle class
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 4; // -2 to 2
      this.vy = -Math.random() * 2 - 1; // -3 to -1 (upward)
      this.alpha = 1;
      this.radius = Math.random() * 2 + 1; // 1-3px
      this.life = 0;
      this.maxLife = Math.floor(Math.random() * 100 + 150); // 100-250 frames
    }

    update() {
      // Update position
      this.x += this.vx;
      this.y += this.vy;
      
      // Decrease alpha
      this.alpha *= 0.99;
      
      // Decrease life
      this.life++;
      
      // Reset particle if life ends or goes off screen
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      if (this.life > this.maxLife || 
          this.x < 0 || this.x > canvas.width || 
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    reset() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Reset to bottom-center
      this.x = canvas.width / 2;
      this.y = canvas.height;
      this.vx = (Math.random() - 0.5) * 4; // -2 to 2
      this.vy = -Math.random() * 2 - 1; // -3 to -1 (upward)
      this.alpha = 1;
      this.radius = Math.random() * 2 + 1; // 1-3px
      this.life = 0;
      this.maxLife = Math.floor(Math.random() * 100 + 150); // 100-250 frames
    }

    draw(ctx) {
      // Draw glowing dot with shadow
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255,255,255,0.8)';
      
      // Draw particle
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw trailing line
      const trailX = this.x - this.vx * 10;
      const trailY = this.y - this.vy * 10;
      
      ctx.globalAlpha = this.alpha * 0.5;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(trailX, trailY);
      ctx.stroke();
    }
  }

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height;
    
    const particles = [];
    for (let i = 0; i < 350; i++) {
      const particle = new Particle(centerX, centerY);
      particles.push(particle);
    }
    
    particlesRef.current = particles;
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = window.innerWidth;
      canvas.height = parent.offsetHeight;
      
      // Reinitialize particles on resize
      initializeParticles();
    };
    
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles
    initializeParticles();
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default ParticleBurst;
