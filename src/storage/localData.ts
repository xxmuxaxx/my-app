import { createStore, get, update } from "idb-keyval";
import type { Recipe } from "../modules/recipes/types/interface";
import type { Todo } from "../modules/todoList/types/interface";
import { userStorage } from "../utils";

export type LocalData = { todos: Todo[]; recipes: Recipe[] };
const database = createStore("my-app-local", "data");
const key = "workspace";

export async function loadLocalData(): Promise<LocalData> {
  const saved = await get<LocalData>(key, database);
  if (saved) return saved;
  const recipes = userStorage.get<Recipe[]>("recipes");
  const todos = userStorage.get<Todo[]>("todos");
  const migrated = {
    recipes: Array.isArray(recipes) ? recipes : [],
    todos: Array.isArray(todos) ? todos : [],
  };
  // Another tab may initialize the database while we read legacy data.
  await update<LocalData>(key, (current) => current ?? migrated, database);
  return (await get<LocalData>(key, database))!;
}

function mergeChanges<T extends { id: string }>(
  current: T[],
  before: T[],
  after: T[],
): T[] {
  const oldItems = new Map(before.map((item) => [item.id, item]));
  const newItems = new Map(after.map((item) => [item.id, item]));
  const removed = new Set(
    before.filter((item) => !newItems.has(item.id)).map((item) => item.id),
  );
  const changed = after.filter((item) => oldItems.get(item.id) !== item);
  const changes = new Map(changed.map((item) => [item.id, item]));
  const currentIds = new Set(current.map((item) => item.id));
  return current
    .filter((item) => !removed.has(item.id))
    .map((item) => changes.get(item.id) ?? item)
    .concat(
      changed.filter(
        (item) => !currentIds.has(item.id) && !oldItems.has(item.id),
      ),
    );
}

export function saveLocalChanges(
  before: LocalData,
  after: LocalData,
): Promise<void> {
  // Read and merge in one IndexedDB transaction, including across browser tabs.
  return update<LocalData>(
    key,
    (current = { todos: [], recipes: [] }) => ({
      todos: mergeChanges(current.todos, before.todos, after.todos),
      recipes: mergeChanges(current.recipes, before.recipes, after.recipes),
    }),
    database,
  );
}
