export type TodoListState = {
  todos: Todo[];
};

export type Todo = {
  id: string;
  message: string;
  createDate: string;
  isCompleted: boolean;
};

export type TodoResponseDTO = {
  color: string | false;
  date: string;
  general: string;
  id: string;
  status: "0" | "1";
  text: string;
  user_id: string;
  user_login: string | false;
};
