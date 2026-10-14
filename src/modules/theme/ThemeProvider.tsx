import { App, ConfigProvider, theme as antTheme } from "antd";
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type FC,
  type ReactNode,
} from "react";
import { ThemeProvider as Provider } from "./themeContext";
import type { Theme, ThemeMode } from "./types/theme";
import { defaultTheme, readTheme } from "./settings";

function ThemeSurface({
  children,
  dark,
}: {
  children: ReactNode;
  dark: boolean;
}) {
  const { token } = antTheme.useToken();
  const style = {
    color: token.colorText,
    colorScheme: dark ? "dark" : "light",
    "--app-text": token.colorText,
    "--app-muted": token.colorTextSecondary,
    "--app-bg": token.colorBgContainer,
    "--app-layout": token.colorBgLayout,
    "--app-border": token.colorBorder,
    "--app-border-secondary": token.colorBorderSecondary,
    "--app-fill": token.colorFillSecondary,
    "--app-primary": token.colorPrimary,
    "--app-primary-bg": token.colorPrimaryBg,
    "--app-primary-border": token.colorPrimaryBorder,
    "--app-error": token.colorError,
    "--app-error-bg": token.colorErrorBg,
    "--app-radius": `${token.borderRadiusLG}px`,
  } as CSSProperties;
  return <App style={style}>{children}</App>;
}

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(readTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
  );
  const [saveError, setSaveError] = useState(false);
  const changeTheme = useCallback((changes: Partial<Theme>) => {
    setSettings((current) => ({
      ...current,
      theme: { ...current.theme, ...changes },
    }));
  }, []);
  const changeMode = useCallback(
    (mode: ThemeMode) => setSettings((current) => ({ ...current, mode })),
    [],
  );
  const resetTheme = useCallback(() => setSettings(defaultTheme), []);
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const onChange = () => setSystemDark(query.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("theme", JSON.stringify(settings));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [settings]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === "theme" || event.key === null) setSettings(readTheme());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const dark =
    settings.mode === "dark" || (settings.mode === "system" && systemDark);
  return (
    <Provider
      value={{ ...settings, changeTheme, changeMode, resetTheme, saveError }}
    >
      <ConfigProvider
        theme={{
          token: settings.theme,
          algorithm: dark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        }}
      >
        <ThemeSurface dark={dark}>{children}</ThemeSurface>
      </ConfigProvider>
    </Provider>
  );
};
