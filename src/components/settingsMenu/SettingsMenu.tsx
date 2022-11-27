import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Menu, Modal } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { logout, selectUser } from "../../appSlice";
import { ROUTES } from "../../constants";
import { useAppDispatch, useAppSelector } from "../../hooks";
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
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { language, changeLanguage } = useContext(LanguageContext);

  const handleLogout = () => {
    Modal.confirm({
      title: t("layout.logoutConfirm"),
      icon: <LogoutOutlined />,
      onOk() {
        dispatch(logout());
      },
    });
  };

  const items: ItemType[] = [
    {
      key: "user",
      label: <Avatar src={user?.avatar} shape="square" size="large" />,
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
        {
          key: "loguot",
          label: t("layout.logout"),
          icon: <LogoutOutlined />,
          danger: true,
          onClick: handleLogout,
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
