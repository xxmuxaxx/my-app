import { FC } from "react";
import { Button, Form, Input } from "antd";
import type { AddRecipeDTO } from "../../types/interface";
import { MinusCircleOutlined } from "@ant-design/icons";

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
        label="Название блюда"
        name="title"
        rules={[{ required: true, message: "Обязательное поле!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Краткое описание" name="description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="URL картинки"
        name="image"
        rules={[
          { required: true, message: "Обязательное поле!" },
          { type: "url", message: "Не валидный url" },
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
                label={index === 0 ? "Продукты" : ""}
                rules={[{ required: true, message: "Обязательное поле!" }]}
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
                Добавить продукт
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Создать
        </Button>
      </Form.Item>
    </Form>
  );
};
