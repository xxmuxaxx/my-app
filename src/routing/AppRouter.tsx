import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../components/layout";
import { Home } from "../pages/home/Home";
import { ROUTES } from "../constants";
import { AddRecipe, RecipeDetail, Recipes } from "../modules/recipes";
import { TodoList } from "../modules/todoList";
import { SudokuPage, ThemeSettingsPage } from "./AppPages";

export const AppRouter = () => (
  <Routes>
    <Route path={ROUTES.INDEX} element={<Layout />}>
      <Route index element={<Home />} />
      <Route path={ROUTES.TODO_LIST} element={<TodoList />} />
      <Route path={ROUTES.RECIPES} element={<Recipes />} />
      <Route path={ROUTES.RECIPES_ADD} element={<AddRecipe />} />
      <Route path={ROUTES.RECIPE_DETAIL} element={<RecipeDetail />} />
      <Route path={ROUTES.THEME_SETTINGS} element={<ThemeSettingsPage />} />
      <Route path={ROUTES.SUDOKU} element={<SudokuPage />} />
      <Route path="*" element={<Navigate to={ROUTES.TODO_LIST} replace />} />
    </Route>
  </Routes>
);
