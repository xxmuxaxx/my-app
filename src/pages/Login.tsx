import { CSSProperties, FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../app/appSlice";
import { useAppDispatch } from "../app/hooks";
import { LoginForm } from "../components/loginForm";
import type { LoginFormFilds } from "../components/loginForm/LoginForm";
import { ROUTES } from "../constants";

const wrapperStyle: CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: "#cecece",
};

const cardStyles: CSSProperties = {
  margin: "auto",
  padding: 24,
  minWidth: 600,
  background: "#fff",
  borderRadius: 4,
};

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const onLogin = ({ username, password }: LoginFormFilds) => {
    dispatch(login({ username, password }))
      .unwrap()
      .then(({ status }) => {
        if (status === 1) {
          navigate(location.state.from || ROUTES.INDEX);
        }
      });
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyles}>
        <h1>Войти в систему</h1>
        <div>
          <LoginForm onFinish={onLogin} />
        </div>
      </div>
    </div>
  );
};
