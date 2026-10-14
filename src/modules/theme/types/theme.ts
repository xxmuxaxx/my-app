export type ThemeMode = "light" | "dark" | "system";
export type Theme = {
  colorPrimary: string;
  borderRadius: number;
  fontSize: number;
};
export type ThemeSettingsState = { mode: ThemeMode; theme: Theme };
export type ThemeContext = ThemeSettingsState & {
  changeTheme: (changes: Partial<Theme>) => void;
  changeMode: (mode: ThemeMode) => void;
  resetTheme: () => void;
  saveError: boolean;
};
