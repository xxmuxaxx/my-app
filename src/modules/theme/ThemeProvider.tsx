import { ConfigProvider } from "antd";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";

import { userStorage } from "../../utils";
import { ThemeProvider as Provider } from "./themeContext";
import { Theme } from "./types/theme";

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(userStorage.get("theme") || {});

  const changeTheme = useCallback((changes: Partial<Theme>) => {
    setTheme((currentTheme) => ({ ...currentTheme, ...changes }));
  }, []);

  useEffect(() => {
    userStorage.set("theme", theme);
  }, [theme]);

  return (
    <Provider value={{ theme, changeTheme }}>
      <ConfigProvider theme={{ token: theme }}>{children}</ConfigProvider>
    </Provider>
  );
};
