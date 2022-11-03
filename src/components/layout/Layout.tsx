import React, { FC } from "react";
import { Breadcrumb, Layout as AntLayout, Menu } from "antd";
import { HomeFilled } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";

const { Header, Content } = AntLayout;
const { Item } = Menu;

const breadcrumbNameMap: Record<string, string> = {
  [ROUTES.RECIPES]: "Рецепты",
  [ROUTES.RECIPES_ADD]: "Добавление нового рецепта",
  [ROUTES.TODO_LIST]: "Todo List",
};

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const extraBreadcrumbItems = pathSnippets.map((path, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url] || path}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
          <Item key="/">
            <Link to="/">
              <HomeFilled />
            </Link>
          </Item>
          <Item key={ROUTES.TODO_LIST}>
            <Link to={ROUTES.TODO_LIST}>Todo List</Link>
          </Item>
          <Item key={ROUTES.RECIPES}>
            <Link to={ROUTES.RECIPES}>Рецепты</Link>
          </Item>
        </Menu>
      </Header>
      <Content>
        <div className="container">
          <Breadcrumb style={{ margin: "0 0 12px 0" }}>
            {breadcrumbItems}
          </Breadcrumb>
          {children}
        </div>
      </Content>
    </AntLayout>
  );
};
