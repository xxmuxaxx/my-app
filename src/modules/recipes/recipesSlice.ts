import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { userStorage } from "../../utils";
import { getRandomId } from "../../utils/getRandomId";
import { AddRecipeDTO, RecipesState } from "./types/interface";

const initialState: RecipesState = {
  recipes: userStorage.get("recipes") || [],
  addRecipeFields: {
    title: "",
    description: "",
    image: "",
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
    setAddRecipeFields: (state, action: PayloadAction<AddRecipeDTO>) => {
      state.addRecipeFields = action.payload;
    },
  },
});

export const { addRecipe, setAddRecipeFields } = recipesSlice.actions;

export const selectRecipes = (state: RootState) => state.recipes.recipes;
export const selectAddRecipeFields = (state: RootState) =>
  state.recipes.addRecipeFields;

const { reducer } = recipesSlice;
export { reducer as recipesReduces };
