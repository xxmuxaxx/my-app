import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../store";
import { userStorage } from "../../utils";
import { getRandomId } from "../../utils/getRandomId";
import { AddRecipeDTO, RecipesState } from "./types/interface";

const initialState: RecipesState = {
  recipes: userStorage.get("recipes") || [],
  activeRecipeId: null,
  addRecipeFields: {
    title: "",
    description: "",
    image: "",
    products: [""],
  },
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<AddRecipeDTO | undefined>) => {
      const id = getRandomId();
      const addedRecipe = { id, ...(action.payload || state.addRecipeFields) };
      state.recipes = state.recipes.concat(addedRecipe);
      userStorage.set("recipes", state.recipes);
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(
        (recipe) => recipe.id !== action.payload
      );
      userStorage.set("recipes", state.recipes);
    },
    setActiveRecipeId: (state, action: PayloadAction<string | null>) => {
      state.activeRecipeId = action.payload;
    },
    setAddRecipeFields: (state, action: PayloadAction<AddRecipeDTO>) => {
      state.addRecipeFields = action.payload;
    },
  },
});

export const {
  addRecipe,
  deleteRecipe,
  setActiveRecipeId,
  setAddRecipeFields,
} = recipesSlice.actions;

export const selectRecipes = (state: RootState) => state.recipes.recipes;
export const selectActiveRecipeId = (state: RootState) =>
  state.recipes.activeRecipeId;
export const selectActiveRecipe = createSelector(
  selectRecipes,
  selectActiveRecipeId,
  (recipes, id) => (id ? recipes.find((recipe) => recipe.id === id) : null)
);
export const selectAddRecipeFields = (state: RootState) =>
  state.recipes.addRecipeFields;

const { reducer } = recipesSlice;
export { reducer as recipesReducer };
