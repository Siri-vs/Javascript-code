import { configureStore } from "@reduxjs/toolkit";
import statementReducer from "./StatementSlice";

export const AppStore = configureStore({
  reducer: {
    statement: statementReducer,
  },
});

export type RootState = ReturnType<typeof AppStore.getState>;
export type AppDispatch = typeof AppStore.dispatch;
