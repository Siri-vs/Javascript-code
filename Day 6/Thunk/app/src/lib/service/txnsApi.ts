import axios from "axios";
import type { Txn } from "../../models/Txn";

const API_URL = "http://localhost:9999/txns";

export const getAllTxns = () => {
  return axios.get<Txn[]>(API_URL);
};

export const addTxn = (txn: Txn) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, isEditable, ...payload } = txn;
  // Don't send id - let backend generate it
  return axios.post<Txn>(API_URL, payload);
};

export const saveTxn = (id: number, txn: Txn) => {
  const { id: txnId, isEditable, ...payload } = txn;
  return axios.put<Txn>(`${API_URL}/${id}`, payload);
};

export const delTxnById = (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
