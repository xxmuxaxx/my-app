import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

import { RootState } from "../../app/store";
import { getRandomId } from "../../utils/getRandomId";
import { TodoListState } from "./types/interface";

const initialState: TodoListState = {
  todos: [],
};

const todoListSlice = createSlice({
  name: "todo-list",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.concat({
        id: getRandomId(),
        message: action.payload,
        createDate: moment().format("DD.MM.YYYY hh:mm"),
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
      state.todos = state.todos.map((todo) =>
        todo.id === action.payload
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      );
    },
  },
});

export const { addTodo, deleteTodo, resetTodos, toggleTodoIsCompleted } =
  todoListSlice.actions;

export const selectTodos = (state: RootState) => state.todoList.todos;

const { reducer } = todoListSlice;
export { reducer as todoListReduces };
