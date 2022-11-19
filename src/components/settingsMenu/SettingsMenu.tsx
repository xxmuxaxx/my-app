import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Menu, Modal } from "antd";
import { FC, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { logout, selectUser } from "../../appSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { LanguageContext, Languages } from "../../modules/languageProvider";

const langLabels: Record<Languages, string> = {
  [Languages.russian]: "Русский",
  [Languages.english]: "English",
  [Languages.georgian]: "ქართული",
};

type SettingsMenuProps = {
  className?: string;
};

export const SettingsMenu: FC<SettingsMenuProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const { language, changeLanguage } = useContext(LanguageContext);
  const langCode = language === "en" ? "us" : language;

  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: t("layout.logoutConfirm"),
      icon: <LogoutOutlined />,
      onOk() {
        dispatch(logout());
      },
    });
  }, [dispatch, t]);

  const items = useMemo(() => {
    return [
      {
        key: "user",
        label: <Avatar src={user?.avatar} shape="square" size="large" />,
        children: [
          {
            key: "language",
            label: langLabels[language],
            icon: <span className={`fi fi-${langCode} fis`} />,
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
            key: "loguot",
            label: t("layout.logout"),
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
          },
        ],
      },
    ];
  }, [changeLanguage, handleLogout, langCode, language, t, user?.avatar]);

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
