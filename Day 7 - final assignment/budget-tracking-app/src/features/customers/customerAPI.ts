import api from "../../services/api";
import type { Customer } from "../type";

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get("/customers");
  return response.data;
};

export const addCustomer = async (customer: Customer): Promise<Customer> => {
  const response = await api.post("/customers", customer);
  return response.data;
};

export const updateCustomer = async (
  id: number,
  customer: Customer,
): Promise<Customer> => {
  const response = await api.put(`/customers/${id}`, customer);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}`);
};
