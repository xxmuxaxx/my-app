import { Routes, Route } from "react-router-dom";
import { APP_ROUTES } from "./appRoutes";

export const AppRouter = () => {
  return (
    <Routes>
      {APP_ROUTES.map((route) => (
        <Route key={Math.random()} {...route} />
      ))}
    </Routes>
  );
};
