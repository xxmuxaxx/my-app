import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Button, Divider, List, Tag } from "antd";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../hooks";
import { AddTodoForm } from "./components/addTodoForm";
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

  return (
    <>
      <h1>{t("todo-list.title")}</h1>
      <AddTodoForm
        onTodoAdd={(message) => dispatch(addTodo(message))}
        onTodosReset={() => dispatch(resetTodos())}
      />

      <Divider />

      <List
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            key={todo.id}
            actions={[
              <Button
                key="toggle"
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
                key="delete"
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
              description={
                <>
                  <Tag>{todo.createDate}</Tag>
                  {todo.user && <Tag color={todo.color}>{todo.user}</Tag>}
                </>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
