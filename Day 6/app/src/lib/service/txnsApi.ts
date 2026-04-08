import axios from "axios";
import type { Txn } from "../../models/Txn";

const API_URL = "http://localhost:9999/txns";

export const getAllTxns = () => {
  return axios.get<Txn[]>(API_URL);
};

export const addTxn = (txn: Txn) => {
  const { id, ...payload } = txn;
  return axios.post<Txn>(API_URL, payload);
};

export const saveTxn = (id: number, txn: Txn) => {
  return axios.put<Txn>(`${API_URL}/${id}`, txn);
};

export const delTxnById = (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
