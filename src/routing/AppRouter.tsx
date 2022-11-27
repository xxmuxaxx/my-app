import { Route, Routes } from "react-router-dom";

import { Layout } from "../components/layout";
import { ROUTES } from "../constants";
import { AddRecipe, RecipeDetail, Recipes } from "../modules/recipes";
import { TodoList } from "../modules/todoList";
import {
  LoginPage,
  RegistrationPage,
  SudokuPage,
  ThemeSettingsPage,
} from "./AppPages";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.INDEX}
        element={<ProtectedRoute children={<Layout />} />}
      >
        <Route path={ROUTES.TODO_LIST} element={<TodoList />} />
        <Route path={ROUTES.RECIPES} element={<Recipes />} />
        <Route path={ROUTES.RECIPES_ADD} element={<AddRecipe />} />
        <Route path={ROUTES.RECIPE_DETAIL} element={<RecipeDetail />} />
        <Route path={ROUTES.THEME_SETTINGS} element={<ThemeSettingsPage />} />
        <Route path={ROUTES.SUDOKU} element={<SudokuPage />} />
      </Route>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTRATION} element={<RegistrationPage />} />
    </Routes>
  );
};
