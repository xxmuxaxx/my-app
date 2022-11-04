export type RecipesState = {
  recipes: Recipe[];
  activeRecipeId: string | null;
  addRecipeFields: AddRecipeDTO;
};

export type Recipe = {
  id: string;
  image: string;
  title: string;
  description: string;
  products: string[];
};

export type AddRecipeDTO = Omit<Recipe, "id">;
