import type { Txn } from "../model/Txn";

type TxnRowProps = {
  txn: Txn,
  edit: (id: number) => void,
  remove: (id: number) => void,
};


const TxnRow = ({ txn, edit, remove }: TxnRowProps) => (
  <div className="row border-bottom py-1 align-items-center">
    <div className="col-1 text-end">{txn.id}</div>
    <div className="col-2 text-center">{txn.txnDate}</div>
    <div className="col-3">{txn.header}</div>

    <div className="col-2 text-end">
      {txn.txnType === "DEBIT" && txn.amount}
    </div>

    <div className="col-2 text-end">
      {txn.txnType === "CREDIT" && txn.amount}
    </div>

    <div className="col-2 text-center">
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => edit(txn.id)}
      >
        <i className="bi bi-pencil"></i>
      </button>

      <button
        className="btn btn-sm btn-danger ms-1"
        onClick={() => remove(txn.id)}
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  </div>
);

export default TxnRow;