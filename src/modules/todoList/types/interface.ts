export type TodoListState = {
  todos: Todo[];
};

export type Todo = {
  id: string;
  message: string;
  createDate: string;
  isCompleted: boolean;
};
