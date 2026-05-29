import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './SpotlightImage.css';

const SpotlightImage = ({
  imageSrc,
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  className = ''
}) => {
  const containerRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = e => {
    const r = containerRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    });
  };

  return (
    <div
      ref={containerRef}
      className={`spotlight-image ${className}`}
      style={{
        '--r': `${radius}px`
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <img 
        src={imageSrc} 
        alt="Marketing Funnel" 
        className="spotlight-img"
      />
      <div className="spotlight-overlay" />
      <div ref={fadeRef} className="spotlight-fade" />
    </div>
  );
};

export default SpotlightImage;
