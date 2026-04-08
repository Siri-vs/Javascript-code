import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Alert,
  Spinner,
  Table,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { ArrowLeft, Plus, Pencil, Trash } from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchTransactionsByAccountId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../transactions/transactionSlice";
import TransactionFormModal from "./TransactionFormModal";
import type { Transaction, Account } from "../type";
import api from "../../services/api";

export default function StatementPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const transactions = useAppSelector(
    (state) => state.transaction.transactions,
  );
  const loading = useAppSelector((state) => state.transaction.loading);
  const error = useAppSelector((state) => state.transaction.error);

  const [account, setAccount] = useState<Account | null>(null);
  const [accountLoading, setAccountLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setAccountLoading(true);
        const response = await api.get(`/accounts/${accountId}`);
        setAccount(response.data);
      } catch (err) {
        console.error("Error fetching account:", err);
      } finally {
        setAccountLoading(false);
      }
    };

    if (accountId) {
      fetchAccount();
      dispatch(fetchTransactionsByAccountId(parseInt(accountId, 10)));
    }
  }, [accountId, dispatch]);

  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setShowFormModal(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowFormModal(true);
  };

  const handleDeleteTransaction = (id: number) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleFormSubmit = async (
    transactionData: Transaction | Omit<Transaction, "id">,
  ) => {
    try {
      if (selectedTransaction) {
        await dispatch(updateTransaction(transactionData as Transaction));
      } else {
        await dispatch(
          createTransaction(transactionData as Omit<Transaction, "id">),
        );
      }
      setShowFormModal(false);
      setSelectedTransaction(null);
      if (accountId) {
        dispatch(fetchTransactionsByAccountId(parseInt(accountId, 10)));
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const creditTotal = transactions
    .filter((t) => t.type === "Credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const debitTotal = transactions
    .filter((t) => t.type === "Debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const calculatedBalance = creditTotal - debitTotal;

  useEffect(() => {
    if (account && accountId) {
      const updateAccountBalance = async () => {
        try {
          await api.put(`/accounts/${accountId}`, {
            ...account,
            currentBalance: calculatedBalance,
          });
        } catch (err) {
          console.error("Error updating account balance:", err);
        }
      };
      updateAccountBalance();
    }
  }, [calculatedBalance, account, accountId]);

  if (accountLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading account...</span>
        </Spinner>
      </Container>
    );
  }

  if (!account) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Account not found!</Alert>
        <Button variant="primary" onClick={handleBack}>
          <ArrowLeft size={20} className="me-2" />
          Back to Customers
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="mb-4">
        <Button
          variant="link"
          onClick={handleBack}
          className="mb-3"
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft size={20} className="me-2" />
          Back to Accounts
        </Button>

        <h2>Account Statement</h2>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <div>
                <small className="text-muted">Account Number</small>
                <p className="fw-bold">{account.accountNumber}</p>
              </div>
            </Col>
            <Col md={4}>
              <div>
                <small className="text-muted">Account Type</small>
                <p className="fw-bold">
                  <Badge bg={account.type === "Savings" ? "info" : "primary"}>
                    {account.type}
                  </Badge>
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div>
                <small className="text-muted">Current Balance</small>
                <p className="fw-bold text-success">
                  ₹{calculatedBalance.toLocaleString()}
                </p>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={12} className="text-end">
              <Button
                variant="success"
                onClick={handleAddTransaction}
                disabled={!accountId}
              >
                <Plus size={18} className="me-2" />
                Add Transaction
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <Alert variant="info">No transactions found for this account.</Alert>
      )}

      {!loading && transactions.length > 0 && (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th className="text-end">Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.txnDate).toLocaleDateString()}</td>
                  <td>{transaction.header}</td>
                  <td>
                    <Badge
                      bg={transaction.type === "Debit" ? "danger" : "success"}
                    >
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <span
                      className={
                        transaction.type === "Debit"
                          ? "text-danger"
                          : "text-success"
                      }
                    >
                      {transaction.type === "Debit" ? "-" : "+"}₹
                      {transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleEditTransaction(transaction)}
                      className="me-2"
                    >
                      <Pencil size={16} className="me-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <Trash size={16} className="me-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <TransactionFormModal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        transaction={selectedTransaction || undefined}
        accountId={parseInt(accountId || "0", 10)}
      />
    </Container>
  );
}
