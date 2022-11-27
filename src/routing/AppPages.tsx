import { lazy } from "react";

export const LoginPage = lazy(() => import("../pages/Login"));
export const RegistrationPage = lazy(() => import("../pages/Registration"));

export const ThemeSettingsPage = lazy(() =>
  import("../modules/theme").then((module) => ({
    default: module.ThemeSettings,
  }))
);

export const SudokuPage = lazy(() =>
  import("../modules/sudoku").then((module) => ({
    default: module.Sudoku,
  }))
);
