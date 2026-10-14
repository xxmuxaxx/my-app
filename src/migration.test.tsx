import "fake-indexeddb/auto";
import { createStore, clear } from "idb-keyval";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, expect, it, vi } from "vitest";
import App from "./App";
import { createAppStore, persistStore } from "./store";
import { loadLocalData } from "./storage/localData";
import { addRecipe, deleteRecipe } from "./modules/recipes/recipesSlice";
import {
  addTodo,
  toggleTodoIsCompleted,
  deleteTodo,
  resetTodos,
} from "./modules/todoList/todoListSlice";

beforeEach(async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  localStorage.clear();
  await clear(createStore("my-app-local", "data"));
});

it.each(["#/", "#/login", "#/registration"])(
  "opens tasks without login from %s and makes no API requests",
  async (hash) => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    window.location.hash = hash;
    render(
      <Provider store={createAppStore()}>
        <App />
      </Provider>,
    );
    expect(
      await screen.findByRole("heading", { name: "Список дел" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Выйти из системы")).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  },
);

it("persists rapid additions, completion, deletion and reset across a fresh store", async () => {
  const store = createAppStore(await loadLocalData());
  const onError = vi.fn();
  const persistence = persistStore(store, onError);
  store.dispatch(addTodo("First"));
  store.dispatch(addTodo("Second"));
  const [first, second] = store.getState().todoList.todos;
  expect(first.id).not.toBe(second.id);
  store.dispatch(toggleTodoIsCompleted(second.id));
  store.dispatch(deleteTodo(first.id));
  await persistence.flush();
  const reloaded = createAppStore(await loadLocalData());
  expect(reloaded.getState().todoList.todos).toEqual([
    { ...second, isCompleted: true },
  ]);
  store.dispatch(resetTodos());
  await persistence.flush();
  expect((await loadLocalData()).todos).toEqual([]);
  expect(onError).not.toHaveBeenCalled();
  persistence.unsubscribe();
});

it("migrates existing recipes and preserves changes after reload without resurrecting deleted recipes", async () => {
  const recipe = {
    id: "legacy",
    title: "Saved recipe",
    image: "",
    description: "",
    products: ["Rice"],
  };
  localStorage.setItem("recipes", JSON.stringify([recipe]));
  const store = createAppStore(await loadLocalData());
  expect(store.getState().recipes.recipes).toEqual([recipe]);
  const persistence = persistStore(store, vi.fn());
  store.dispatch(deleteRecipe("legacy"));
  store.dispatch(
    addRecipe({
      title: "New recipe",
      image: "",
      description: "",
      products: ["Beans"],
    }),
  );
  await persistence.flush();
  expect((await loadLocalData()).recipes.map((item) => item.title)).toEqual([
    "New recipe",
  ]);
  store.dispatch(deleteRecipe(store.getState().recipes.recipes[0].id));
  await persistence.flush();
  expect((await loadLocalData()).recipes).toEqual([]);
  expect(localStorage.getItem("recipes")).toBe(JSON.stringify([recipe]));
  persistence.unsubscribe();
});
