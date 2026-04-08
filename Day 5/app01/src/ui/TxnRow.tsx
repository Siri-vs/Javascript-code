import { Button, Col, Row } from "react-bootstrap";
import type { Txn } from "../models/Txn";

type TxnRowProps = {
  txn: Txn;
  edit: (id: number) => void;
  remove: (id: number) => void;
};

const TxnRow = ({ txn, edit, remove }: TxnRowProps) => (
  <Row className="p-1 mb-1 border-bottom border-info">
    <Col xs={1} className="text-end">
      {txn.id}
    </Col>

    <Col xs={2} className="text-center">
      {txn.txnDate}
    </Col>

    <Col>{txn.header}</Col>

    <Col xs={2} className="text-end">
      {txn.txnType === "CREDIT" && txn.amount}
    </Col>

    <Col xs={2} className="text-end">
      {txn.txnType === "DEBIT" && txn.amount}
    </Col>

    <Col xs={2} className="text-center">
      <Button variant="secondary" size="sm" onClick={(_e) => edit(txn.id)}>
        <i className="bi bi-pen" title="EDIT" />
      </Button>

      <Button
        variant="danger"
        size="sm"
        className="ms-1"
        onDoubleClick={(_e) => remove(txn.id)}
      >
        <i className="bi bi-trash" title="double click to DELETE" />
      </Button>
    </Col>
  </Row>
);

export default TxnRow;
