import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import "../languageProvider/i18n";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeSettings } from "./pages/ThemeSettings";
import { defaultTheme, readTheme } from "./settings";

let media: {
  matches: boolean;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};
beforeEach(() => {
  localStorage.clear();
  media = {
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) =>
      query === "(prefers-color-scheme: dark)"
        ? media
        : {
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          },
    ),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
});
const renderSettings = () =>
  render(
    <ThemeProvider>
      <ThemeSettings />
    </ThemeProvider>,
  );

it("migrates old tokens and falls back safely for invalid saved settings", () => {
  localStorage.setItem(
    "theme",
    JSON.stringify({ colorPrimary: "#722ed1", borderRadius: 0 }),
  );
  expect(readTheme()).toEqual({
    mode: "light",
    theme: { colorPrimary: "#722ed1", borderRadius: 0, fontSize: 14 },
  });
  localStorage.setItem("theme", "{broken");
  expect(readTheme()).toEqual(defaultTheme);
  localStorage.setItem(
    "theme",
    JSON.stringify({
      mode: "invalid",
      theme: { colorPrimary: "invalid", borderRadius: 999, fontSize: 1 },
    }),
  );
  expect(readTheme()).toEqual({
    mode: "light",
    theme: { colorPrimary: "#1677ff", borderRadius: 16, fontSize: 12 },
  });
});

it("applies, persists and restores appearance, palette, corners and typography", async () => {
  const user = userEvent.setup();
  const view = renderSettings();
  await user.click(screen.getByRole("radio", { name: "Тёмная" }));
  await user.click(screen.getByRole("button", { name: "Фиолетовая" }));
  const radius = screen.getByRole("spinbutton", { name: "Скругление углов" });
  await user.clear(radius);
  await user.type(radius, "12");
  await user.tab();
  const font = screen.getByRole("spinbutton", { name: "Размер текста" });
  await user.clear(font);
  await user.type(font, "16");
  await user.tab();
  expect(readTheme()).toEqual({
    mode: "dark",
    theme: { colorPrimary: "#722ed1", borderRadius: 12, fontSize: 16 },
  });
  expect(document.querySelector(".ant-app")).toHaveStyle({
    colorScheme: "dark",
  });
  expect(document.querySelector(".ant-app")?.getAttribute("style")).toContain(
    "--app-bg",
  );
  view.unmount();
  renderSettings();
  expect(screen.getByRole("radio", { name: "Тёмная" })).toBeChecked();
  expect(screen.getByRole("button", { name: "Фиолетовая" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("spinbutton", { name: "Размер текста" })).toHaveValue(
    "16",
  );
  await user.click(screen.getByRole("button", { name: "Сбросить настройки" }));
  await waitFor(() => expect(readTheme()).toEqual(defaultTheme));
  expect(screen.getByRole("radio", { name: "Светлая" })).toBeChecked();
});

it("responds to system appearance changes and theme updates in other tabs", async () => {
  const user = userEvent.setup();
  renderSettings();
  await user.click(screen.getByRole("radio", { name: "Как в системе" }));
  const listener = media.addEventListener.mock.calls.find(
    ([event]) => event === "change",
  )![1];
  act(() => {
    media.matches = true;
    listener();
  });
  expect(document.querySelector(".ant-app")).toHaveStyle({
    colorScheme: "dark",
  });
  act(() => {
    localStorage.setItem("theme", JSON.stringify(defaultTheme));
    window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
  });
  expect(screen.getByRole("radio", { name: "Светлая" })).toBeChecked();
  expect(document.querySelector(".ant-app")).toHaveStyle({
    colorScheme: "light",
  });
});
