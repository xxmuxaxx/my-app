import "./layout.scss";

import { HomeFilled, LogoutOutlined } from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Layout as AntLayout,
  Menu,
  Modal,
  Tooltip,
} from "antd";
import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";

import { logout, selectUser } from "../../app/appSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ROUTES } from "../../constants";
import { LanguageContext, Languages } from "../../modules/languageProvider";

const { Header, Content } = AntLayout;
const { confirm } = Modal;

const breadcrumbNameMap: Record<string, string> = {
  [ROUTES.RECIPES]: "layout.recipes",
  [ROUTES.RECIPES_ADD]: "layout.recipe-add",
  [ROUTES.TODO_LIST]: "layout.todo-list",
};

const langLabels: Record<Languages, string> = {
  [Languages.russian]: "Русский",
  [Languages.english]: "English",
  [Languages.georgian]: "ქართული",
};

export const Layout: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const { language, changeLanguage } = useContext(LanguageContext);
  const pathSnippets = location.pathname.split("/").filter(Boolean);
  const langCode = language === "en" ? "us" : language;

  const extraBreadcrumbItems = pathSnippets.map((path, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{t(breadcrumbNameMap[url]) || path}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">{t("layout.home")}</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <AntLayout className="layout">
      <Header className="layout__header">
        <Menu
          className="layout__nav-menu"
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: "/",
              label: (
                <Tooltip title={t("layout.home")}>
                  <Link to="/" children={<HomeFilled />} />
                </Tooltip>
              ),
            },
            {
              key: ROUTES.TODO_LIST,
              label: <Link to={ROUTES.TODO_LIST}>{t("layout.todo-list")}</Link>,
            },
            {
              key: ROUTES.RECIPES,
              label: <Link to={ROUTES.RECIPES}>{t("layout.recipes")}</Link>,
            },
          ]}
        />

        <div className="layout__settings">
          <Menu
            className="layout__settings-menu"
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={[
              {
                key: "user",
                label: (
                  <Avatar src={user?.avatar} shape="square" size="large" />
                ),
                children: [
                  {
                    key: "language",
                    label: langLabels[language],
                    icon: <span className={`fi fi-${langCode} fis`} />,
                    children: [
                      {
                        key: "ru",
                        label: langLabels[Languages.russian],
                        onClick: () => changeLanguage(Languages.russian),
                      },
                      {
                        key: "en",
                        label: langLabels[Languages.english],
                        onClick: () => changeLanguage(Languages.english),
                      },
                      {
                        key: "ge",
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
                    onClick: () => {
                      confirm({
                        title: t("layout.logoutConfirm"),
                        icon: <LogoutOutlined />,
                        onOk() {
                          dispatch(logout());
                        },
                      });
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </Header>
      <Content>
        <div className="container">
          <Breadcrumb style={{ margin: "0 0 12px 0" }}>
            {breadcrumbItems}
          </Breadcrumb>
          <Outlet />
        </div>
      </Content>
    </AntLayout>
  );
};
