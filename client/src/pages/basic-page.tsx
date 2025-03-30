import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { slideUp, fadeIn } from "@/lib/animation-utils";

interface BasicPageProps {
  title: string;
  subtitle?: string;
}

const BasicPage: React.FC<BasicPageProps> = ({ 
  title, 
  subtitle = "This page is coming soon. We're working hard to bring you amazing content!" 
}) => {
  const [, navigate] = useLocation();

  // Scroll to the top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="min-h-[60vh] flex items-center justify-center py-20"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h1 
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          variants={slideUp}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className="text-neutral-dark text-xl max-w-2xl mx-auto mb-10"
          variants={slideUp}
          transition={{ delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
        
        <motion.div
          variants={slideUp}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <motion.button
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full flex items-center gap-2"
            onClick={() => navigate('/recipes/1')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <i className="fas fa-utensils"></i>
            <span>See Creamy Tuscan Chicken Recipe</span>
          </motion.button>
          
          <motion.button
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-full flex items-center gap-2"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <i className="fas fa-home"></i>
            <span>Back to Home</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BasicPage;