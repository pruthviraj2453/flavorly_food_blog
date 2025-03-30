import { ReactNode } from "react";
import { motion } from "framer-motion";

interface RecipeCardFlipProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
  onClick?: () => void;
}

export const RecipeCardFlip: React.FC<RecipeCardFlipProps> = ({
  front,
  back,
  isFlipped,
  onClick
}) => {
  return (
    <motion.div 
      className="perspective group cursor-pointer h-[450px]"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
    >
      <div className="relative w-full h-full preserveBack">
        {front}
        {back}
      </div>
    </motion.div>
  );
};
