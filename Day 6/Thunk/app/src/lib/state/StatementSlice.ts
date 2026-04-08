import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Txn } from "../../models/Txn";
import type { TxnsSummary } from "../../models/TxnsSummary";
import { getAllTxns, addTxn, saveTxn, delTxnById } from "../service/txnsApi";

export const fetchTxns = createAsyncThunk("statement/fetchTxns", async () => {
  const response = await getAllTxns();
  return response.data;
});

export const addTransaction = createAsyncThunk(
  "statement/addTransaction",
  async (txn: Txn) => {
    const response = await addTxn(txn);
    return response.data;
  },
);

export const updateTransaction = createAsyncThunk(
  "statement/updateTransaction",
  async (txn: Txn) => {
    const response = await saveTxn(txn.id, txn);
    return response.data;
  },
);

export const deleteTransaction = createAsyncThunk(
  "statement/deleteTransaction",
  async (id: number) => {
    await delTxnById(id);
    return id;
  },
);

type StatementState = {
  txns: Txn[];
  summary: TxnsSummary;
  loading: boolean;
  error: string | null;
  nextId: number;
};

const initialState: StatementState = {
  txns: [],
  summary: { totalCredit: 0, totalDebit: 0, balance: 0 },
  loading: false,
  error: null,
  nextId: 1,
};

const statementSlice = createSlice({
  name: "statement",
  initialState,
  reducers: {
    enableEdit(state, action) {
      const txn = state.txns.find((t) => t.id === action.payload);
      if (txn) txn.isEditable = true;
    },
    cancelEdit(state, action) {
      const txn = state.txns.find((t) => t.id === action.payload);
      if (txn) txn.isEditable = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTxns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTxns.fulfilled, (state, action) => {
        state.txns = action.payload;
        state.nextId =
          action.payload.length > 0
            ? Math.max(...action.payload.map((t) => t.id)) + 1
            : 1;
        state.loading = false;
        recalcSummary(state);
      })
      .addCase(fetchTxns.rejected, (state) => {
        state.loading = false;
        state.error = "Unable to load transactions";
      })

      .addCase(addTransaction.fulfilled, (state, action) => {
        state.txns.push(action.payload);
        state.nextId =
          state.txns.length > 0
            ? Math.max(...state.txns.map((t) => t.id)) + 1
            : 1;
        recalcSummary(state);
      })

      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.txns = state.txns.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        );
        recalcSummary(state);
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.txns = state.txns.filter((t) => t.id !== action.payload);
        recalcSummary(state);
      });
  },
});

export const { enableEdit, cancelEdit } = statementSlice.actions;
export default statementSlice.reducer;

function recalcSummary(state: StatementState) {
  const credit = state.txns
    .filter((t) => t.txnType === "CREDIT")
    .reduce((a, b) => a + b.amount, 0);

  const debit = state.txns
    .filter((t) => t.txnType === "DEBIT")
    .reduce((a, b) => a + b.amount, 0);

  state.summary = {
    totalCredit: credit,
    totalDebit: debit,
    balance: credit - debit,
  };
}
