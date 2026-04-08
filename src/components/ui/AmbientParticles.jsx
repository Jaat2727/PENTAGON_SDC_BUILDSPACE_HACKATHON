/*
  AmbientParticles.jsx
  --------------------
  Subtle floating "dust" background effect using Framer Motion.
  Creates a high-end ambient particle layer that sits behind all content.
*/

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function AmbientParticles() {
  // Generate particles once on mount - no re-renders
  const particles = useMemo(() => {
    const count = Math.floor(Math.random() * 6) + 20; // 20-25 particles
    
    return Array.from({ length: count }, (_, i) => {
      const isAccent = Math.random() < 0.1; // 10% chance for accent color
      const hasBlur = Math.random() < 0.3; // 30% chance for blur (depth of field)
      
      return {
        id: i,
        // Random starting position (0-100% of viewport)
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        // Random size between 1px and 3px
        size: Math.random() * 2 + 1,
        // Random opacity between 40% and 70%
        opacity: Math.random() * 0.3 + 0.4,
        // Color: 70% white, 30% accent lime (more visible colors)
        color: isAccent ? "#e8ff47" : "#ffffff",
        // Random movement offset - larger range for more movement
        offsetX: (Math.random() - 0.5) * 250,
        offsetY: (Math.random() - 0.5) * 250,
        // Duration: 6-14 seconds for faster movement
        duration: Math.random() * 8 + 6,
        // Depth of field blur
        blur: hasBlur,
        // Random delay for staggered start
        delay: Math.random() * 5,
      };
    });
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.startX}%`,
            top: `${particle.startY}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            borderRadius: '50%',
            filter: particle.blur ? 'blur(1px)' : 'none',
          }}
          animate={{
            x: [0, particle.offsetX, 0],
            y: [0, particle.offsetY, 0],
          }}
          transition={{
            duration: particle.duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
