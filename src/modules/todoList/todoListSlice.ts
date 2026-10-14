import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import type { RootState } from "../../store";
import { getRandomId } from "../../utils/getRandomId";
import type { TodoListState } from "./types/interface";

const initialState: TodoListState = { todos: [] };
const todoListSlice = createSlice({
  name: "todo-list",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: getRandomId(),
        message: action.payload,
        createDate: dayjs().format("DD.MM.YYYY HH:mm"),
        isCompleted: false,
      });
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    resetTodos: (state) => {
      state.todos = [];
    },
    toggleTodoIsCompleted: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((item) => item.id === action.payload);
      if (todo) todo.isCompleted = !todo.isCompleted;
    },
  },
});
export const { addTodo, deleteTodo, resetTodos, toggleTodoIsCompleted } =
  todoListSlice.actions;
export const selectTodos = (state: RootState) => state.todoList.todos;
export const todoListReduces = todoListSlice.reducer;
