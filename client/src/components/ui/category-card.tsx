import { motion } from "framer-motion";
import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
  delay?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, delay = 0 }) => {
  return (
    <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
      <motion.div 
        className="group relative overflow-hidden rounded-xl bg-neutral-light hover:bg-neutral transition-all duration-300 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay * 0.1 }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 p-3 w-full">
          <h3 className="text-white font-semibold text-lg">{category.name}</h3>
          <p className="text-white/80 text-xs">{category.recipeCount || 0} recipes</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
