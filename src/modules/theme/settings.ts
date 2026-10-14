import type { ThemeSettingsState } from "./types/theme";
export const defaultTheme: ThemeSettingsState = {
  mode: "light",
  theme: { colorPrimary: "#1677ff", borderRadius: 6, fontSize: 14 },
};
export function readTheme(): ThemeSettingsState {
  try {
    const saved = JSON.parse(localStorage.getItem("theme") ?? "null");
    if (!saved || typeof saved !== "object") return defaultTheme;
    // Migrate the original flat Ant Design token object.
    const tokens = saved.theme ?? saved;
    const range = (
      value: unknown,
      min: number,
      max: number,
      fallback: number,
    ) =>
      typeof value === "number" && Number.isFinite(value)
        ? Math.min(max, Math.max(min, value))
        : fallback;
    return {
      mode: ["light", "dark", "system"].includes(saved.mode)
        ? saved.mode
        : "light",
      theme: {
        colorPrimary:
          typeof tokens.colorPrimary === "string" &&
          /^#[\da-f]{6}$/i.test(tokens.colorPrimary)
            ? tokens.colorPrimary
            : defaultTheme.theme.colorPrimary,
        borderRadius: range(tokens.borderRadius, 0, 16, 6),
        fontSize: range(tokens.fontSize, 12, 18, 14),
      },
    };
  } catch {
    return defaultTheme;
  }
}
