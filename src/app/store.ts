import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { todoListReduces } from "../modules/todoList";

export const store = configureStore({
  reducer: {
    todoList: todoListReduces,
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
