import { RouteProps } from "react-router-dom";
import { ROUTES } from "../constants";
import { TodoList } from "../modules/todoList";

export const APP_ROUTES: RouteProps[] = [
  {
    index: true,
    element: <h1>Главная страница</h1>,
  },
  {
    path: ROUTES.TODO_LIST,
    element: <TodoList />,
  },
];
