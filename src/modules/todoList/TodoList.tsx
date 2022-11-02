import { Button, Input, Divider, List, Form, Space, Tag } from "antd";
import { useForm } from "antd/lib/form/Form";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
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
  const [form] = useForm();
  const todos = useAppSelector(selectTodos);

  return (
    <>
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
              ДОБАВИТЬ
            </Button>

            <Button
              type="primary"
              danger
              htmlType="button"
              onClick={() => {
                dispatch(resetTodos());
              }}
            >
              ОЧИСТИТЬ
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
                {todo.isCompleted ? "Не выполнено" : "Выполнено"}
              </Button>,
              <Button
                type="link"
                onClick={() => {
                  dispatch(deleteTodo(todo.id));
                }}
              >
                Удалить
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
