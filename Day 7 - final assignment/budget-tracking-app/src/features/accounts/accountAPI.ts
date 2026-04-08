import api from "../../services/api";
import type { Account } from "../type";

export const getAccountsByCustomerId = async (
  customerId: number,
): Promise<Account[]> => {
  const response = await api.get(`/accounts?customerId=${customerId}`);
  return response.data;
};

export const addAccount = async (account: Account): Promise<Account> => {
  const response = await api.post("/accounts", account);
  return response.data;
};

export const updateAccount = async (
  id: number,
  account: Account,
): Promise<Account> => {
  const response = await api.put(`/accounts/${id}`, account);
  return response.data;
};

export const deleteAccount = async (id: number): Promise<void> => {
  await api.delete(`/accounts/${id}`);
};
