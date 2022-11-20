import { FC, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { selectUser } from "../appSlice";
import { ROUTES } from "../constants";
import { useAppSelector } from "../hooks";

type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const user = useAppSelector(selectUser);
  if (!user)
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} />;
  return children;
};
