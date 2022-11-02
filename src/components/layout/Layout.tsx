import React, { FC } from "react";
import { Layout as AntLayout, Menu } from "antd";
import { HomeFilled } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants";

const { Header, Content } = AntLayout;
const { Item } = Menu;

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

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
        </Menu>
      </Header>
      <Content
        style={{
          margin: "24px auto",
          padding: "24px",
          width: "1200px",
          backgroundColor: "#fff",
        }}
      >
        {children}
      </Content>
    </AntLayout>
  );
};
