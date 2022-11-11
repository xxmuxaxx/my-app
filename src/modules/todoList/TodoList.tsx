import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Button, Divider, Form, Input, List, Space, Tag } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addTodo,
  deleteTodo,
  resetTodos,
  selectTodos,
  toggleTodoIsCompleted,
} from "./todoListSlice";

export const TodoList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const todos = useAppSelector(selectTodos);
  const [form] = useForm();

  return (
    <>
      <h1>{t("todo-list.title")}</h1>
      <Form
        form={form}
        initialValues={{ message: "" }}
        onFinish={({ message }) => {
          dispatch(addTodo(message));
          form.resetFields();
        }}
      >
        <Form.Item name="message" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {t("actions.add")}
            </Button>

            <Button
              type="primary"
              danger
              htmlType="button"
              onClick={() => {
                dispatch(resetTodos());
              }}
            >
              {t("actions.clear")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
      <List
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            key={todo.id}
            actions={[
              <Button
                type="link"
                onClick={() => {
                  dispatch(toggleTodoIsCompleted(todo.id));
                }}
              >
                {todo.isCompleted
                  ? t("todo-list.done")
                  : t("todo-list.not-done")}
              </Button>,
              <Button
                type="link"
                onClick={() => {
                  dispatch(deleteTodo(todo.id));
                }}
              >
                {t("actions.delete")}
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                todo.isCompleted ? (
                  <CheckCircleFilled style={{ color: "green", fontSize: 20 }} />
                ) : (
                  <CloseCircleFilled style={{ color: "red", fontSize: 20 }} />
                )
              }
              title={todo.message}
              description={<Tag>{todo.createDate}</Tag>}
            />
          </List.Item>
        )}
      />
    </>
  );
};
