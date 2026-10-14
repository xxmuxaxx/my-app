import "fake-indexeddb/auto";
import userEvent from "@testing-library/user-event";
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
      await screen.findByRole("heading", {
        name: hash === "#/" ? "Главная" : "Список дел",
        level: 1,
      }),
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

it("preserves concurrent changes from stale tabs without restoring deleted data", async () => {
  const initial = await loadLocalData();
  const first = createAppStore(initial);
  const second = createAppStore(initial);
  const p1 = persistStore(first, vi.fn());
  const p2 = persistStore(second, vi.fn());
  first.dispatch(addTodo("Tab A"));
  second.dispatch(addTodo("Tab B"));
  second.dispatch(
    addRecipe({
      title: "Recipe B",
      image: "",
      description: "",
      products: ["Rice"],
    }),
  );
  await Promise.all([p1.flush(), p2.flush()]);
  let saved = await loadLocalData();
  expect(saved.todos.map((item) => item.message).sort()).toEqual([
    "Tab A",
    "Tab B",
  ]);
  expect(saved.recipes.map((item) => item.title)).toEqual(["Recipe B"]);
  await vi.waitFor(() =>
    expect(first.getState().recipes.recipes).toHaveLength(1),
  );
  await vi.waitFor(() =>
    expect(second.getState().todoList.todos).toHaveLength(2),
  );
  const id = first
    .getState()
    .todoList.todos.find((item) => item.message === "Tab A")!.id;
  first.dispatch(deleteTodo(id));
  second.dispatch(addTodo("Tab B later"));
  await Promise.all([p1.flush(), p2.flush()]);
  saved = await loadLocalData();
  expect(saved.todos.map((item) => item.message).sort()).toEqual([
    "Tab B",
    "Tab B later",
  ]);
  p1.unsubscribe();
  p2.unsubscribe();
});

it("does not resurrect a deleted task when a stale tab toggles it", async () => {
  const seed = createAppStore(await loadLocalData());
  const ps = persistStore(seed, vi.fn());
  seed.dispatch(addTodo("Remove me"));
  await ps.flush();
  ps.unsubscribe();
  const initial = await loadLocalData();
  const first = createAppStore(initial);
  const second = createAppStore(initial);
  const p1 = persistStore(first, vi.fn());
  const p2 = persistStore(second, vi.fn());
  first.dispatch(deleteTodo(initial.todos[0].id));
  second.dispatch(toggleTodoIsCompleted(initial.todos[0].id));
  await Promise.all([p1.flush(), p2.flush()]);
  expect((await loadLocalData()).todos).toEqual([]);
  p1.unsubscribe();
  p2.unsubscribe();
});

it("submitting a recipe opens the list and clears the form for the next recipe", async () => {
  const store = createAppStore();
  window.location.hash = "#/recipes/add";
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Название блюда"), "Rice recipe");
  await user.type(
    screen.getByLabelText("URL картинки"),
    "https://example.com/rice.png",
  );
  await user.type(screen.getByLabelText("Продукты"), "Rice");
  await user.click(screen.getByRole("button", { name: /^Добавить$/ }));
  expect(
    await screen.findByRole("heading", { name: "Рецепты" }),
  ).toBeInTheDocument();
  expect(store.getState().recipes.recipes).toHaveLength(1);
  await user.click(
    screen.getByRole("button", { name: "Добавить новый рецепт" }),
  );
  expect(await screen.findByLabelText("Название блюда")).toHaveValue("");
  expect(screen.getByLabelText("Продукты")).toHaveValue("");
});

it("shows the translated message for an unknown recipe", async () => {
  window.location.hash = "#/recipes/nonexistent";
  render(
    <Provider store={createAppStore()}>
      <App />
    </Provider>,
  );
  expect(await screen.findByText("Рецепт не найден")).toBeInTheDocument();
  expect(screen.queryByText("recipe-not-found")).not.toBeInTheDocument();
});

it("shows local task counts on the home page and opens the selected section", async () => {
  const store = createAppStore();
  store.dispatch(addTodo("Finish report"));
  store.dispatch(addTodo("Done task"));
  store.dispatch(toggleTodoIsCompleted(store.getState().todoList.todos[1].id));
  window.location.hash = "#/";
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  expect(
    await screen.findByRole("heading", { name: "Главная", level: 1 }),
  ).toBeInTheDocument();
  expect(screen.getByText("Выполнено 1 из 2")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Finish report" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Done task")).not.toBeInTheDocument();
  const user = userEvent.setup();
  await user.click(screen.getByRole("link", { name: "Открыть задачи" }));
  expect(
    await screen.findByRole("heading", { name: "Список дел", level: 1 }),
  ).toBeInTheDocument();
  await user.click(
    screen.getAllByRole("link", { name: "Главная" })[0],
  );
  expect(
    await screen.findByRole("heading", { name: "Главная", level: 1 }),
  ).toBeInTheDocument();
});
