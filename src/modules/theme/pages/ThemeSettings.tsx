import { Form, Input, Slider } from "antd";

import { useThemeContext } from "../themeContext";

export const ThemeSettings = () => {
  const { theme, changeTheme } = useThemeContext();

  return (
    <Form layout="vertical">
      <Form.Item label="borderRadius">
        <Slider
          min={0}
          max={8}
          value={theme.borderRadius}
          onChange={(value) => changeTheme({ borderRadius: value })}
        />
      </Form.Item>

      <Form.Item label="colorPrimary">
        <Input
          type="color"
          value={theme.colorPrimary}
          onChange={(e) => changeTheme({ colorPrimary: e.target.value })}
        />
      </Form.Item>
    </Form>
  );
};
