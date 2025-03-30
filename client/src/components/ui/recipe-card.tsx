import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Recipe } from "@shared/schema";
import { RecipeCardFlip } from "@/components/ui/recipe-card-flip";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RecipeCardProps {
  recipe: Recipe;
  userId?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, userId }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      navigate(`/recipes/${recipe.id}`);
    }
  };

  const handleSaveRecipe = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save recipes",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await apiRequest("POST", "/api/saved-recipes", {
        userId,
        recipeId: recipe.id,
      });
      
      // Invalidate the saved recipes query
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/saved-recipes`] });
      
      toast({
        title: "Recipe saved!",
        description: "The recipe has been added to your collection.",
      });
    } catch (error) {
      toast({
        title: "Failed to save recipe",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderRating = () => {
    const fullStars = Math.floor(recipe.rating || 0);
    const hasHalfStar = (recipe.rating || 0) % 1 >= 0.5;
    
    return (
      <div className="flex items-center mb-1">
        <div className="flex">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return <i key={i} className="fas fa-star text-yellow-400"></i>;
            } else if (i === fullStars && hasHalfStar) {
              return <i key={i} className="fas fa-star-half-alt text-yellow-400"></i>;
            } else {
              return <i key={i} className="far fa-star text-yellow-400"></i>;
            }
          })}
        </div>
        <span className="text-white text-xs ml-1">({recipe.ratingCount || 0})</span>
      </div>
    );
  };

  return (
    <RecipeCardFlip
      isFlipped={isFlipped}
      onClick={handleCardClick}
      front={
        <div className="backface-hidden absolute inset-0 rounded-xl overflow-hidden bg-white shadow-lg transition-all duration-500">
          <div className="relative overflow-hidden">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-4 right-4 bg-primary text-white font-semibold text-xs rounded-full px-2 py-1">
              {formatTime(recipe.prepTime + recipe.cookTime)}
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
              <div>
                {renderRating()}
                <h3 className="text-white font-semibold text-xl">{recipe.title}</h3>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-3 text-sm">
              <div className="flex items-center mr-4">
                <i className="fas fa-clock text-neutral-dark mr-1"></i>
                <span>{formatTime(recipe.prepTime + recipe.cookTime)}</span>
              </div>
              <div className="flex items-center mr-4">
                <i className="fas fa-fire text-primary mr-1"></i>
                <span>{recipe.calories} cal</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-signal text-secondary mr-1"></i>
                <span>{recipe.difficulty}</span>
              </div>
            </div>
            
            <p className="text-neutral-dark mb-4 text-sm line-clamp-3">{recipe.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {recipe.userId && (
                  <>
                    <img 
                      src="https://randomuser.me/api/portraits/women/44.jpg" 
                      className="w-8 h-8 rounded-full" 
                      alt="Chef avatar"
                    />
                    <span className="text-sm font-medium ml-2">Chef Sophia</span>
                  </>
                )}
              </div>
              
              <motion.button 
                className="w-10 h-10 rounded-full bg-neutral flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFlip}
              >
                <i className="fas fa-chevron-right"></i>
              </motion.button>
            </div>
          </div>
        </div>
      }
      back={
        <div className="backface-hidden rotateY180 absolute inset-0 rounded-xl overflow-hidden bg-white shadow-lg transition-all duration-500">
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">{recipe.title}</h3>
              <motion.button 
                className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFlip}
              >
                <i className="fas fa-chevron-left"></i>
              </motion.button>
            </div>
            
            <h4 className="font-semibold text-primary mb-2">Ingredients</h4>
            <ul className="mb-4 flex-1 overflow-auto">
              {/* This would be populated with actual ingredients */}
              {[1, 2, 3, 4, 5].map((_, index) => (
                <li key={index} className="flex items-center mb-2 pb-2 border-b border-neutral">
                  <input 
                    type="checkbox" 
                    className="ingredient-checkbox w-4 h-4 rounded text-primary focus:ring-primary mr-2"
                  />
                  <span>Sample ingredient {index + 1}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-between">
              <div className="flex flex-wrap gap-1">
                {recipe.categoryIds && (recipe.categoryIds as number[]).map((_, index) => (
                  <Badge key={index} variant="outline" className="bg-neutral-light text-neutral-dark text-xs rounded-full">
                    Category {index + 1}
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <motion.button 
                  className={`w-8 h-8 rounded-full ${isSaving ? 'bg-primary text-white' : 'bg-neutral'} flex items-center justify-center hover:bg-primary hover:text-white transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveRecipe}
                  disabled={isSaving}
                >
                  <i className="fas fa-bookmark"></i>
                </motion.button>
                <motion.button 
                  className="w-8 h-8 rounded-full bg-neutral flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // Share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: recipe.title,
                        text: recipe.description,
                        url: window.location.origin + `/recipes/${recipe.id}`,
                      });
                    } else {
                      navigator.clipboard.writeText(
                        window.location.origin + `/recipes/${recipe.id}`
                      );
                      toast({
                        title: "Link copied!",
                        description: "Recipe link copied to clipboard",
                      });
                    }
                  }}
                >
                  <i className="fas fa-share-alt"></i>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default RecipeCard;
