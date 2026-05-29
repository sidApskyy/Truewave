import React, { useRef, useEffect } from "react";

export default function StripeLikeBackground({ isDarkMode }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: 0, y: 0, active: false });

  const COUNT = 150;
  const RADIUS = 280;

  class Particle {
    constructor(cx, cy) {
      const angle = Math.random() * Math.PI;
      const dist = Math.random() * RADIUS;

      this.cx = cx;
      this.cy = cy;

      this.ox = cx + Math.cos(angle) * dist;
      this.oy = cy - Math.sin(angle) * dist;

      this.x = this.ox;
      this.y = this.oy;

      this.vx = 0;
      this.vy = 0;

      this.size = Math.random() * 3.5 + 2;
    }

    update(mx, my, time) {
      // ===== SUBTLE IDLE MOTION (alive feel) =====
      const noiseX = Math.sin(time * 0.001 + this.ox * 0.02) * 0.4;
      const noiseY = Math.cos(time * 0.001 + this.oy * 0.02) * 0.4;

      this.vx += noiseX * 0.02;
      this.vy += noiseY * 0.02;

      // ===== HOVER INTERACTION =====
      if (mouse.current.active) {
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130 && dist > 0) {
          const force = (130 - dist) / 130;

          this.vx += (dx / dist) * force * 0.9;
          this.vy += (dy / dist) * force * 0.9;
        }
      }

      // ===== SPRING BACK =====
      this.vx += (this.ox - this.x) * 0.035;
      this.vy += (this.oy - this.y) * 0.035;

      // ===== SMOOTH DAMPING =====
      this.vx *= 0.88;
      this.vy *= 0.88;

      this.x += this.vx;
      this.y += this.vy;
    }

    draw(ctx, cx, cy, color) {
      // line with gradient
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(this.x, this.y);
      
      const gradient = ctx.createLinearGradient(cx, cy, this.x, this.y);
      gradient.addColorStop(0, color.line);
      gradient.addColorStop(1, color.dot);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // glowing dot with shadow
      ctx.shadowBlur = 12;
      ctx.shadowColor = color.dot;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color.dot;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      init();
    };

    const init = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height;

      particles.current = [];
      for (let i = 0; i < COUNT; i++) {
        particles.current.push(new Particle(cx, cy));
      }
    };

    const render = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const color = isDarkMode
        ? {
            dot: "rgba(255,107,107,1)",
            line: "rgba(255,107,107,0.4)",
          }
        : {
            dot: "rgba(255,140,66,1)",
            line: "rgba(255,140,66,0.3)",
          };

      const time = performance.now();

      particles.current.forEach((p) => {
        p.update(mouse.current.x, mouse.current.y, time);
        p.draw(ctx, cx, cy, color);
      });

      requestAnimationFrame(render);
    };

    // Initialize on mount and theme change
    resize();
    window.addEventListener("resize", resize);

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleLeave = () => {
      mouse.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);

    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 0,
      }}
    />
  );
}