import { Input, Slider, Space } from "antd";

import { useThemeContext } from "../themeContext";

export const ThemeSettings = () => {
  const { theme, changeTheme } = useThemeContext();

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Slider
        min={0}
        max={8}
        value={theme.borderRadius}
        onChange={(value) => changeTheme({ borderRadius: value })}
      />

      <Input
        type="color"
        value={theme.colorPrimary}
        onChange={(e) => changeTheme({ colorPrimary: e.target.value })}
      />
    </Space>
  );
};
