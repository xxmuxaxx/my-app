import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { API_URL } from "../constants";
import { AppState, UserResponseDTO } from "../types/interface";
import { RootState } from "./store";

const initialState: AppState = {
  isLoading: false,
  user: null,
};

export const login = createAsyncThunk(
  "app/login",
  async (data: { username: string; password: string }) => {
    const { username, password } = data;
    const response = await axios.get<UserResponseDTO>(
      `${API_URL}/users/?u=${username}&p=${password}`
    );
    return response.data;
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
    builder.addCase(login.fulfilled, (state, action) => {
      const { name, avatar, isAdmin } = action.payload;
      state.user = { name, avatar, isAdmin };
    });
  },
});

export const { setIsLoading, logout } = appSlice.actions;

export const selectIsLoading = (state: RootState) => state.app.isLoading;
export const selectUser = (state: RootState) => state.app.user;

const { reducer } = appSlice;
export { reducer as appReducer };
