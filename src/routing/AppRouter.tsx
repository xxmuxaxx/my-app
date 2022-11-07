import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/layout";
import { ROUTES } from "../constants";
import { AddRecipe, Recipes, RecipeDetail } from "../modules/recipes";
import { TodoList } from "../modules/todoList";
import { Login } from "../pages";
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
      </Route>
      <Route path={ROUTES.LOGIN} element={<Login />} />
    </Routes>
  );
};
