import "./layout.scss";

import { Breadcrumb, Layout as AntLayout } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "../../constants";
import { NavMenu } from "../navMenu";
import { SettingsMenu } from "../settingsMenu";

const { Header, Content } = AntLayout;

const breadcrumbNameMap: Record<string, string> = {
  [ROUTES.RECIPES]: "layout.recipes",
  [ROUTES.RECIPES_ADD]: "layout.recipe-add",
  [ROUTES.TODO_LIST]: "layout.todo-list",
  [ROUTES.SUDOKU]: "layout.sudoku",
};

export const Layout: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
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
    <AntLayout className="layout">
      <Header className="layout__header">
        <NavMenu className="layout__nav-menu" />
        <SettingsMenu className="layout__settings" />
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
