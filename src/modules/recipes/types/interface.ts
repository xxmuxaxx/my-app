export type RecipesState = {
  recipes: Recipe[];
  addRecipeFields: AddRecipeDTO;
};

export type Recipe = {
  id: string;
  image: string;
  title: string;
  description: string;
};

export type AddRecipeDTO = Omit<Recipe, "id">;
