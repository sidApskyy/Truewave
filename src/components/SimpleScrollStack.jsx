import React, { useLayoutEffect, useRef } from 'react';
import './ScrollStack.css';

export const SimpleScrollStackItem = ({ children, className = '' }) => (
  <div className={`scroll-stack-card ${className}`.trim()}>{children}</div>
);

const SimpleScrollStack = ({ children, className = '' }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.scroll-stack-card');
    cardsRef.current = Array.from(cards);
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const containerHeight = window.innerHeight;
      
      cardsRef.current.forEach((card) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const cardTop = rect.top + scrollTop;
        
        // Calculate progress based on card position
        const triggerPoint = cardTop - containerHeight * 0.8;
        const endPoint = cardTop - containerHeight * 0.2;
        
        let progress = 0;
        if (scrollTop >= triggerPoint && scrollTop <= endPoint) {
          progress = (scrollTop - triggerPoint) / (endPoint - triggerPoint);
        } else if (scrollTop > endPoint) {
          progress = 1;
        }
        
        // Apply transforms with GPU acceleration
        const scale = 1 - progress * 0.15;
        const translateY = progress * 50;
        
        card.style.transform = `translateY(${translateY}px) scale(${scale})`;
        card.style.opacity = 1 - progress * 0.1;
        card.style.willChange = 'transform, opacity';
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className={`scroll-stack-scroller ${className}`.trim()}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default SimpleScrollStack;
