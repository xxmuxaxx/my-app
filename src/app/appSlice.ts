import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL } from "../constants";
import { AppState, UserResponseDTO } from "../types/interface";
import { userStorage } from "../utils";
import { RootState } from "./store";

const initialState: AppState = {
  isLoading: false,
  user: userStorage.get("user") || null,
};

type LoginProps = { username: string; password: string };
export const login = createAsyncThunk<UserResponseDTO, LoginProps>(
  "app/login",
  async ({ username, password }) => {
    const response = await axios.get<UserResponseDTO>(
      `${API_URL}/users/?u=${username}&p=${password}`
    );
    return response.data;
  }
);

// TODO это надо бы доделать
type RegisterProps = { username: string; password: string; confirm: string };
export const register = createAsyncThunk<void, RegisterProps>(
  "app/register",
  async ({ username, password, confirm }) => {
    const response = await axios.post(`${API_URL}/users/registration/`, {
      username,
      password,
    });
    console.log(response);
  }
);

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const { id, name, avatar, isAdmin } = action.payload;
      state.user = { id, name, avatar, isAdmin };
      userStorage.set("user", { id, name, avatar, isAdmin });
      state.isLoading = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setIsLoading, logout } = appSlice.actions;

export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectUser = (state: RootState) => state.app.user;

const { reducer } = appSlice;
export { reducer as appReducer };
