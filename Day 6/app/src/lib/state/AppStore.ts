import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import statementReducer from "./StatementSlice";
import statementSaga from "./StatementSaga";

const sagaMiddleware = createSagaMiddleware();

export const AppStore = configureStore({
  reducer: {
    statement: statementReducer,
  },
  middleware: (getDefault) =>
    getDefault({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(statementSaga);

export type RootState = ReturnType<typeof AppStore.getState>;
export type AppDispatch = typeof AppStore.dispatch;
