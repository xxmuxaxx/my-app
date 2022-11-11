import { Button, Form, Input } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export type LoginFormFilds = {
  username: string;
  password: string;
};

type LoginFormProps = {
  isLoading: boolean;
  onFinish: (values: LoginFormFilds) => void;
};

export const LoginForm: FC<LoginFormProps> = ({ isLoading, onFinish }) => {
  const { t } = useTranslation();

  return (
    <Form<LoginFormFilds> size="large" layout="vertical" onFinish={onFinish}>
      <Form.Item
        label={t("login.username")}
        name="username"
        rules={[{ required: true, message: t("forms.requiredField") || "" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("login.password")}
        name="password"
        rules={[{ required: true, message: t("forms.requiredField") || "" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("login.login")}
        </Button>
      </Form.Item>
    </Form>
  );
};
