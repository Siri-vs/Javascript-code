import api from "../../services/api";
import type { Transaction } from "../type";

export const getTransactionsByAccountId = async (
  accountId: number,
): Promise<Transaction[]> => {
  const response = await api.get(`/transactions?accountId=${accountId}`);
  return response.data;
};

export const addTransaction = async (
  transaction: Transaction,
): Promise<Transaction> => {
  const response = await api.post("/transactions", transaction);
  return response.data;
};

export const updateTransaction = async (
  id: number,
  transaction: Transaction,
): Promise<Transaction> => {
  const response = await api.put(`/transactions/${id}`, transaction);
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};
