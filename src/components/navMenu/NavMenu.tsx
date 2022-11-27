import { HomeFilled } from "@ant-design/icons";
import { Menu, Tooltip } from "antd";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { ROUTES } from "../../constants";

type NavMenuProps = {
  className?: string;
};

export const NavMenu: FC<NavMenuProps> = ({ className }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const selectedKey = location.pathname.split("/").slice(0, 2).join("/");

  const items = useMemo(() => {
    return [
      {
        key: ROUTES.INDEX,
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
        key: ROUTES.SUDOKU,
        label: <Link to={ROUTES.SUDOKU}>{t("layout.sudoku")}</Link>,
      },
    ];
  }, [t]);

  return (
    <Menu
      className={className}
      theme="dark"
      mode="horizontal"
      selectedKeys={[selectedKey]}
      items={items}
    />
  );
};
