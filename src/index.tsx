import "./index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { createAppStore, persistStore } from "./store";
import { loadLocalData } from "./storage/localData";

const root = createRoot(document.getElementById("root")!);
root.render(<p role="status">Загрузка локальных данных…</p>);

async function start() {
  try {
    const store = createAppStore(await loadLocalData());
    persistStore(store, () => {
      // Keep unsaved data visible and make a failed disk write explicit.
      const warning =
        document.getElementById("storage-warning") ??
        document.createElement("div");
      warning.id = "storage-warning";
      warning.setAttribute("role", "alert");
      warning.textContent =
        "Не удалось сохранить данные в браузере. Не закрывайте страницу: проверьте свободное место и разрешения хранилища.";
      warning.style.cssText =
        "position:fixed;bottom:0;left:0;right:0;padding:16px;background:#fff1f0;color:#a8071a;z-index:9999";
      document.body.append(warning);
    });
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
    );
  } catch {
    root.render(
      <div role="alert">
        <p>
          Не удалось открыть локальное хранилище. Проверьте разрешения браузера
          и повторите попытку.
        </p>
        <button onClick={() => window.location.reload()}>Повторить</button>
      </div>,
    );
  }
}
void start();
