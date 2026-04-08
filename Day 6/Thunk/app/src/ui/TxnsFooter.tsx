import { Fragment } from "react/jsx-runtime";
import type { TxnsSummary } from "../models/TxnsSummary";
import { Col, Row } from "react-bootstrap";

const TxnsFooter = ({ txnsSummary }: { txnsSummary: TxnsSummary }) => (
  <Fragment>
    <Row className="p-1 mb-1 border-bottom border-dark fw-bold">
      <Col className="text-end">Totals</Col>
      <Col xs={2} className="text-end">
        {txnsSummary.totalCredit}
      </Col>
      <Col xs={2} className="text-end">
        {txnsSummary.totalDebit}
      </Col>
      <Col xs={2} className="text-center"></Col>
    </Row>

    <Row className="p-1 mb-1 border-bottom border-dark fw-bold">
      <Col className="text-end">Balance</Col>
      <Col xs={2} className="text-center"></Col>
      <Col xs={2} className="text-end">
        {txnsSummary.balance}
      </Col>
      <Col xs={2} className="text-center"></Col>
    </Row>
  </Fragment>
);

export default TxnsFooter;
