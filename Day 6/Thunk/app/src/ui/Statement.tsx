import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Alert } from "react-bootstrap";

import TxnsHeader from "./TxnsHeader";
import TxnForm from "./TxnForm";
import TxnRow from "./TxnRow";
import TxnsFooter from "./TxnsFooter";

import type { RootState, AppDispatch } from "../lib/state/AppStore";
import {
  fetchTxns,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  enableEdit,
  cancelEdit,
} from "../lib/state/StatementSlice";

const Statement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { txns, summary, error, nextId } = useSelector(
    (state: RootState) => state.statement,
  );

  useEffect(() => {
    dispatch(fetchTxns());
  }, [dispatch]);

  return (
    <Col sm={10} as="section" className="m-2 mx-auto p-2">
      <h3>Statement</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      <TxnsHeader />

      <TxnForm nextId={nextId} save={(txn) => dispatch(addTransaction(txn))} />

      {txns.map((txn) =>
        txn.isEditable ? (
          <TxnForm
            key={txn.id}
            t={txn}
            save={(t) => dispatch(updateTransaction(t))}
            cancel={(id) => dispatch(cancelEdit(id))}
          />
        ) : (
          <TxnRow
            key={txn.id}
            txn={txn}
            edit={(id) => dispatch(enableEdit(id))}
            remove={(id) => dispatch(deleteTransaction(id))}
          />
        ),
      )}

      <TxnsFooter txnsSummary={summary} />
    </Col>
  );
};

export default Statement;
