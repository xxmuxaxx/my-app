import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { recipesReducer } from "./modules/recipes/recipesSlice";
import { todoListReduces } from "./modules/todoList/todoListSlice";
import { saveLocalData, type LocalData } from "./storage/localData";

const reducer = combineReducers({
  todoList: todoListReduces,
  recipes: recipesReducer,
});
export function createAppStore(data?: LocalData) {
  const initial = reducer(undefined, { type: "@@init" });
  return configureStore({
    reducer,
    preloadedState: data
      ? {
          todoList: { todos: data.todos },
          recipes: { ...initial.recipes, recipes: data.recipes },
        }
      : initial,
  });
}

export function persistStore(
  store: AppStore,
  onError: (error: unknown) => void,
) {
  let previous = store.getState();
  let pending = Promise.resolve();
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    if (
      state.todoList.todos === previous.todoList.todos &&
      state.recipes.recipes === previous.recipes.recipes
    )
      return;
    previous = state;
    const data = {
      todos: state.todoList.todos,
      recipes: state.recipes.recipes,
    };
    // Serialize writes so rapid edits cannot overwrite newer data.
    pending = pending.then(() => saveLocalData(data)).catch(onError);
  });
  return { flush: () => pending, unsubscribe };
}

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
