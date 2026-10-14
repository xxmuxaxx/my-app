import { ThemeConfig } from "antd";

export type Theme = NonNullable<ThemeConfig['token']>;

export type ThemeContext = {
  theme: Theme;
  changeTheme: (changes: Partial<Theme>) => void;
};
