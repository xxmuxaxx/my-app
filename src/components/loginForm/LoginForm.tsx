import { Button, Form, Input } from "antd";
import { FC } from "react";

export type LoginFormFilds = {
  username: string;
  password: string;
};

type LoginFormProps = {
  onFinish: (values: LoginFormFilds) => void;
};

export const LoginForm: FC<LoginFormProps> = ({ onFinish }) => {
  return (
    <Form<LoginFormFilds> size="large" layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Логин"
        name="username"
        rules={[{ required: true, message: "Обязательное поле!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: "Обязательное поле!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};
