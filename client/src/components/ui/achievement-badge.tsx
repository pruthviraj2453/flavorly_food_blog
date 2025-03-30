import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Confetti from "./confetti";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Achievement {
  title: string;
  description: string;
  icon: string;
}

const AchievementBadge: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Listen for achievement events
    const achievementListener = (achievement: Achievement) => {
      setCurrentAchievement(achievement);
      setIsVisible(true);
      setShowConfetti(true);
      
      // Hide confetti after a few seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      // Auto-hide achievement after some time
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };
    
    // Example of showing an achievement (this would normally come from an API event)
    const showDemoAchievement = () => {
      const demoAchievements = [
        {
          title: "Recipe Collector",
          description: "You've saved 5 recipes to your collection!",
          icon: "fa-bookmark"
        },
        {
          title: "Master Chef",
          description: "You've cooked 10 recipes from our collection!",
          icon: "fa-utensils"
        },
        {
          title: "Health Enthusiast",
          description: "You've tried 5 healthy recipes!",
          icon: "fa-heart"
        }
      ];
      
      // Uncomment this to test the achievement notification
      /*
      setTimeout(() => {
        achievementListener(demoAchievements[Math.floor(Math.random() * demoAchievements.length)]);
      }, 5000);
      */
    };
    
    showDemoAchievement();
    
    // Create a custom event for achievements
    window.addEventListener('achievement-unlocked', ((e: CustomEvent) => {
      achievementListener(e.detail);
    }) as EventListener);
    
    return () => {
      window.removeEventListener('achievement-unlocked', ((e: CustomEvent) => {
        achievementListener(e.detail);
      }) as EventListener);
    };
  }, []);

  if (!currentAchievement) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="bg-white rounded-xl shadow-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                <i className={`fas ${currentAchievement.icon} text-3xl text-primary animate-bounce`}></i>
              </div>
              <div>
                <h4 className="font-semibold text-lg">{currentAchievement.title}</h4>
                <p className="text-neutral-dark">{currentAchievement.description}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-neutral-dark hover:text-primary"
                onClick={() => setIsVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showConfetti && (
        <Confetti 
          x={window.innerWidth - 100} 
          y={window.innerHeight - 100} 
          amount={50}
          duration={3000}
        />
      )}
    </>
  );
};

export default AchievementBadge;
