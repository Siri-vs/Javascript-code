export interface Customer {
  id: number;
  crn: string;
  name: string;
  mobile: string;
  mailId: string;
}

export interface Account {
  id: number;
  accountNumber: string;
  type: "Savings" | "Current";
  currentBalance: number;
  customerId: number;
}

export interface Transaction {
  id: number;
  txnDate: string;
  header: string;
  amount: number;
  type: "Debit" | "Credit";
  accountId: number;
}
