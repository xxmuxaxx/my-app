import { createContext, useContext } from "react";

import { ThemeContext } from "./types/theme";

const themeContext = createContext<ThemeContext | null>(null);

export const ThemeProvider = themeContext.Provider;

export const useThemeContext = () => {
  const context = useContext(themeContext);

  if (!context) {
    throw new Error("Use context inside ThemeProvider");
  }

  return context;
};
