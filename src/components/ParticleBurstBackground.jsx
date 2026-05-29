import { useEffect, useRef } from "react";

export default function ParticleBurstBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 1000; // Increased for bigger effect
    const center = () => ({
      x: canvas.width / 2,
      y: canvas.height
    });

    // create particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map(() => {
      const angle = Math.random() * Math.PI;
      const speed = Math.random() * 0.8 + 0.3; // Slower speed

      return {
        x: center().x,
        y: center().y,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        alpha: Math.random() * 0.5 + 0.5, // Higher initial alpha
        size: Math.random() * 3 + 1, // Bigger particles
        baseSize: Math.random() * 3 + 1,
        originalVx: Math.cos(angle) * speed,
        originalVy: -Math.sin(angle) * speed
      };
    });

    // mouse tracking
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      // Clear canvas with no background (transparent)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const c = center();
      const time = Date.now() * 0.001;

      particlesRef.current.forEach((p) => {
        // Enhanced tactical mouse interaction
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (isHovering.current && distance < 200) {
          // Stronger attraction when hovering
          const force = (200 - distance) / 200 * 0.02;
          p.vx += dx * force;
          p.vy += dy * force;
          
          // Tactical size increase on hover
          p.size = p.baseSize * (1 + Math.sin(time * 10) * 0.3);
        } else {
          // Gentle attraction when not hovering
          p.vx += dx * 0.00005;
          p.vy += dy * 0.00005;
          p.size = p.baseSize;
        }

        // Add tactical movement
        const tacticalX = Math.sin(time + p.originalVx) * 0.2;
        const tacticalY = Math.cos(time + p.originalVy) * 0.2;

        p.x += p.vx + tacticalX;
        p.y += p.vy + tacticalY;

        // Slower fade for longer life
        p.alpha *= 0.998;

        // reset particle
        if (p.alpha < 0.05) {
          const angle = Math.random() * Math.PI;
          const speed = Math.random() * 0.8 + 0.3;

          p.x = c.x;
          p.y = c.y;
          p.vx = Math.cos(angle) * speed;
          p.vy = -Math.sin(angle) * speed;
          p.alpha = Math.random() * 0.5 + 0.5;
          p.baseSize = Math.random() * 3 + 1;
          p.size = p.baseSize;
          p.originalVx = p.vx;
          p.originalVy = p.vy;
        }

        // Enhanced line with tactical glow
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(255,140,66,${p.alpha * 0.3})`;
        ctx.lineWidth = isHovering.current ? 1 : 0.5;
        ctx.stroke();

        // Enhanced glow dot with tactical effects
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,140,66,${p.alpha})`;

        // Enhanced shadow on hover
        ctx.shadowBlur = isHovering.current ? 25 : 15;
        ctx.shadowColor = isHovering.current ? "rgba(255,140,66,0.8)" : "#FF8C42";

        ctx.fill();

        // Add extra glow on hover
        if (isHovering.current) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,140,66,${p.alpha * 0.1})`;
          ctx.fill();
        }

        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "auto" // Enable pointer events for hover
      }}
    />
  );
}
