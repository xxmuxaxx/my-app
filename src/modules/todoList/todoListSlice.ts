import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

import { setIsLoading } from "../../appSlice";
import { API_URL } from "../../constants";
import { RootState } from "../../store";
import { getRandomId } from "../../utils/getRandomId";
import { TodoListState, TodoResponseDTO } from "./types/interface";

const initialState: TodoListState = {
  todos: [],
};

export const fetchTodos = createAsyncThunk<TodoResponseDTO[]>(
  "todoList/fetchTodos",
  async (_, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const response = await axios.get(`${API_URL}/todos/`);
      return response.data;
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload.map((todo) => ({
        id: todo.id,
        message: todo.text,
        isCompleted: todo.status === "1" ? true : false,
        createDate: todo.date,
        user: todo.user_login || undefined,
        userId: todo.user_id || undefined,
        color: todo.color || undefined,
      }));
    });
  },
});

export const { addTodo, deleteTodo, resetTodos, toggleTodoIsCompleted } =
  todoListSlice.actions;

export const selectTodos = (state: RootState) => state.todoList.todos;

const { reducer } = todoListSlice;
export { reducer as todoListReduces };
