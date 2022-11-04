import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type AppState = {
  isLoading: boolean;
};

const initialState: AppState = {
  isLoading: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = appSlice.actions;

export const selectIsLoading = (state: RootState) => state.app.isLoading;

const { reducer } = appSlice;
export { reducer as appReducer };
