import { MinusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import type { AddRecipeDTO } from "../../types/interface";

type AddRecipeFormProps = {
  width?: number;
  initialValues?: Partial<AddRecipeDTO>;
  onFinish: (values: AddRecipeDTO) => void;
  onChange?: (values: AddRecipeDTO) => void;
};

export const AddRecipeForm: FC<AddRecipeFormProps> = ({
  width,
  initialValues,
  onFinish,
  onChange,
}) => {
  const { t } = useTranslation();

  const onValuesChange = (_: any, values: AddRecipeDTO) => {
    onChange && onChange(values);
  };

  return (
    <Form<AddRecipeDTO>
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={initialValues}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      autoComplete="off"
      style={{ width }}
    >
      <Form.Item
        label={t("recipes.title")}
        name="title"
        rules={[
          { required: true, message: t("forms.requiredField") as string },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t("recipes.description")} name="description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label={t("recipes.image")}
        name="image"
        rules={[
          { required: true, message: t("forms.requiredField") as string },
          { type: "url", message: t("forms.invalidUrl") as string },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.List name="products">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...field}
                {...(index !== 0 && { wrapperCol: { offset: 8, span: 16 } })}
                key={field.key}
                label={index === 0 ? t("recipes.products") : ""}
                rules={[
                  {
                    required: true,
                    message: t("forms.requiredField") as string,
                  },
                ]}
              >
                <Input
                  addonAfter={
                    fields.length > 1 ? (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    ) : null
                  }
                />
              </Form.Item>
            ))}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="dashed" onClick={() => add()}>
                {t("recipes.add-product")}
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {t("actions.add")}
        </Button>
      </Form.Item>
    </Form>
  );
};
