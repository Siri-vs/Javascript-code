export interface Txn {
    id: number,
    header: string,
    txnType: "CREDIT" | "DEBIT",
    amount: number,
    txnDate: string
}