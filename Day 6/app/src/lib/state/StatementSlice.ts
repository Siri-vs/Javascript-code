import { createSlice } from "@reduxjs/toolkit";
import type { Txn } from "../../models/Txn";
import type { TxnsSummary } from "../../models/TxnsSummary";

type StatementState = {
  txns: Txn[];
  summary: TxnsSummary;
  loading: boolean;
  error: string | null;
};

const initialState: StatementState = {
  txns: [],
  summary: { totalCredit: 0, totalDebit: 0, balance: 0 },
  loading: false,
  error: null,
};

const statementSlice = createSlice({
  name: "statement",
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },

    fetchSuccess(state, action) {
      state.txns = action.payload;
      state.loading = false;
      recalcSummary(state);
    },

    fetchFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addSuccess(state, action) {
      state.txns.push(action.payload);
      recalcSummary(state);
    },

    updateSuccess(state, action) {
      state.txns = state.txns.map((t) =>
        t.id === action.payload.id ? action.payload : t,
      );
      recalcSummary(state);
    },

    deleteSuccess(state, action) {
      state.txns = state.txns.filter((t) => t.id !== action.payload);
      recalcSummary(state);
    },

    enableEdit(state, action) {
      const t = state.txns.find((tx) => tx.id === action.payload);
      if (t) t.isEditable = true;
    },

    cancelEdit(state, action) {
      const t = state.txns.find((tx) => tx.id === action.payload);
      if (t) t.isEditable = undefined;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  addSuccess,
  updateSuccess,
  deleteSuccess,
  enableEdit,
  cancelEdit,
} = statementSlice.actions;

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
