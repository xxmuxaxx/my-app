import "./themeSettings.scss";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Progress,
  Radio,
  Select,
  Slider,
  Space,
  Tag,
  Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../themeContext";
import type { ThemeMode } from "../types/theme";

const palettes = [
  { key: "blue", color: "#1677ff" },
  { key: "green", color: "#389e0d" },
  { key: "purple", color: "#722ed1" },
  { key: "orange", color: "#d46b08" },
  { key: "rose", color: "#c41d7f" },
];

export const ThemeSettings = () => {
  const { t } = useTranslation();
  const { theme, mode, changeTheme, changeMode, resetTheme, saveError } =
    useThemeContext();
  return (
    <section className="theme-settings">
      <h1>{t("theme.title")}</h1>
      <p className="theme-settings__description">{t("theme.description")}</p>
      {saveError && (
        <Alert type="error" showIcon title={t("theme.saveError")} />
      )}
      <div className="theme-settings__columns">
        <Card title={t("theme.appearance")}>
          <Form layout="vertical">
            <Form.Item label={t("theme.mode")}>
              <Radio.Group
                value={mode}
                onChange={(event) =>
                  changeMode(event.target.value as ThemeMode)
                }
                options={(["light", "dark", "system"] as ThemeMode[]).map(
                  (value) => ({ value, label: t(`theme.${value}`) }),
                )}
              />
            </Form.Item>
            <Form.Item label={t("theme.palettes")}>
              <div className="theme-settings__palettes">
                {palettes.map((palette) => (
                  <Button
                    key={palette.key}
                    aria-pressed={
                      theme.colorPrimary.toLowerCase() === palette.color
                    }
                    onClick={() => changeTheme({ colorPrimary: palette.color })}
                  >
                    <span
                      className="theme-settings__swatch"
                      style={{ background: palette.color }}
                    />
                    {t(`theme.${palette.key}`)}
                  </Button>
                ))}
              </div>
            </Form.Item>
            <Form.Item label={t("theme.primaryColor")}>
              <ColorPicker
                value={theme.colorPrimary}
                disabledAlpha
                format="hex"
                onChange={(color) =>
                  changeTheme({ colorPrimary: color.toHexString() })
                }
              >
                <Button aria-label={t("theme.primaryColor")}>
                  <span
                    className="theme-settings__swatch"
                    style={{ background: theme.colorPrimary }}
                  />
                  {theme.colorPrimary.toUpperCase()}
                </Button>
              </ColorPicker>
            </Form.Item>
            <Form.Item label={t("theme.radius")}>
              <div className="theme-settings__range">
                <Slider
                  min={0}
                  max={16}
                  value={theme.borderRadius}
                  onChange={(value) => changeTheme({ borderRadius: value })}
                  aria-label={t("theme.radius")}
                />
                <InputNumber
                  aria-label={t("theme.radius")}
                  min={0}
                  max={16}
                  value={theme.borderRadius}
                  onChange={(value) => {
                    if (value !== null) changeTheme({ borderRadius: value });
                  }}
                  suffix="px"
                />
              </div>
            </Form.Item>
            <Form.Item label={t("theme.fontSize")}>
              <div className="theme-settings__range">
                <Slider
                  min={12}
                  max={18}
                  value={theme.fontSize}
                  onChange={(value) => changeTheme({ fontSize: value })}
                  aria-label={t("theme.fontSize")}
                />
                <InputNumber
                  aria-label={t("theme.fontSize")}
                  min={12}
                  max={18}
                  value={theme.fontSize}
                  onChange={(value) => {
                    if (value !== null) changeTheme({ fontSize: value });
                  }}
                  suffix="px"
                />
              </div>
            </Form.Item>
          </Form>
          <Button onClick={resetTheme}>{t("theme.reset")}</Button>
          <p className="theme-settings__description">{t("theme.autoSave")}</p>
        </Card>
        <Card title={t("theme.preview")}>
          <Typography.Title level={3}>
            {t("theme.previewTitle")}
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            {t("theme.previewDescription")}
          </Typography.Paragraph>
          <Space wrap>
            <Tag color="success">{t("theme.success")}</Tag>
            <Tag color="processing">{t("theme.inProgress")}</Tag>
            <Tag color="warning">{t("theme.warning")}</Tag>
          </Space>
          <div className="theme-settings__preview">
            <Space wrap>
              <Button type="primary">{t("theme.primaryButton")}</Button>
              <Button>{t("theme.secondaryButton")}</Button>
              <Button danger>{t("actions.delete")}</Button>
            </Space>
            <Input
              aria-label={t("theme.sampleInput")}
              placeholder={t("theme.sampleInput")}
            />
            <Select
              aria-label={t("theme.sampleSelect")}
              defaultValue="first"
              options={[
                { value: "first", label: t("theme.firstOption") },
                { value: "second", label: t("theme.secondOption") },
              ]}
            />
            <Checkbox defaultChecked>{t("theme.sampleCheckbox")}</Checkbox>
            <Progress percent={65} />
            <Alert type="info" showIcon title={t("theme.previewNotice")} />
          </div>
        </Card>
      </div>
    </section>
  );
};
