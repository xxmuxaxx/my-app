import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Button, Divider, List, Tag } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { selectIsLoading, selectUser } from "../../app/appSlice";
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
  const user = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

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
            actions={
              user?.id === todo.userId
                ? [
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
                  ]
                : undefined
            }
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
