import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../features/customers/customerSlice";
import accountReducer from "../features/accounts/accountSlice";
import transactionReducer from "../features/transactions/transactionSlice";

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    account: accountReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
