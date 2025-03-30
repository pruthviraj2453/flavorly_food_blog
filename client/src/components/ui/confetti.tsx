import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  x: number;
  y: number;
  colors?: string[];
  amount?: number;
  duration?: number;
}

const Confetti: React.FC<ConfettiProps> = ({
  x,
  y,
  colors = ['#FF7D00', '#4CAF50', '#FFA94D', '#7BC67E'],
  amount = 30,
  duration = 1500
}) => {
  const [particles, setParticles] = useState<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
    vx: number;
    vy: number;
  }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: amount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const force = 5 + Math.random() * 7;
      return {
        id: i,
        x: 0,
        y: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 6,
        rotation: Math.random() * 360,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force - 3
      };
    });
    
    setParticles(newParticles);

    // Cleanup
    return () => {
      setParticles([]);
    };
  }, [amount, colors, x, y]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x,
            y,
            opacity: 1,
            scale: 0,
            rotate: 0
          }}
          animate={{
            x: x + particle.vx * 20,
            y: y + particle.vy * 20,
            opacity: 0,
            scale: 1,
            rotate: particle.rotation
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: duration / 1000,
            ease: [0.2, 0.8, 0.4, 1],
          }}
          style={{
            position: 'fixed',
            width: particle.size,
            height: particle.size,
            borderRadius: particle.size < 10 ? '50%' : '2px',
            backgroundColor: particle.color,
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        />
      ))}
    </AnimatePresence>
  );
};

export default Confetti;
