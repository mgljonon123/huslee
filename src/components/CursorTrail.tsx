'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CursorTrail = () => {
  const trailRef = useRef<(HTMLDivElement | null)[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const trailPositions = useRef<{ x: number; y: number }[]>([]);
  const trailCount = 15;
  const currentColor = useRef('white');

  useEffect(() => {
    // Initialize trail elements
    trailRef.current = Array(trailCount).fill(null);
    trailPositions.current = Array(trailCount).fill({ x: 0, y: 0 });

    // Create trail elements
    const container = document.createElement('div');
    container.className = 'fixed top-0 left-0 w-full h-full pointer-events-none z-50';
    document.body.appendChild(container);

    for (let i = 0; i < trailCount; i++) {
      const element = document.createElement('div');
      element.className = 'absolute w-4 h-4 rounded-full bg-white opacity-0';
      element.style.transform = 'translate(-50%, -50%)';
      element.style.filter = 'blur(2px)';
      container.appendChild(element);
      trailRef.current[i] = element;
    }

    // Function to get background color at cursor position
    const getBackgroundColor = (x: number, y: number) => {
      const element = document.elementFromPoint(x, y);
      if (!element) return 'white';

      // Get computed style
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      
      // Convert to RGB values
      const rgb = bgColor.match(/\d+/g);
      if (!rgb) return 'white';

      // Check if background is dark (black)
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      return brightness < 128 ? 'white' : 'black';
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
      
      // Update color based on background
      currentColor.current = getBackgroundColor(e.clientX, e.clientY);
    };

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      // Update trail positions
      for (let i = 0; i < trailCount; i++) {
        const element = trailRef.current[i];
        if (!element) continue;

        const prevPosition = i === 0 ? mousePosition.current : trailPositions.current[i - 1];
        const currentPosition = trailPositions.current[i];

        // Smooth movement with easing
        const newX = gsap.utils.interpolate(currentPosition.x, prevPosition.x, 0.15);
        const newY = gsap.utils.interpolate(currentPosition.y, prevPosition.y, 0.15);

        trailPositions.current[i] = { x: newX, y: newY };

        // Calculate distance from cursor for dynamic effects
        const distance = Math.sqrt(
          Math.pow(newX - mousePosition.current.x, 2) + 
          Math.pow(newY - mousePosition.current.y, 2)
        );

        // Dynamic scale and opacity based on distance
        const scale = 1 - (distance / 200) * 0.5;
        const opacity = 1 - (distance / 200) * 0.8;

        // Update element position and appearance
        gsap.set(element, {
          x: newX,
          y: newY,
          opacity: Math.max(0, opacity),
          scale: Math.max(0.2, scale),
          rotation: i * 10,
          background: currentColor.current,
          boxShadow: `0 0 ${5 + Math.sin(distance / 20) * 3}px ${currentColor.current}`
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
      container.remove();
    };
  }, []);

  return null;
};

export default CursorTrail; 