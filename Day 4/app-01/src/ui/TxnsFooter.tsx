import { Fragment } from "react/jsx-runtime";
import type { TxnSummary } from "../model/TxnSummary";

type TxnSummaryProps = {txnSummary : TxnSummary}

const TXSFooter = ({txnSummary} :TxnSummaryProps) => (
  <Fragment>
    <div className="row p-1 mb-1 border-bottom border-dark fw-bold">
      <div className="col-2 text-end">Totals</div>
      <div className="col-2 text-end">
        {txnSummary.totalCredit}
      </div>
      <div className="col-2 text-end">
        {txnSummary.totalDebit}
      </div>
      <div className="col-2 text-end"></div>
    </div>

    <div className="row p-1 mb-1 border-bottom border-dark fw-bold">
      <div className="col-2 text-end">Balance</div>
      <div className="col-2 text-end">
        {txnSummary.balance}
      </div>
      <div className="col-2 text-end"></div>
      <div className="col-2 text-end"></div>
    </div>
  </Fragment>
);

export default TXSFooter;