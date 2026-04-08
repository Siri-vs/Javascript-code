import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Account } from "../type";
import * as accountAPI from "./accountAPI";

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

export const fetchAccountsByCustomerId = createAsyncThunk(
  "account/fetchByCustomerId",
  async (customerId: number) =>
    await accountAPI.getAccountsByCustomerId(customerId),
);

export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (account: Omit<Account, "id">) =>
    await accountAPI.addAccount({ ...account, id: 0 }),
);

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async (account: Account) =>
    await accountAPI.updateAccount(account.id, account),
);

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (id: number) => {
    await accountAPI.deleteAccount(id);
    return id;
  },
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsByCustomerId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountsByCustomerId.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
        state.error = null;
      })
      .addCase(fetchAccountsByCustomerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload);
        state.error = null;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(
          (a) => a.id === action.payload.id,
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter((a) => a.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default accountSlice.reducer;
