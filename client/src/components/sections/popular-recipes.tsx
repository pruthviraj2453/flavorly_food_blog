import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/ui/recipe-card";
import { Recipe } from "@shared/schema";

interface PopularRecipesProps {
  initialLimit?: number;
  filters?: string[];
  sortOption?: string;
}

const PopularRecipes: React.FC<PopularRecipesProps> = ({ 
  initialLimit = 4,
  filters = [],
  sortOption = "popularity"
}) => {
  const [limit, setLimit] = useState(initialLimit);
  const [activeFilters, setActiveFilters] = useState<string[]>(filters);
  const [activeSortOption, setActiveSortOption] = useState<string>(sortOption);
  
  // Update state when props change
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(activeFilters)) {
      setActiveFilters(filters);
    }
  }, [filters, activeFilters]);
  
  useEffect(() => {
    if (sortOption !== activeSortOption) {
      setActiveSortOption(sortOption);
    }
  }, [sortOption, activeSortOption]);
  
  const { data: recipes, isLoading, error } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes', limit, activeFilters.join(','), activeSortOption],
    queryFn: async () => {
      const filterParam = activeFilters.length ? `&filters=${activeFilters.join(',')}` : '';
      const sortParam = activeSortOption ? `&sort=${activeSortOption}` : '';
      const response = await fetch(`/api/recipes?limit=${limit}${filterParam}${sortParam}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return response.json();
    }
  });

  const handleLoadMore = () => {
    setLimit(prevLimit => prevLimit + 4);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
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

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Popular Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(initialLimit)].map((_, i) => (
            <div key={i} className="h-[450px] bg-neutral-light rounded-xl animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-500">Failed to load recipes. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <motion.h2 
        className="font-display text-2xl md:text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Popular Recipes
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {recipes?.map((recipe) => (
          <motion.div key={recipe.id} variants={itemVariants}>
            <RecipeCard recipe={recipe} />
          </motion.div>
        ))}
      </motion.div>
      
      {recipes && recipes.length >= limit && (
        <div className="flex justify-center mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLoadMore}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-full transition-colors flex items-center"
            >
              Load More Recipes
              <i className="fas fa-arrow-down ml-2"></i>
            </Button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default PopularRecipes;
