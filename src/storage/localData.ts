import { createStore, get, set } from "idb-keyval";
import type { Recipe } from "../modules/recipes/types/interface";
import type { Todo } from "../modules/todoList/types/interface";
import { userStorage } from "../utils";

export type LocalData = { todos: Todo[]; recipes: Recipe[] };
const database = createStore("my-app-local", "data");
const key = "workspace";

export async function loadLocalData(): Promise<LocalData> {
  const saved = await get<LocalData>(key, database);
  if (saved) return saved;
  // Keep the original localStorage records as a backup after migration.
  const recipes = userStorage.get<Recipe[]>("recipes");
  const todos = userStorage.get<Todo[]>("todos");
  const migrated = {
    recipes: Array.isArray(recipes) ? recipes : [],
    todos: Array.isArray(todos) ? todos : [],
  };
  await saveLocalData(migrated);
  return migrated;
}

export function saveLocalData(data: LocalData): Promise<void> {
  return set(key, data, database);
}
