import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Transaction } from "../type";
import * as transactionAPI from "./transactionAPI";

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

export const fetchTransactionsByAccountId = createAsyncThunk(
  "transaction/fetchByAccountId",
  async (accountId: number) =>
    await transactionAPI.getTransactionsByAccountId(accountId),
);

export const createTransaction = createAsyncThunk(
  "transaction/createTransaction",
  async (transaction: Omit<Transaction, "id">) =>
    await transactionAPI.addTransaction({ ...transaction, id: 0 }),
);

export const updateTransaction = createAsyncThunk(
  "transaction/updateTransaction",
  async (transaction: Transaction) =>
    await transactionAPI.updateTransaction(transaction.id, transaction),
);

export const deleteTransaction = createAsyncThunk(
  "transaction/deleteTransaction",
  async (id: number) => {
    await transactionAPI.deleteTransaction(id);
    return id;
  },
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsByAccountId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsByAccountId.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactionsByAccountId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
        state.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id,
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload,
        );
        state.error = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
