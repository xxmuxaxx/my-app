import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { appReducer } from "./appSlice";
import { recipesReducer } from "../modules/recipes";
import { todoListReduces } from "../modules/todoList";

export const store = configureStore({
  reducer: {
    app: appReducer,
    todoList: todoListReduces,
    recipes: recipesReducer,
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
