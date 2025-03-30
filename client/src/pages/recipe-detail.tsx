import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RecipeWithDetails } from "@shared/schema";
import IngredientList from "@/components/ui/ingredient-list";
import CookingSteps from "@/components/ui/cooking-steps";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Confetti from "@/components/ui/confetti";

const RecipeDetail: React.FC = () => {
  const [match, params] = useRoute("/recipes/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });
  const [allStepsCompleted, setAllStepsCompleted] = useState(false);

  const { data: recipe, isLoading, error } = useQuery<RecipeWithDetails>({
    queryKey: [`/api/recipes/${params?.id}`],
    enabled: !!params?.id,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.id]);

  const handleSaveRecipe = async () => {
    try {
      // In a real app with authentication, this would use the actual user ID
      const userId = 1;
      
      await apiRequest("POST", "/api/saved-recipes", {
        userId,
        recipeId: parseInt(params?.id as string),
      });
      
      // Show confetti effect and achievement
      const button = document.getElementById('save-recipe-btn');
      if (button) {
        const rect = button.getBoundingClientRect();
        setConfettiPosition({
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/saved-recipes`] });
      
      toast({
        title: "Recipe saved!",
        description: "The recipe has been added to your collection.",
      });
      
      // Trigger achievement notification
      if (Math.random() > 0.5) {
        const achievementEvent = new CustomEvent('achievement-unlocked', {
          detail: {
            title: "Recipe Collector",
            description: "You've saved 5 recipes to your collection!",
            icon: "fa-bookmark"
          }
        });
        window.dispatchEvent(achievementEvent);
      }
    } catch (error) {
      toast({
        title: "Failed to save recipe",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleShareRecipe = () => {
    const recipeUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: recipe?.title || "Amazing recipe on Flavorly",
        text: recipe?.description || "Check out this delicious recipe",
        url: recipeUrl,
      });
    } else {
      navigator.clipboard.writeText(recipeUrl);
      toast({
        title: "Link copied!",
        description: "Recipe link copied to clipboard",
      });
    }
  };

  const handleAllIngredientsChecked = () => {
    toast({
      title: "Ingredients ready!",
      description: "You've checked all the ingredients. Time to start cooking!",
    });
  };

  const handleAllStepsCompleted = () => {
    setAllStepsCompleted(true);
    
    // Show confetti at the center bottom of screen
    setConfettiPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight - 100
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleCookedIt = () => {
    // Trigger "Cooked It" achievement
    const achievementEvent = new CustomEvent('achievement-unlocked', {
      detail: {
        title: "Chef Status",
        description: "You've cooked a new recipe. Great job!",
        icon: "fa-utensils"
      }
    });
    window.dispatchEvent(achievementEvent);
    
    // Show confetti
    const button = document.getElementById('cooked-it-btn');
    if (button) {
      const rect = button.getBoundingClientRect();
      setConfettiPosition({
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    toast({
      title: "Recipe completed!",
      description: "Congratulations on cooking this recipe. How did it turn out?",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-80 bg-neutral-light rounded-xl mb-6"></div>
          <div className="h-10 bg-neutral-light rounded-lg w-1/3 mb-4"></div>
          <div className="flex flex-wrap gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-light rounded-lg w-32"></div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-neutral-light rounded-xl h-96 mb-6"></div>
            </div>
            <div className="md:w-2/3">
              <div className="bg-neutral-light rounded-xl h-32 mb-6"></div>
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-neutral-light rounded-xl h-32"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-500">Failed to load recipe. Please try again later.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-12"
      >
        <div className="relative h-80">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div className="w-full">
              <div className="flex items-center justify-between">
                <motion.h2 
                  className="text-white font-display text-3xl font-bold"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {recipe.title}
                </motion.h2>
                <div className="flex gap-2">
                  <motion.button 
                    id="save-recipe-btn"
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-primary transition-colors"
                    onClick={handleSaveRecipe}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <i className="fas fa-bookmark"></i>
                  </motion.button>
                  <motion.button 
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-primary transition-colors"
                    onClick={handleShareRecipe}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <i className="fas fa-share-alt"></i>
                  </motion.button>
                </div>
              </div>
              
              <motion.div 
                className="flex items-center text-white mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => {
                    if (i < Math.floor(recipe.rating || 0)) {
                      return <i key={i} className="fas fa-star text-yellow-400"></i>;
                    } else if (i === Math.floor(recipe.rating || 0) && (recipe.rating || 0) % 1 >= 0.5) {
                      return <i key={i} className="fas fa-star-half-alt text-yellow-400"></i>;
                    } else {
                      return <i key={i} className="far fa-star text-yellow-400"></i>;
                    }
                  })}
                </div>
                <span className="ml-2 text-sm">({recipe.ratingCount || 0} ratings)</span>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            className="flex flex-wrap gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center bg-neutral-light rounded-lg px-4 py-2">
              <i className="fas fa-clock text-primary mr-2"></i>
              <div>
                <div className="text-sm text-neutral-dark">Prep Time</div>
                <div className="font-semibold">{formatTime(recipe.prepTime)}</div>
              </div>
            </div>
            
            <div className="flex items-center bg-neutral-light rounded-lg px-4 py-2">
              <i className="fas fa-fire text-primary mr-2"></i>
              <div>
                <div className="text-sm text-neutral-dark">Cook Time</div>
                <div className="font-semibold">{formatTime(recipe.cookTime)}</div>
              </div>
            </div>
            
            <div className="flex items-center bg-neutral-light rounded-lg px-4 py-2">
              <i className="fas fa-utensils text-primary mr-2"></i>
              <div>
                <div className="text-sm text-neutral-dark">Servings</div>
                <div className="font-semibold">{recipe.servings} people</div>
              </div>
            </div>
            
            <div className="flex items-center bg-neutral-light rounded-lg px-4 py-2">
              <i className="fas fa-signal text-primary mr-2"></i>
              <div>
                <div className="text-sm text-neutral-dark">Difficulty</div>
                <div className="font-semibold">{recipe.difficulty}</div>
              </div>
            </div>
            
            <div className="flex items-center bg-neutral-light rounded-lg px-4 py-2">
              <i className="fas fa-fire-alt text-primary mr-2"></i>
              <div>
                <div className="text-sm text-neutral-dark">Calories</div>
                <div className="font-semibold">{recipe.calories || 0} kcal</div>
              </div>
            </div>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div 
              className="md:w-1/3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <IngredientList 
                ingredients={recipe.ingredients} 
                onAllChecked={handleAllIngredientsChecked}
              />
              
              {recipe.nutritionInfo && (
                <div className="bg-neutral-light rounded-xl p-5">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <i className="fas fa-info-circle text-primary mr-2"></i>
                    Nutrition Info
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <span>Calories</span>
                      <span className="font-semibold">{recipe.calories || 0} kcal</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <span>Protein</span>
                      <span className="font-semibold">{recipe.nutritionInfo.protein || 0}g</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <span>Carbs</span>
                      <span className="font-semibold">{recipe.nutritionInfo.carbs || 0}g</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <span>Fats</span>
                      <span className="font-semibold">{recipe.nutritionInfo.fats || 0}g</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <span>Fiber</span>
                      <span className="font-semibold">{recipe.nutritionInfo.fiber || 0}g</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            
            <motion.div 
              className="md:w-2/3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <i className="fas fa-align-left text-primary mr-2"></i>
                  Description
                </h3>
                <p className="text-neutral-dark">
                  {recipe.description}
                </p>
              </div>
              
              <CookingSteps 
                steps={recipe.steps}
                onAllStepsCompleted={handleAllStepsCompleted}
              />
              
              <div className="mt-8 flex justify-center">
                <Button 
                  id="cooked-it-btn"
                  variant="default"
                  size="lg"
                  onClick={handleCookedIt}
                  className={`
                    bg-primary text-white font-bold py-3 px-8 rounded-full 
                    flex items-center hover:bg-primary-dark transition-colors 
                    shadow-lg hover:shadow-xl
                    ${allStepsCompleted ? 'animate-pulse' : ''}
                  `}
                  disabled={false}
                >
                  <i className="fas fa-utensils mr-2"></i>
                  I Cooked This!
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {showConfetti && (
          <Confetti
            x={confettiPosition.x}
            y={confettiPosition.y}
            amount={50}
            duration={2000}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeDetail;
