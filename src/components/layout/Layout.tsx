import React, { FC, useContext } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Layout as AntLayout, Menu, Tooltip } from "antd";
import { HomeFilled } from "@ant-design/icons";
import { LanguageContext, Languages } from "../../modules/languageProvider";
import { ROUTES } from "../../constants";

const { Header, Content } = AntLayout;

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
  const { t } = useTranslation();
  const location = useLocation();
  const { language, setLanguage } = useContext(LanguageContext);
  const pathSnippets = location.pathname.split("/").filter(Boolean);

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
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu
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
            {
              key: "language",
              label: langLabels[language],
              children: [
                {
                  key: "ru",
                  label: langLabels[Languages.russian],
                  onClick: () => setLanguage(Languages.russian),
                },
                {
                  key: "en",
                  label: langLabels[Languages.english],
                  onClick: () => setLanguage(Languages.english),
                },
                {
                  key: "ge",
                  label: langLabels[Languages.georgian],
                  onClick: () => setLanguage(Languages.georgian),
                },
              ],
            },
          ]}
        />
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
