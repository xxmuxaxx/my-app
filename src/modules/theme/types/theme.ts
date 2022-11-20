export type Theme = {
  borderRadius?: number;
  colorPrimary?: string;
};

export type ThemeContext = {
  theme: Theme;
  changeTheme: (changes: Partial<Theme>) => void;
};
