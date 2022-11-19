import { Button, Form, Input, Row } from "antd";
import { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";

export type RegistrationFormFilds = {
  username: string;
  password: string;
  confirm: string;
};

type RegistrationFormProps = {
  isLoading?: boolean;
  additionalButton?: ReactElement;
  onFinish?: (values: RegistrationFormFilds) => void;
};

export const RegistrationForm: FC<RegistrationFormProps> = ({
  isLoading,
  additionalButton,
  onFinish,
}) => {
  const { t } = useTranslation();

  return (
    <Form<RegistrationFormFilds>
      size="large"
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label={t("registration.username")}
        name="username"
        rules={[{ required: true, message: t("forms.requiredField") || "" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("registration.password")}
        name="password"
        rules={[{ required: true, message: t("forms.requiredField") || "" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label={t("registration.passwordConfirm")}
        name="confirm"
        dependencies={["password"]}
        rules={[
          { required: true, message: t("forms.requiredField") || "" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t("registration.errorConfirm")));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Row justify="space-between">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {t("registration.title")}
          </Button>

          {additionalButton}
        </Row>
      </Form.Item>
    </Form>
  );
};
