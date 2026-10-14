import { SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { FC, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "../../constants";
import { LanguageContext, Languages } from "../../modules/languageProvider";

const langLabels: Record<Languages, string> = {
  [Languages.russian]: "Русский",
  [Languages.english]: "English",
  [Languages.georgian]: "ქართული",
};

const langIconCodes: Record<Languages, string> = {
  [Languages.russian]: "ru",
  [Languages.english]: "us",
  [Languages.georgian]: "ge",
};

type SettingsMenuProps = {
  className?: string;
};

export const SettingsMenu: FC<SettingsMenuProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, changeLanguage } = useContext(LanguageContext);

  const items: MenuProps["items"] = [
    {
      key: "user",
      label: <SettingOutlined aria-label="Settings" />,
      children: [
        {
          key: "language",
          label: langLabels[language],
          icon: (
            <div>
              <span className={`fi fi-${langIconCodes[language]} fis`} />
            </div>
          ),
          children: [
            {
              key: Languages.russian,
              label: langLabels[Languages.russian],
              onClick: () => changeLanguage(Languages.russian),
            },
            {
              key: Languages.english,
              label: langLabels[Languages.english],
              onClick: () => changeLanguage(Languages.english),
            },
            {
              key: Languages.georgian,
              label: langLabels[Languages.georgian],
              onClick: () => changeLanguage(Languages.georgian),
            },
          ],
        },
        {
          key: "themeSettings",
          label: "Настройки темы",
          onClick: () => navigate(ROUTES.THEME_SETTINGS),
        },
      ],
    },
  ];

  return (
    <div className={className}>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={items}
      />
    </div>
  );
};
