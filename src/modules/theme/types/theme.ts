import { AliasToken } from "antd/es/theme";

export type Theme = Partial<AliasToken>;

export type ThemeContext = {
  theme: Theme;
  changeTheme: (changes: Partial<Theme>) => void;
};
