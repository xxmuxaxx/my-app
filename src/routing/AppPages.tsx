import { lazy } from "react";

export const ThemeSettingsPage = lazy(() =>
  import("../modules/theme/pages/ThemeSettings").then((module) => ({
    default: module.ThemeSettings,
  })),
);

export const SudokuPage = lazy(() =>
  import("../modules/sudoku").then((module) => ({
    default: module.Sudoku,
  })),
);
