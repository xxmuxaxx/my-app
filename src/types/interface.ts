export type AppState = {
  isLoading: boolean;
  user: User | null;
};

export type User = {
  name: string;
  avatar: string | null;
  isAdmin: boolean;
};

export type UserResponseDTO = {
  message: string;
  status: number;
  id: string;
  name: string;
  avatar: string | null;
  isAdmin: boolean;
};
