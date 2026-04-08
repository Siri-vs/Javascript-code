export interface Txn {
  id: number;
  header: string;
  txnType: string;
  txnDate: string;
  amount: number;
  isEditable?: boolean;
}
