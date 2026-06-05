import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollStack.css';

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------
   Card Component
--------------------------------------- */

export const ScrollStackItem = ({
  children,
  className = ''
}) => {
  return (
    <div className={`scroll-stack-card ${className}`}>
      {children}
    </div>
  );
};

/* ---------------------------------------
   Scroll Stack Component
--------------------------------------- */

const ScrollStack = ({
  children,
  className = '',
  stickyOffset = 10,
  scaleStep = 0.02,
  opacityStep = 0.05,
  blurStep = 0.5,
  onStackComplete
}) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(
        container.querySelectorAll('.scroll-stack-card')
      );

      if (!cards.length) return;

      /* ------------------------------
         Initial State
      ------------------------------ */

      cards.forEach((card, index) => {
        gsap.set(card, {
          zIndex: index + 1,
          scale: 1,
          opacity: 1,
          y: 0,
          force3D: true,
          transformOrigin: 'top center'
        });
      });

      /* ------------------------------
         Create Trigger Per Card
      ------------------------------ */

      cards.forEach((card, index) => {
        if (index === 0) return;

        const previousCards = cards.slice(0, index);

        ScrollTrigger.create({
          trigger: card,

          start: `top ${stickyOffset + 5}%`,
          end: `top ${stickyOffset}%`,

          scrub: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const progress = self.progress;

            previousCards.forEach((prevCard, depth) => {
              const layer = depth + 1;

              gsap.to(prevCard, {
                scale:
                  1 -
                  scaleStep *
                    layer *
                    progress *
                    2,

                opacity:
                  1 -
                  opacityStep *
                    layer *
                    progress,

                y:
                  -20 *
                  layer *
                  progress,

                z:
                  -120 *
                  layer *
                  progress,

                filter: `blur(${
                  blurStep *
                  layer *
                  progress
                }px)`,

                duration: 0.1,

                overwrite: true,

                ease: 'none'
              });
            });

            gsap.to(card, {
              scale: 1,
              opacity: 1,
              y: 0,
              z: 0,
              filter: 'blur(0px)',

              duration: 0.1,

              overwrite: true,

              ease: 'none'
            });

            if (
              index === cards.length - 1 &&
              progress > 0.95
            ) {
              onStackComplete?.();
            }
          }
        });
      });

      ScrollTrigger.refresh();
    }, container);

    return () => {
      ctx.revert();
    };
  }, [
    stickyOffset,
    scaleStep,
    opacityStep,
    blurStep,
    onStackComplete
  ]);

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-container ${className}`}
    >
      <div className="scroll-stack-inner">
        {children}
      </div>
    </div>
  );
};

export default ScrollStack;