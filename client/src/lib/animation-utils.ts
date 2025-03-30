import { MotionProps } from "framer-motion";

export const pageTransition: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const slideRight = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const slideLeft = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const rotate = {
  hidden: { opacity: 0, rotate: -5 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const scale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const bounce = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: [0, -15, 0],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        ease: "easeInOut"
      },
      opacity: {
        duration: 0.3
      }
    }
  }
};

export const pulse = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: [1, 1.05, 1],
    transition: {
      scale: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
        ease: "easeInOut"
      },
      opacity: {
        duration: 0.3
      }
    }
  }
};

export const createConfetti = (
  x: number, 
  y: number, 
  colors: string[] = ['#FF7D00', '#4CAF50', '#FFA94D', '#7BC67E']
) => {
  const confettiCount = 30;
  const confetti = [];
  
  for (let i = 0; i < confettiCount; i++) {
    // Random angle and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 40;
    
    // Velocities
    const velocityX = Math.cos(angle) * (3 + Math.random() * 2);
    const velocityY = Math.sin(angle) * (3 + Math.random() * 2) - 3;
    
    confetti.push({
      id: i,
      x,
      y,
      velocityX,
      velocityY,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 10,
      rotation: Math.random() * 360
    });
  }
  
  return confetti;
};

export const flipCardVariants = {
  front: {
    rotateY: 0,
  },
  back: {
    rotateY: 180,
  }
};

export const timerCircleVariants = {
  full: { 
    strokeDashoffset: 0,
    transition: { duration: 0 }
  },
  countdown: (seconds: number) => ({ 
    strokeDashoffset: 283 * (1 - seconds / 60),
    transition: { duration: seconds, ease: "linear" }
  })
};
