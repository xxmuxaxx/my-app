import { Button } from "antd";
import { CSSProperties, FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { register, selectIsLoading } from "../appSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  RegistrationForm,
  RegistrationFormFilds,
} from "../components/registrationForm";
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

const Registration: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isLoading = useAppSelector(selectIsLoading);

  const onRegister = (data: RegistrationFormFilds) => {
    dispatch(register(data));
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyles}>
        <h1>{t("registration.title")}</h1>
        <RegistrationForm
          isLoading={isLoading}
          additionalButton={
            <Link to={ROUTES.LOGIN}>
              <Button type="link">{t("login.title")}</Button>
            </Link>
          }
          onFinish={onRegister}
        />
      </div>
    </div>
  );
};

export default Registration;
