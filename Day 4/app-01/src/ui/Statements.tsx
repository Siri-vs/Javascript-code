import { useEffect, useState } from "react";
import type { Txn } from "../model/Txn";
import type { TxnSummary } from "../model/TxnSummary";

import TXSHeader from "./TxnsHeader";
import TXSFooter from "./TxnsFooter";
import TxnRow from "./TxnRow";
import TxnForm from "./TxnForm";
import { addTxn, delTxnById, getAllTxns, saveTxn } from "../services/txnsApi";

const Statements = () => {
  const [txns, setTxns] = useState<Txn[]>([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [txnSummary, setTxnSummary] = useState<TxnSummary>({
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
  });

  useEffect(() => {
    getAllTxns()
        .then(resp => setTxns(resp.data))
        .catch(err => {
            console.log(err);
            setErrMsg("unable to fetch records! Please retry later!");
        })
  }, []);

  useEffect(() => {
    if (txns && txns.length > 0) {
      const sumUp = (txns: Txn[], target: string) =>
        txns
          .filter((t) => t.txnType === target)
          .map((t) => t.amount)
          .reduce((a1, a2) => a1 + a2);

      const tc = sumUp(txns, "CREDIT");
      const tdb = sumUp(txns, "DEBIT");
      setTxnSummary({ totalCredit: tc, totalDebit: tdb, balance: tc - tdb });
    } else {
      setTxnSummary({ totalCredit: 0, totalDebit: 0, balance: 0 });
    }
  }, [txns]);

  const add = (txn: Txn) => {
    addTxn(txn)
      .then((resp) => setTxns([...txns, { ...resp.data }]))
      .catch((err) => {
        console.log(err);
        setErrMsg("Unable to save records! Please retry later!");
      });
  };

  const update = (txn: Txn) => {
    txn.isEditable = undefined;
    saveTxn(txn.id, txn)
      .then((resp) =>
        setTxns(txns.map((tx) => (tx.id === txn.id ? { ...resp.data } : txn))),
      )
      .catch((err) => {
        console.log(err);
        setErrMsg("Unable to save records! Please retry later!");
      });
  };

  const remove = (id: number) => {
    delTxnById(id)
      .then(_resp => setTxns(txns.filter((tx) => tx.id !== id)))
      .catch((err) => {
        console.log(err);
        setErrMsg("Unable to remove the record! Please retry later!");
      });
  };

  const edit = (id: number) =>
    setTxns(
      txns.map((tx) => (tx.id === id ? { ...tx, isEditable: true } : tx)),
    );

  const cancelEdit = (id: number) =>
    setTxns(
      txns.map((tx) => (tx.id === id ? { ...tx, isEditable: undefined } : tx)),
    );

  return (
    <section className="container mt-3">
      <h3 className="mb-3">Statements</h3>

      {errMsg && (
        <div className="alert alert-danger p-2">
          <strong>{errMsg}</strong>
        </div>
      )}

      <TXSHeader />

      <TxnForm save={add} cancel={cancelEdit} />

      {txns && txns.length > 0 && (
        txns.map((t) =>
        t.isEditable ? (
          <TxnForm key={t.id} t={t} save={update} cancel={cancelEdit} />
        ) : (
          <TxnRow key={t.id} txn={t} edit={edit} remove={remove} />
        ),
      ))}

      <TXSFooter txnSummary={txnSummary} />
    </section>
  );
};

export default Statements;
