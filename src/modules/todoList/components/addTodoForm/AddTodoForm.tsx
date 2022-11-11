import { Button, Form, Input, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const { Item } = Form;

type AddTodoFormProps = {
  onTodoAdd: (message: string) => void;
  onTodosReset: () => void;
};

export const AddTodoForm: FC<AddTodoFormProps> = ({
  onTodoAdd,
  onTodosReset,
}) => {
  const { t } = useTranslation();

  const [form] = useForm();

  return (
    <Form
      form={form}
      initialValues={{ message: "" }}
      onFinish={({ message }) => {
        onTodoAdd(message);
        form.resetFields();
      }}
    >
      <Item name="message" rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {t("actions.add")}
          </Button>

          <Button
            type="primary"
            danger
            htmlType="button"
            onClick={onTodosReset}
          >
            {t("actions.clear")}
          </Button>
        </Space>
      </Item>
    </Form>
  );
};
