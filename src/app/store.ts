import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { recipesReduces } from "../modules/recipes";
import { todoListReduces } from "../modules/todoList";

export const store = configureStore({
  reducer: {
    todoList: todoListReduces,
    recipes: recipesReduces,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
