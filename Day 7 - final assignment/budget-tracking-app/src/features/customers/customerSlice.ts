import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Customer } from "../type";
import * as customerAPI from "./customerAPI";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async () => await customerAPI.getCustomers(),
);

export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (customer: Omit<Customer, "id">) =>
    await customerAPI.addCustomer({ ...customer, id: 0 }),
);

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (customer: Customer) =>
    await customerAPI.updateCustomer(customer.id, customer),
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id: number) => {
    await customerAPI.deleteCustomer(id);
    return id;
  },
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
      state.error = null;
    },
    addCustomerLocal: (state, action) => {
      state.customers.push(action.payload);
      state.error = null;
    },
    updateCustomerLocal: (state, action) => {
      const index = state.customers.findIndex(
        (c) => c.id === action.payload.id,
      );
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
      state.error = null;
    },
    deleteCustomerLocal: (state, action) => {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
        state.error = null;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (c) => c.id !== action.payload,
        );
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCustomers,
  addCustomerLocal,
  updateCustomerLocal,
  deleteCustomerLocal,
  setLoading,
  setError,
} = customerSlice.actions;

export default customerSlice.reducer;
