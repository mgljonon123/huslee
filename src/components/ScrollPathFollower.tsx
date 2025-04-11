'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollPathFollower = () => {
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!circlesRef.current.length) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set initial positions
    circlesRef.current.forEach((circle, index) => {
      if (!circle) return;
      gsap.set(circle, {
        xPercent: -50,
        yPercent: -50,
        opacity: 1,
        x: width * 0.9, // Start at the right side
        y: height * 0.8, // Near bottom
        background: 'white', // Circles are white
      });
    });

    // Create scroll animation for all circles
    circlesRef.current.forEach((circle, index) => {
      if (!circle) return;

      let scrollProgress = 0;
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          scrollProgress = self.progress;

          // Multiple overlapping circular motions, moving in one direction
          const angle1 = scrollProgress * Math.PI * 4; // Two full rotations
          const angle2 = scrollProgress * Math.PI * 6; // Three full rotations
          const angle3 = scrollProgress * Math.PI * 2; // One full rotation
          
          const radius1 = scrollProgress * Math.min(width, height) * 0.3;
          const radius2 = scrollProgress * Math.min(width, height) * 0.2;
          const radius3 = scrollProgress * Math.min(width, height) * 0.1;
          
          // Position based on movement from right to left
          const x = width * 0.9 + 
            Math.cos(angle1 + (index * Math.PI * 2 / 3)) * radius1 +
            Math.sin(angle2) * radius2 +
            Math.cos(angle3) * radius3;

          const y = height * 0.8 + 
            Math.sin(angle1 + (index * Math.PI * 2 / 3)) * radius1 +
            Math.cos(angle2) * radius2 +
            Math.sin(angle3) * radius3;

          // Dynamic glow effect
          const glowIntensity = 10 + Math.sin(scrollProgress * Math.PI * 8) * 8;

          gsap.set(circle, {
            x: x,
            y: y,
            background: 'white', // Circles are white
            boxShadow: `0 0 ${glowIntensity}px currentColor`,
            filter: `blur(${4 + Math.sin(scrollProgress * Math.PI * 4) * 2}px)`
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[100]">
      {[0, 1, 2].map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            circlesRef.current[index] = el;
          }}
          className="absolute w-16 h-16 rounded-full"
          style={{
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
            transition: 'all 0.05s ease-out'
          }}
        />
      ))}
    </div>
  );
};

export default ScrollPathFollower;
