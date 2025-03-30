import { queryClient, apiRequest } from "@/lib/queryClient";
import { Recipe, InsertRecipe } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

/**
 * RecipeService provides utility functions for interacting with recipe data
 */
export class RecipeService {
  /**
   * Saves a recipe to the user's favorites
   * @param userId User ID
   * @param recipeId Recipe ID
   * @returns Promise resolving to true if successful
   */
  static async saveRecipe(userId: number, recipeId: number): Promise<boolean> {
    try {
      await apiRequest("POST", "/api/saved-recipes", {
        userId,
        recipeId,
      });
      
      // Invalidate the saved recipes query to refetch
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/saved-recipes`] });
      
      return true;
    } catch (error) {
      console.error("Error saving recipe:", error);
      return false;
    }
  }

  /**
   * Removes a recipe from the user's favorites
   * @param userId User ID
   * @param recipeId Recipe ID
   * @returns Promise resolving to true if successful
   */
  static async removeSavedRecipe(userId: number, recipeId: number): Promise<boolean> {
    try {
      await apiRequest("DELETE", `/api/users/${userId}/saved-recipes/${recipeId}`, undefined);
      
      // Invalidate the saved recipes query to refetch
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/saved-recipes`] });
      
      return true;
    } catch (error) {
      console.error("Error removing saved recipe:", error);
      return false;
    }
  }

  /**
   * Creates a new recipe
   * @param recipe Recipe data to create
   * @returns Promise resolving to the created recipe
   */
  static async createRecipe(recipe: InsertRecipe): Promise<Recipe | null> {
    try {
      const response = await apiRequest("POST", "/api/recipes", recipe);
      const newRecipe = await response.json();
      
      // Invalidate the recipes query to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      
      return newRecipe;
    } catch (error) {
      console.error("Error creating recipe:", error);
      return null;
    }
  }

  /**
   * Updates an existing recipe
   * @param id Recipe ID
   * @param recipe Updated recipe data
   * @returns Promise resolving to the updated recipe
   */
  static async updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | null> {
    try {
      const response = await apiRequest("PUT", `/api/recipes/${id}`, recipe);
      const updatedRecipe = await response.json();
      
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      
      return updatedRecipe;
    } catch (error) {
      console.error("Error updating recipe:", error);
      return null;
    }
  }

  /**
   * Searches for recipes by query string
   * @param query Search query
   * @returns Promise resolving to an array of matching recipes
   */
  static async searchRecipes(query: string): Promise<Recipe[]> {
    try {
      const response = await apiRequest("GET", `/api/recipes/search/${encodeURIComponent(query)}`, undefined);
      return await response.json();
    } catch (error) {
      console.error("Error searching recipes:", error);
      return [];
    }
  }

  /**
   * Triggers achievement for completing a recipe
   * @param userId User ID
   * @param recipeId Recipe ID
   */
  static async markRecipeAsCooked(userId: number, recipeId: number): Promise<void> {
    try {
      // Here we would typically send a request to track that the user cooked this recipe
      // For now, we'll create an achievement
      await apiRequest("POST", "/api/achievements", {
        userId,
        type: "COOK_RECIPES",
        count: 1
      });
      
      // Trigger achievement notification
      const achievementEvent = new CustomEvent('achievement-unlocked', {
        detail: {
          title: "Chef Status",
          description: "You've cooked a new recipe. Great job!",
          icon: "fa-utensils"
        }
      });
      window.dispatchEvent(achievementEvent);
    } catch (error) {
      console.error("Error marking recipe as cooked:", error);
    }
  }
}

/**
 * Hook for providing recipe-related functionality with toast notifications
 */
export const useRecipeService = () => {
  const { toast } = useToast();
  
  return {
    saveRecipe: async (userId: number, recipeId: number, recipeName?: string) => {
      const success = await RecipeService.saveRecipe(userId, recipeId);
      
      if (success) {
        toast({
          title: "Recipe saved!",
          description: recipeName 
            ? `"${recipeName}" has been added to your saved recipes`
            : "Recipe has been added to your collection",
        });
      } else {
        toast({
          title: "Failed to save recipe",
          description: "Please try again later",
          variant: "destructive",
        });
      }
      
      return success;
    },
    
    removeSavedRecipe: async (userId: number, recipeId: number) => {
      const success = await RecipeService.removeSavedRecipe(userId, recipeId);
      
      if (success) {
        toast({
          title: "Recipe removed",
          description: "Recipe has been removed from your saved recipes",
        });
      } else {
        toast({
          title: "Failed to remove recipe",
          description: "Please try again later",
          variant: "destructive",
        });
      }
      
      return success;
    },
    
    markAsCooked: async (userId: number, recipeId: number, recipeName?: string) => {
      await RecipeService.markRecipeAsCooked(userId, recipeId);
      
      toast({
        title: "Recipe completed!",
        description: recipeName 
          ? `Congratulations on cooking ${recipeName}!`
          : "Congratulations on cooking this recipe!",
      });
    }
  };
};
