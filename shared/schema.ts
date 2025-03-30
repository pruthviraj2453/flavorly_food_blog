import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  prepTime: integer("prep_time").notNull(), // in minutes
  cookTime: integer("cook_time").notNull(), // in minutes
  servings: integer("servings").notNull(),
  calories: integer("calories"),
  difficulty: text("difficulty").notNull(), // "Easy", "Medium", "Hard"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: integer("user_id").references(() => users.id),
  categoryIds: jsonb("category_ids").notNull().$type<number[]>(), // array of category IDs
  rating: integer("rating").default(0),
  ratingCount: integer("rating_count").default(0),
});

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  name: text("name").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit"),
});

export const steps = pgTable("steps", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  stepNumber: integer("step_number").notNull(),
  instruction: text("instruction").notNull(),
  timerMinutes: integer("timer_minutes"), // optional timer for the step
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  recipeCount: integer("recipe_count").default(0),
});

export const savedRecipes = pgTable("saved_recipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // e.g. "SAVE_RECIPES", "COOK_RECIPES"
  count: integer("count").notNull().default(1),
  achievedAt: timestamp("achieved_at").defaultNow().notNull(),
});

export const nutritionInfo = pgTable("nutrition_info", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id).notNull(),
  protein: integer("protein"), // in grams
  carbs: integer("carbs"), // in grams
  fats: integer("fats"), // in grams
  fiber: integer("fiber"), // in grams
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatarUrl: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).pick({
  title: true,
  description: true,
  imageUrl: true,
  prepTime: true,
  cookTime: true,
  servings: true,
  calories: true,
  difficulty: true,
  userId: true,
  categoryIds: true,
});

export const insertIngredientSchema = createInsertSchema(ingredients).pick({
  recipeId: true,
  name: true,
  quantity: true,
  unit: true,
});

export const insertStepSchema = createInsertSchema(steps).pick({
  recipeId: true,
  stepNumber: true,
  instruction: true,
  timerMinutes: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  imageUrl: true,
});

export const insertSavedRecipeSchema = createInsertSchema(savedRecipes).pick({
  userId: true,
  recipeId: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  type: true,
  count: true,
});

export const insertNutritionInfoSchema = createInsertSchema(nutritionInfo).pick({
  recipeId: true,
  protein: true,
  carbs: true,
  fats: true,
  fiber: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;

export type Step = typeof steps.$inferSelect;
export type InsertStep = z.infer<typeof insertStepSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type SavedRecipe = typeof savedRecipes.$inferSelect;
export type InsertSavedRecipe = z.infer<typeof insertSavedRecipeSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type NutritionInfo = typeof nutritionInfo.$inferSelect;
export type InsertNutritionInfo = z.infer<typeof insertNutritionInfoSchema>;

// Full recipe type with related data
export type RecipeWithDetails = Recipe & {
  ingredients: Ingredient[];
  steps: Step[];
  nutritionInfo?: NutritionInfo;
  user: { username: string; avatarUrl: string | null };
  categories: { id: number; name: string }[];
};
