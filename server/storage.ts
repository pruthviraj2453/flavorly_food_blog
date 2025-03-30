import {
  users, User, InsertUser,
  recipes, Recipe, InsertRecipe,
  ingredients, Ingredient, InsertIngredient,
  steps, Step, InsertStep,
  categories, Category, InsertCategory,
  savedRecipes, SavedRecipe, InsertSavedRecipe,
  achievements, Achievement, InsertAchievement,
  nutritionInfo, NutritionInfo, InsertNutritionInfo,
  RecipeWithDetails
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Recipe operations
  getRecipes(limit?: number, offset?: number): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<RecipeWithDetails | undefined>;
  getRecipesByCategory(categoryId: number, limit?: number, offset?: number): Promise<Recipe[]>;
  searchRecipes(query: string): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;

  // Ingredient operations
  getIngredientsByRecipeId(recipeId: number): Promise<Ingredient[]>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  updateIngredient(id: number, ingredient: Partial<InsertIngredient>): Promise<Ingredient | undefined>;
  deleteIngredient(id: number): Promise<boolean>;

  // Step operations
  getStepsByRecipeId(recipeId: number): Promise<Step[]>;
  createStep(step: InsertStep): Promise<Step>;
  updateStep(id: number, step: Partial<InsertStep>): Promise<Step | undefined>;
  deleteStep(id: number): Promise<boolean>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Saved Recipe operations
  getSavedRecipesByUserId(userId: number): Promise<SavedRecipe[]>;
  getSavedRecipeCount(userId: number): Promise<number>;
  createSavedRecipe(savedRecipe: InsertSavedRecipe): Promise<SavedRecipe>;
  deleteSavedRecipe(userId: number, recipeId: number): Promise<boolean>;

  // Achievement operations
  getAchievementsByUserId(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement | undefined>;

  // Nutrition operations
  getNutritionByRecipeId(recipeId: number): Promise<NutritionInfo | undefined>;
  createNutritionInfo(nutritionInfo: InsertNutritionInfo): Promise<NutritionInfo>;
  updateNutritionInfo(id: number, nutritionInfo: Partial<InsertNutritionInfo>): Promise<NutritionInfo | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private ingredients: Map<number, Ingredient>;
  private steps: Map<number, Step>;
  private categories: Map<number, Category>;
  private savedRecipes: Map<number, SavedRecipe>;
  private achievements: Map<number, Achievement>;
  private nutritionInfo: Map<number, NutritionInfo>;
  
  private userIdCounter = 1;
  private recipeIdCounter = 1;
  private ingredientIdCounter = 1;
  private stepIdCounter = 1;
  private categoryIdCounter = 1;
  private savedRecipeIdCounter = 1;
  private achievementIdCounter = 1;
  private nutritionIdCounter = 1;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.ingredients = new Map();
    this.steps = new Map();
    this.categories = new Map();
    this.savedRecipes = new Map();
    this.achievements = new Map();
    this.nutritionInfo = new Map();

    // Initialize with some sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Recipe operations
  async getRecipes(limit: number = 100, offset: number = 0): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .sort((a, b) => b.id - a.id)
      .slice(offset, offset + limit);
  }

  async getRecipeById(id: number): Promise<RecipeWithDetails | undefined> {
    const recipe = this.recipes.get(id);
    if (!recipe) return undefined;

    const recipeIngredients = await this.getIngredientsByRecipeId(id);
    const recipeSteps = await this.getStepsByRecipeId(id);
    const recipeNutrition = await this.getNutritionByRecipeId(id);
    
    // Get user info
    const user = await this.getUser(recipe.userId || 1);
    
    // Get categories
    const categoryIds = recipe.categoryIds as number[];
    const recipeCategories = categoryIds.map(catId => {
      const cat = this.categories.get(catId);
      return cat ? { id: cat.id, name: cat.name } : { id: 0, name: 'Uncategorized' };
    });

    return {
      ...recipe,
      ingredients: recipeIngredients,
      steps: recipeSteps,
      nutritionInfo: recipeNutrition,
      user: {
        username: user?.username || 'Unknown',
        avatarUrl: user?.avatarUrl || null
      },
      categories: recipeCategories
    };
  }

  async getRecipesByCategory(categoryId: number, limit: number = 100, offset: number = 0): Promise<Recipe[]> {
    return Array.from(this.recipes.values())
      .filter(recipe => (recipe.categoryIds as number[]).includes(categoryId))
      .sort((a, b) => b.id - a.id)
      .slice(offset, offset + limit);
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.recipes.values())
      .filter(recipe => 
        recipe.title.toLowerCase().includes(lowerQuery) || 
        recipe.description.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => b.id - a.id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeIdCounter++;
    const now = new Date();
    const recipe: Recipe = { 
      ...insertRecipe, 
      id, 
      createdAt: now, 
      rating: 0, 
      ratingCount: 0
    };
    this.recipes.set(id, recipe);

    // Update recipe count for categories
    const categoryIds = recipe.categoryIds as number[];
    categoryIds.forEach(catId => {
      const category = this.categories.get(catId);
      if (category) {
        this.categories.set(catId, {
          ...category,
          recipeCount: (category.recipeCount || 0) + 1
        });
      }
    });

    return recipe;
  }

  async updateRecipe(id: number, recipeUpdate: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const existingRecipe = this.recipes.get(id);
    if (!existingRecipe) return undefined;

    const updatedRecipe = { ...existingRecipe, ...recipeUpdate };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }

  // Ingredient operations
  async getIngredientsByRecipeId(recipeId: number): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values())
      .filter(ingredient => ingredient.recipeId === recipeId)
      .sort((a, b) => a.id - b.id);
  }

  async createIngredient(insertIngredient: InsertIngredient): Promise<Ingredient> {
    const id = this.ingredientIdCounter++;
    const ingredient: Ingredient = { ...insertIngredient, id };
    this.ingredients.set(id, ingredient);
    return ingredient;
  }

  async updateIngredient(id: number, ingredientUpdate: Partial<InsertIngredient>): Promise<Ingredient | undefined> {
    const existingIngredient = this.ingredients.get(id);
    if (!existingIngredient) return undefined;

    const updatedIngredient = { ...existingIngredient, ...ingredientUpdate };
    this.ingredients.set(id, updatedIngredient);
    return updatedIngredient;
  }

  async deleteIngredient(id: number): Promise<boolean> {
    return this.ingredients.delete(id);
  }

  // Step operations
  async getStepsByRecipeId(recipeId: number): Promise<Step[]> {
    return Array.from(this.steps.values())
      .filter(step => step.recipeId === recipeId)
      .sort((a, b) => a.stepNumber - b.stepNumber);
  }

  async createStep(insertStep: InsertStep): Promise<Step> {
    const id = this.stepIdCounter++;
    const step: Step = { ...insertStep, id };
    this.steps.set(id, step);
    return step;
  }

  async updateStep(id: number, stepUpdate: Partial<InsertStep>): Promise<Step | undefined> {
    const existingStep = this.steps.get(id);
    if (!existingStep) return undefined;

    const updatedStep = { ...existingStep, ...stepUpdate };
    this.steps.set(id, updatedStep);
    return updatedStep;
  }

  async deleteStep(id: number): Promise<boolean> {
    return this.steps.delete(id);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values())
      .sort((a, b) => a.id - b.id);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id, recipeCount: 0 };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;

    const updatedCategory = { ...existingCategory, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Saved Recipe operations
  async getSavedRecipesByUserId(userId: number): Promise<SavedRecipe[]> {
    return Array.from(this.savedRecipes.values())
      .filter(savedRecipe => savedRecipe.userId === userId)
      .sort((a, b) => b.id - a.id);
  }

  async getSavedRecipeCount(userId: number): Promise<number> {
    return Array.from(this.savedRecipes.values())
      .filter(savedRecipe => savedRecipe.userId === userId)
      .length;
  }

  async createSavedRecipe(insertSavedRecipe: InsertSavedRecipe): Promise<SavedRecipe> {
    const id = this.savedRecipeIdCounter++;
    const now = new Date();
    const savedRecipe: SavedRecipe = { ...insertSavedRecipe, id, savedAt: now };
    this.savedRecipes.set(id, savedRecipe);

    // Check for achievements
    const savedCount = await this.getSavedRecipeCount(insertSavedRecipe.userId);
    if (savedCount % 5 === 0) {
      await this.createAchievement({
        userId: insertSavedRecipe.userId,
        type: 'SAVE_RECIPES',
        count: savedCount
      });
    }

    return savedRecipe;
  }

  async deleteSavedRecipe(userId: number, recipeId: number): Promise<boolean> {
    const savedRecipe = Array.from(this.savedRecipes.values())
      .find(sr => sr.userId === userId && sr.recipeId === recipeId);
    
    if (savedRecipe) {
      return this.savedRecipes.delete(savedRecipe.id);
    }
    return false;
  }

  // Achievement operations
  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => b.id - a.id);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementIdCounter++;
    const now = new Date();
    const achievement: Achievement = { ...insertAchievement, id, achievedAt: now };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async updateAchievement(id: number, achievementUpdate: Partial<InsertAchievement>): Promise<Achievement | undefined> {
    const existingAchievement = this.achievements.get(id);
    if (!existingAchievement) return undefined;

    const updatedAchievement = { ...existingAchievement, ...achievementUpdate };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }

  // Nutrition operations
  async getNutritionByRecipeId(recipeId: number): Promise<NutritionInfo | undefined> {
    return Array.from(this.nutritionInfo.values())
      .find(nutrition => nutrition.recipeId === recipeId);
  }

  async createNutritionInfo(insertNutritionInfo: InsertNutritionInfo): Promise<NutritionInfo> {
    const id = this.nutritionIdCounter++;
    const nutritionInfo: NutritionInfo = { ...insertNutritionInfo, id };
    this.nutritionInfo.set(id, nutritionInfo);
    return nutritionInfo;
  }

  async updateNutritionInfo(id: number, nutritionUpdate: Partial<InsertNutritionInfo>): Promise<NutritionInfo | undefined> {
    const existingNutritionInfo = this.nutritionInfo.get(id);
    if (!existingNutritionInfo) return undefined;

    const updatedNutritionInfo = { ...existingNutritionInfo, ...nutritionUpdate };
    this.nutritionInfo.set(id, updatedNutritionInfo);
    return updatedNutritionInfo;
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Create a demo user
    const demoUser: InsertUser = {
      username: "demouser",
      password: "password123",
      email: "demo@example.com",
      avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg"
    };
    this.createUser(demoUser).then(user => {
      // Create some categories
      const categoryData: InsertCategory[] = [
        {
          name: "Healthy",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
        },
        {
          name: "Desserts",
          imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b"
        },
        {
          name: "Vegetarian",
          imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
        },
        {
          name: "Quick & Easy",
          imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8"
        },
        {
          name: "Italian",
          imageUrl: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Breakfast",
          imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2"
        }
      ];

      Promise.all(categoryData.map(category => this.createCategory(category)))
        .then(categories => {
          // Create some recipes
          const recipeData: InsertRecipe[] = [
            {
              title: "Creamy Tuscan Garlic Chicken",
              description: "A rich and creamy Italian-inspired dish with sun-dried tomatoes and spinach. Perfect for a weeknight dinner!",
              imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
              prepTime: 10,
              cookTime: 20,
              servings: 4,
              calories: 450,
              difficulty: "Easy",
              userId: user.id,
              categoryIds: [categories[4].id, categories[3].id] // Italian, Quick & Easy
            },
            {
              title: "Classic Margherita Pizza",
              description: "A simple yet delicious classic Italian pizza with fresh tomatoes, mozzarella, and basil. The perfect combination of flavors!",
              imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
              prepTime: 20,
              cookTime: 25,
              servings: 4,
              calories: 320,
              difficulty: "Medium",
              userId: user.id,
              categoryIds: [categories[4].id, categories[2].id] // Italian, Vegetarian
            },
            {
              title: "Rainbow Smoothie Bowl",
              description: "A vibrant and nutritious breakfast bowl packed with antioxidants, vitamins, and fresh fruits for a perfect start to your day.",
              imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246",
              prepTime: 10,
              cookTime: 5,
              servings: 1,
              calories: 280,
              difficulty: "Easy",
              userId: user.id,
              categoryIds: [categories[0].id, categories[5].id, categories[2].id] // Healthy, Breakfast, Vegetarian
            },
            {
              title: "Asian-Style Grilled Salmon",
              description: "Delicious salmon with Asian-inspired flavors including soy sauce, ginger, and sesame oil. Served with steamed vegetables.",
              imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              prepTime: 10,
              cookTime: 15,
              servings: 4,
              calories: 380,
              difficulty: "Medium",
              userId: user.id,
              categoryIds: [categories[0].id, categories[3].id] // Healthy, Quick & Easy
            },
            {
              title: "Chocolate Chip Cookies",
              description: "Classic homemade chocolate chip cookies with a soft, chewy center and crispy edges. Perfect for dessert or an afternoon treat!",
              imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              prepTime: 15,
              cookTime: 10,
              servings: 24,
              calories: 120,
              difficulty: "Easy",
              userId: user.id,
              categoryIds: [categories[1].id] // Desserts
            },
            {
              title: "Vegetable Stir Fry",
              description: "A quick and colorful vegetable stir fry with a savory sauce. Ready in minutes and packed with nutrients!",
              imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              prepTime: 15,
              cookTime: 10,
              servings: 4,
              calories: 220,
              difficulty: "Easy",
              userId: user.id,
              categoryIds: [categories[2].id, categories[3].id, categories[0].id] // Vegetarian, Quick & Easy, Healthy
            },
            {
              title: "Avocado Toast with Poached Egg",
              description: "Creamy avocado on toasted artisan bread topped with a perfectly poached egg. A breakfast classic with a modern twist!",
              imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              prepTime: 5,
              cookTime: 10,
              servings: 1,
              calories: 320,
              difficulty: "Medium",
              userId: user.id,
              categoryIds: [categories[5].id, categories[3].id] // Breakfast, Quick & Easy
            },
            {
              title: "Spaghetti Carbonara",
              description: "Authentic Italian pasta dish with eggs, Pecorino Romano cheese, pancetta, and black pepper. A simple yet elegant meal!",
              imageUrl: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
              prepTime: 10,
              cookTime: 15,
              servings: 4,
              calories: 480,
              difficulty: "Medium",
              userId: user.id,
              categoryIds: [categories[4].id] // Italian
            }
          ];

          Promise.all(recipeData.map(recipe => this.createRecipe(recipe)))
            .then(recipes => {
              // Add ingredients for each recipe
              const ingredientsData: InsertIngredient[][] = [
                // Ingredients for Creamy Tuscan Garlic Chicken
                [
                  { recipeId: recipes[0].id, name: "boneless skinless chicken breasts", quantity: "4", unit: "" },
                  { recipeId: recipes[0].id, name: "olive oil", quantity: "2", unit: "tbsp" },
                  { recipeId: recipes[0].id, name: "heavy cream", quantity: "1", unit: "cup" },
                  { recipeId: recipes[0].id, name: "chicken broth", quantity: "1/2", unit: "cup" },
                  { recipeId: recipes[0].id, name: "garlic powder", quantity: "1", unit: "tsp" },
                  { recipeId: recipes[0].id, name: "Italian seasoning", quantity: "1", unit: "tsp" },
                  { recipeId: recipes[0].id, name: "sun-dried tomatoes", quantity: "1/2", unit: "cup" },
                  { recipeId: recipes[0].id, name: "spinach", quantity: "2", unit: "cups" }
                ],
                // Ingredients for Classic Margherita Pizza
                [
                  { recipeId: recipes[1].id, name: "pizza dough", quantity: "1", unit: "" },
                  { recipeId: recipes[1].id, name: "tomato sauce", quantity: "1/2", unit: "cup" },
                  { recipeId: recipes[1].id, name: "fresh mozzarella cheese", quantity: "8", unit: "oz" },
                  { recipeId: recipes[1].id, name: "extra virgin olive oil", quantity: "2", unit: "tbsp" },
                  { recipeId: recipes[1].id, name: "fresh basil leaves", quantity: "10", unit: "" },
                  { recipeId: recipes[1].id, name: "salt and pepper", quantity: "", unit: "to taste" }
                ],
                // Ingredients for Rainbow Smoothie Bowl
                [
                  { recipeId: recipes[2].id, name: "frozen banana", quantity: "1", unit: "" },
                  { recipeId: recipes[2].id, name: "frozen berries", quantity: "1", unit: "cup" },
                  { recipeId: recipes[2].id, name: "Greek yogurt", quantity: "1/2", unit: "cup" },
                  { recipeId: recipes[2].id, name: "almond milk", quantity: "1/4", unit: "cup" },
                  { recipeId: recipes[2].id, name: "honey or maple syrup", quantity: "1", unit: "tbsp" },
                  { recipeId: recipes[2].id, name: "toppings: sliced fruits, granola, chia seeds", quantity: "", unit: "as needed" }
                ],
                // Ingredients for Asian-Style Grilled Salmon
                [
                  { recipeId: recipes[3].id, name: "salmon fillets", quantity: "4", unit: "(6 oz each)" },
                  { recipeId: recipes[3].id, name: "soy sauce", quantity: "3", unit: "tbsp" },
                  { recipeId: recipes[3].id, name: "honey", quantity: "2", unit: "tbsp" },
                  { recipeId: recipes[3].id, name: "sesame oil", quantity: "1", unit: "tbsp" },
                  { recipeId: recipes[3].id, name: "grated ginger", quantity: "1", unit: "tbsp" },
                  { recipeId: recipes[3].id, name: "garlic, minced", quantity: "2", unit: "cloves" },
                  { recipeId: recipes[3].id, name: "sliced green onions", quantity: "", unit: "for garnish" },
                  { recipeId: recipes[3].id, name: "sesame seeds", quantity: "", unit: "for garnish" }
                ]
              ];

              // Add all ingredients
              ingredientsData.forEach(recipeIngredients => {
                recipeIngredients.forEach(ingredient => {
                  this.createIngredient(ingredient);
                });
              });

              // Add steps for each recipe
              const stepsData: InsertStep[][] = [
                // Steps for Creamy Tuscan Garlic Chicken
                [
                  { recipeId: recipes[0].id, stepNumber: 1, instruction: "Season chicken breasts with salt, pepper, and Italian seasoning on both sides.", timerMinutes: 5 },
                  { recipeId: recipes[0].id, stepNumber: 2, instruction: "Heat olive oil in a large skillet over medium-high heat. Add chicken and cook for 5-7 minutes per side until golden brown and cooked through. Remove chicken from the pan and set aside.", timerMinutes: 15 },
                  { recipeId: recipes[0].id, stepNumber: 3, instruction: "In the same pan, add chicken broth to deglaze, scraping up any browned bits. Add heavy cream, garlic powder, and Italian seasoning. Bring to a simmer.", timerMinutes: 5 },
                  { recipeId: recipes[0].id, stepNumber: 4, instruction: "Add sun-dried tomatoes and simmer for 1-2 minutes. Add spinach and stir until wilted. Return chicken to the pan and spoon sauce over it. Simmer for an additional 2-3 minutes until heated through.", timerMinutes: 5 }
                ],
                // Steps for Classic Margherita Pizza
                [
                  { recipeId: recipes[1].id, stepNumber: 1, instruction: "Preheat oven to 475°F (245°C) with a pizza stone or baking sheet inside.", timerMinutes: 30 },
                  { recipeId: recipes[1].id, stepNumber: 2, instruction: "On a floured surface, stretch the pizza dough into a 12-inch circle.", timerMinutes: 5 },
                  { recipeId: recipes[1].id, stepNumber: 3, instruction: "Spread tomato sauce evenly over the dough, leaving a 1-inch border for the crust.", timerMinutes: 2 },
                  { recipeId: recipes[1].id, stepNumber: 4, instruction: "Tear the mozzarella into pieces and distribute evenly over the sauce.", timerMinutes: 2 },
                  { recipeId: recipes[1].id, stepNumber: 5, instruction: "Carefully transfer the pizza to the preheated stone or baking sheet. Bake for 10-12 minutes until the crust is golden and the cheese is bubbling.", timerMinutes: 12 },
                  { recipeId: recipes[1].id, stepNumber: 6, instruction: "Remove from oven, drizzle with olive oil, and scatter fresh basil leaves on top. Season with salt and pepper to taste.", timerMinutes: 1 }
                ],
                // Steps for Rainbow Smoothie Bowl
                [
                  { recipeId: recipes[2].id, stepNumber: 1, instruction: "Place the frozen banana, berries, Greek yogurt, almond milk, and sweetener in a blender.", timerMinutes: 2 },
                  { recipeId: recipes[2].id, stepNumber: 2, instruction: "Blend until smooth and creamy. The mixture should be thick enough to eat with a spoon.", timerMinutes: 3 },
                  { recipeId: recipes[2].id, stepNumber: 3, instruction: "Pour into a bowl and arrange toppings in a decorative pattern.", timerMinutes: 5 }
                ],
                // Steps for Asian-Style Grilled Salmon
                [
                  { recipeId: recipes[3].id, stepNumber: 1, instruction: "In a bowl, mix soy sauce, honey, sesame oil, ginger, and garlic to make the marinade.", timerMinutes: 5 },
                  { recipeId: recipes[3].id, stepNumber: 2, instruction: "Place salmon fillets in a shallow dish and pour the marinade over them, turning to coat. Let marinate for at least 15 minutes, or up to 1 hour in the refrigerator.", timerMinutes: 15 },
                  { recipeId: recipes[3].id, stepNumber: 3, instruction: "Preheat grill or grill pan to medium-high heat.", timerMinutes: 5 },
                  { recipeId: recipes[3].id, stepNumber: 4, instruction: "Remove salmon from marinade and grill for 4-5 minutes per side, or until fish flakes easily with a fork.", timerMinutes: 10 },
                  { recipeId: recipes[3].id, stepNumber: 5, instruction: "Garnish with sliced green onions and sesame seeds before serving.", timerMinutes: 1 }
                ]
              ];

              // Add all steps
              stepsData.forEach(recipeSteps => {
                recipeSteps.forEach(step => {
                  this.createStep(step);
                });
              });

              // Add nutrition info for each recipe
              const nutritionData: InsertNutritionInfo[] = [
                { recipeId: recipes[0].id, protein: 38, carbs: 12, fats: 28, fiber: 3 },
                { recipeId: recipes[1].id, protein: 15, carbs: 42, fats: 10, fiber: 2 },
                { recipeId: recipes[2].id, protein: 12, carbs: 45, fats: 5, fiber: 8 },
                { recipeId: recipes[3].id, protein: 32, carbs: 8, fats: 18, fiber: 1 }
              ];

              nutritionData.forEach(nutrition => {
                this.createNutritionInfo(nutrition);
              });
            });
        });
    });
  }
}

export const storage = new MemStorage();
