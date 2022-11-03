import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants";
import { AddRecipe, Recipes } from "../modules/recipes";
import { TodoList } from "../modules/todoList";

export const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<h1>Главная страница</h1>} />
      <Route path={ROUTES.TODO_LIST} element={<TodoList />} />
      <Route path={ROUTES.RECIPES} element={<Recipes />} />
      <Route path={ROUTES.RECIPES_ADD} element={<AddRecipe />} />
    </Routes>
  );
};
