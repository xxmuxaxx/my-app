import {
  Action,
  combineReducers,
  configureStore,
  createAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { recipesReducer } from "./modules/recipes/recipesSlice";
import { todoListReduces } from "./modules/todoList/todoListSlice";
import {
  loadLocalData,
  saveLocalChanges,
  type LocalData,
} from "./storage/localData";

const combinedReducer = combineReducers({
  todoList: todoListReduces,
  recipes: recipesReducer,
});
const syncLocalData = createAction<LocalData>("storage/sync");
const reducer: typeof combinedReducer = (state, action) => {
  const next = combinedReducer(state, action);
  if (!syncLocalData.match(action)) return next;
  return {
    ...next,
    todoList: { todos: action.payload.todos },
    recipes: { ...next.recipes, recipes: action.payload.recipes },
  };
};
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
  let syncing = false;
  let revision = 0;
  const channel =
    typeof BroadcastChannel === "undefined"
      ? undefined
      : new BroadcastChannel("my-app-local");
  const refresh = () => {
    const expected = revision;
    pending = pending
      .then(async () => {
        const data = await loadLocalData();
        if (revision !== expected) return;
        syncing = true;
        try {
          store.dispatch(syncLocalData(data));
        } finally {
          syncing = false;
        }
      })
      .catch(onError);
  };
  if (channel) channel.onmessage = refresh;
  const onVisibility = () => {
    if (document.visibilityState === "visible") refresh();
  };
  if (typeof document !== "undefined")
    document.addEventListener("visibilitychange", onVisibility);
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    if (syncing) {
      previous = state;
      return;
    }
    if (
      state.todoList.todos === previous.todoList.todos &&
      state.recipes.recipes === previous.recipes.recipes
    )
      return;
    const before = {
      todos: previous.todoList.todos,
      recipes: previous.recipes.recipes,
    };
    previous = state;
    revision += 1;
    const data = {
      todos: state.todoList.todos,
      recipes: state.recipes.recipes,
    };
    // Serialize writes so rapid edits cannot overwrite newer data.
    pending = pending
      .then(async () => {
        await saveLocalChanges(before, data);
        channel?.postMessage("changed");
      })
      .catch(onError);
  });
  refresh();
  return {
    flush: () => pending,
    unsubscribe: () => {
      unsubscribe();
      channel?.close();
      if (typeof document !== "undefined")
        document.removeEventListener("visibilitychange", onVisibility);
    },
  };
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
