import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Col, Alert } from "react-bootstrap";

import TxnsHeader from "./TxnsHeader";
import TxnForm from "./TxnForm";
import TxnRow from "./TxnRow";
import TxnsFooter from "./TxnsFooter";

import type { RootState, AppDispatch } from "../lib/state/AppStore";
import { enableEdit, cancelEdit } from "../lib/state/StatementSlice";

const Statement = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { txns, summary, error } = useSelector(
    (state: RootState) => state.statement,
  );

  useEffect(() => {
    dispatch({ type: "statement/fetch" });
  }, [dispatch]);

  return (
    <Col sm={10} as="section" className="m-2 mx-auto p-2">
      <h3>Statement</h3>

      {error && (
        <Alert variant="danger" className="p-2">
          <strong>{error}</strong>
        </Alert>
      )}

      <TxnsHeader />

      <TxnForm
        save={(txn) =>
          dispatch({
            type: "statement/add",
            payload: txn,
          })
        }
      />

      {txns.map((txn) =>
        txn.isEditable ? (
          <TxnForm
            key={txn.id}
            t={txn}
            save={(updatedTxn) =>
              dispatch({
                type: "statement/update",
                payload: updatedTxn,
              })
            }
            cancel={(id) => dispatch(cancelEdit(id))}
          />
        ) : (
          <TxnRow
            key={txn.id}
            txn={txn}
            edit={(id) => dispatch(enableEdit(id))}
            remove={(id) =>
              dispatch({
                type: "statement/delete",
                payload: id,
              })
            }
          />
        ),
      )}

      <TxnsFooter txnsSummary={summary} />
    </Col>
  );
};

export default Statement;
