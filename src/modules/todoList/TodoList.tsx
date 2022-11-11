import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Button, Divider, List, Tag } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { selectIsLoading } from "../../app/appSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AddTodoForm } from "./components/addTodoForm";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  resetTodos,
  selectTodos,
  toggleTodoIsCompleted,
} from "./todoListSlice";

export const TodoList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isLoading = useAppSelector(selectIsLoading);
  const todos = useAppSelector(selectTodos);

  useEffect(() => {
    dispatch(fetchTodos());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        loading={isLoading}
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
