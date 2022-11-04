import React, { FC } from "react";
import { Breadcrumb, Layout as AntLayout, Menu } from "antd";
import { HomeFilled } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";

const { Header, Content } = AntLayout;

const breadcrumbNameMap: Record<string, string> = {
  [ROUTES.RECIPES]: "Рецепты",
  [ROUTES.RECIPES_ADD]: "Добавление нового рецепта",
  [ROUTES.TODO_LIST]: "Todo List",
};

const menuItems = [
  {
    key: "/",
    label: <Link to="/" children={<HomeFilled />} />,
  },
  {
    key: ROUTES.TODO_LIST,
    label: <Link to={ROUTES.TODO_LIST}>Todo List</Link>,
  },
  {
    key: ROUTES.RECIPES,
    label: <Link to={ROUTES.RECIPES}>Рецепты</Link>,
  },
];

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
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
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
