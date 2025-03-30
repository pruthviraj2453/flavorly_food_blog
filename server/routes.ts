import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertRecipeSchema, 
  insertIngredientSchema, 
  insertStepSchema,
  insertCategorySchema,
  insertSavedRecipeSchema,
  insertAchievementSchema,
  insertNutritionInfoSchema
} from "@shared/schema";
import z from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to validate request body
  function validate<T extends z.ZodTypeAny>(
    schema: T,
    req: Request,
    res: Response
  ): z.infer<T> | null {
    try {
      return schema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
      return null;
    }
  }

  // User routes
  app.post("/api/users", async (req, res) => {
    const data = validate(insertUserSchema, req, res);
    if (!data) return;

    const existingUser = await storage.getUserByUsername(data.username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const user = await storage.createUser(data);
    res.status(201).json(user);
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Recipe routes
  app.get("/api/recipes", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const filters = req.query.filters ? (req.query.filters as string).split(',') : [];
    const sort = req.query.sort as string || 'popularity';
    
    // First get all recipes
    let recipes = await storage.getRecipes(limit, offset);
    
    // Filter recipes based on filter options
    if (filters.length > 0) {
      recipes = recipes.filter(recipe => {
        if (filters.includes('vegetarian') && 
            !recipe.categoryIds.includes(3)) { // Assuming category ID 3 is Vegetarian
          return false;
        }
        
        if (filters.includes('quick-meals') && 
            !recipe.categoryIds.includes(4)) { // Assuming category ID 4 is Quick & Easy
          return false;
        }
        
        if (filters.includes('low-carb') && 
            (recipe.calories ?? 0) > 300) { // Simple low carb check based on calories
          return false;
        }
        
        if (filters.includes('gluten-free') && 
            recipe.title.toLowerCase().includes('bread') || 
            recipe.title.toLowerCase().includes('pasta') || 
            recipe.title.toLowerCase().includes('pizza')) {
          return false;
        }
        
        return true;
      });
    }
    
    // Sort recipes based on sort option
    if (sort) {
      switch (sort) {
        case 'newest':
          recipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'time-asc':
          recipes.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
          break;
        case 'time-desc':
          recipes.sort((a, b) => (b.prepTime + b.cookTime) - (a.prepTime + a.cookTime));
          break;
        case 'difficulty':
          const difficultyMap: {[key: string]: number} = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          recipes.sort((a, b) => difficultyMap[a.difficulty] - difficultyMap[b.difficulty]);
          break;
        case 'popularity':
        default:
          recipes.sort((a, b) => (b.ratingCount ?? 0) - (a.ratingCount ?? 0));
          break;
      }
    }
    
    res.json(recipes);
  });

  app.get("/api/recipes/:id", async (req, res) => {
    const recipe = await storage.getRecipeById(parseInt(req.params.id));
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  });

  app.post("/api/recipes", async (req, res) => {
    const data = validate(insertRecipeSchema, req, res);
    if (!data) return;

    const recipe = await storage.createRecipe(data);
    res.status(201).json(recipe);
  });

  app.put("/api/recipes/:id", async (req, res) => {
    const data = validate(insertRecipeSchema.partial(), req, res);
    if (!data) return;

    const recipe = await storage.updateRecipe(parseInt(req.params.id), data);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  });

  app.delete("/api/recipes/:id", async (req, res) => {
    const success = await storage.deleteRecipe(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(204).send();
  });

  app.get("/api/recipes/search/:query", async (req, res) => {
    const recipes = await storage.searchRecipes(req.params.query);
    res.json(recipes);
  });

  // Ingredient routes
  app.get("/api/recipes/:recipeId/ingredients", async (req, res) => {
    const ingredients = await storage.getIngredientsByRecipeId(parseInt(req.params.recipeId));
    res.json(ingredients);
  });

  app.post("/api/ingredients", async (req, res) => {
    const data = validate(insertIngredientSchema, req, res);
    if (!data) return;

    const ingredient = await storage.createIngredient(data);
    res.status(201).json(ingredient);
  });

  app.put("/api/ingredients/:id", async (req, res) => {
    const data = validate(insertIngredientSchema.partial(), req, res);
    if (!data) return;

    const ingredient = await storage.updateIngredient(parseInt(req.params.id), data);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.json(ingredient);
  });

  app.delete("/api/ingredients/:id", async (req, res) => {
    const success = await storage.deleteIngredient(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.status(204).send();
  });

  // Step routes
  app.get("/api/recipes/:recipeId/steps", async (req, res) => {
    const steps = await storage.getStepsByRecipeId(parseInt(req.params.recipeId));
    res.json(steps);
  });

  app.post("/api/steps", async (req, res) => {
    const data = validate(insertStepSchema, req, res);
    if (!data) return;

    const step = await storage.createStep(data);
    res.status(201).json(step);
  });

  app.put("/api/steps/:id", async (req, res) => {
    const data = validate(insertStepSchema.partial(), req, res);
    if (!data) return;

    const step = await storage.updateStep(parseInt(req.params.id), data);
    if (!step) {
      return res.status(404).json({ message: "Step not found" });
    }
    res.json(step);
  });

  app.delete("/api/steps/:id", async (req, res) => {
    const success = await storage.deleteStep(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Step not found" });
    }
    res.status(204).send();
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const category = await storage.getCategoryById(parseInt(req.params.id));
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });

  app.get("/api/categories/:id/recipes", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const recipes = await storage.getRecipesByCategory(parseInt(req.params.id), limit, offset);
    res.json(recipes);
  });

  app.post("/api/categories", async (req, res) => {
    const data = validate(insertCategorySchema, req, res);
    if (!data) return;

    const category = await storage.createCategory(data);
    res.status(201).json(category);
  });

  app.put("/api/categories/:id", async (req, res) => {
    const data = validate(insertCategorySchema.partial(), req, res);
    if (!data) return;

    const category = await storage.updateCategory(parseInt(req.params.id), data);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const success = await storage.deleteCategory(parseInt(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(204).send();
  });

  // Saved Recipe routes
  app.get("/api/users/:userId/saved-recipes", async (req, res) => {
    const savedRecipes = await storage.getSavedRecipesByUserId(parseInt(req.params.userId));
    res.json(savedRecipes);
  });

  app.get("/api/users/:userId/saved-recipes/count", async (req, res) => {
    const count = await storage.getSavedRecipeCount(parseInt(req.params.userId));
    res.json({ count });
  });

  app.post("/api/saved-recipes", async (req, res) => {
    const data = validate(insertSavedRecipeSchema, req, res);
    if (!data) return;

    const savedRecipe = await storage.createSavedRecipe(data);
    res.status(201).json(savedRecipe);
  });

  app.delete("/api/users/:userId/saved-recipes/:recipeId", async (req, res) => {
    const success = await storage.deleteSavedRecipe(
      parseInt(req.params.userId),
      parseInt(req.params.recipeId)
    );
    if (!success) {
      return res.status(404).json({ message: "Saved recipe not found" });
    }
    res.status(204).send();
  });

  // Achievement routes
  app.get("/api/users/:userId/achievements", async (req, res) => {
    const achievements = await storage.getAchievementsByUserId(parseInt(req.params.userId));
    res.json(achievements);
  });

  app.post("/api/achievements", async (req, res) => {
    const data = validate(insertAchievementSchema, req, res);
    if (!data) return;

    const achievement = await storage.createAchievement(data);
    res.status(201).json(achievement);
  });

  // Nutrition routes
  app.get("/api/recipes/:recipeId/nutrition", async (req, res) => {
    const nutrition = await storage.getNutritionByRecipeId(parseInt(req.params.recipeId));
    if (!nutrition) {
      return res.status(404).json({ message: "Nutrition information not found" });
    }
    res.json(nutrition);
  });

  app.post("/api/nutrition", async (req, res) => {
    const data = validate(insertNutritionInfoSchema, req, res);
    if (!data) return;

    const nutrition = await storage.createNutritionInfo(data);
    res.status(201).json(nutrition);
  });

  app.put("/api/nutrition/:id", async (req, res) => {
    const data = validate(insertNutritionInfoSchema.partial(), req, res);
    if (!data) return;

    const nutrition = await storage.updateNutritionInfo(parseInt(req.params.id), data);
    if (!nutrition) {
      return res.status(404).json({ message: "Nutrition information not found" });
    }
    res.json(nutrition);
  });

  const httpServer = createServer(app);
  return httpServer;
}
