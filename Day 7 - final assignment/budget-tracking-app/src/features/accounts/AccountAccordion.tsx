import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert, Badge, Spinner } from "react-bootstrap";
import { Plus, Pencil, Trash, FileText } from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAccountsByCustomerId,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../accounts/accountSlice";
import AccountFormModal from "./AccountFormModal";
import type { Account } from "../type";

interface AccountAccordionProps {
  customerId: number;
  customerName: string;
  expanded: boolean;
}

export default function AccountAccordion({
  customerId,
  customerName,
  expanded,
}: AccountAccordionProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((state) => state.account.accounts);
  const loading = useAppSelector((state) => state.account.loading);
  const error = useAppSelector((state) => state.account.error);

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (expanded) {
      dispatch(fetchAccountsByCustomerId(customerId));
    }
  }, [expanded, customerId, dispatch]);

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setShowFormModal(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setShowFormModal(true);
  };

  const handleDeleteAccount = (id: number) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      dispatch(deleteAccount(id));
    }
  };

  const handleFormSubmit = async (
    accountData: Account | Omit<Account, "id">,
  ) => {
    try {
      if (selectedAccount) {
        dispatch(updateAccount(accountData as Account));
      } else {
        dispatch(createAccount(accountData as Omit<Account, "id">));
      }
    } catch (error) {
      console.error("Error saving account:", error);
    }
  };

  if (!expanded) {
    return null;
  }

  return (
    <>
      <div className="ms-4 mt-3 mb-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Accounts for {customerName}</h5>
          <Button variant="success" size="sm" onClick={handleAddAccount}>
            <Plus size={16} className="me-2" />
            Add Account
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading && (
          <div className="text-center">
            <Spinner animation="border" size="sm" />
          </div>
        )}

        {!loading && accounts.length === 0 && (
          <Alert variant="info">
            No accounts found. Add one to get started!
          </Alert>
        )}

        {!loading && accounts.length > 0 && (
          <div className="table-responsive">
            <table className="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.accountNumber}</td>
                    <td>
                      <Badge
                        bg={account.type === "Savings" ? "info" : "primary"}
                      >
                        {account.type}
                      </Badge>
                    </td>
                    <td>
                      <strong>
                        ₹{(account.currentBalance || 0).toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleEditAccount(account)}
                        className="me-2"
                      >
                        <Pencil size={16} className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => navigate(`/statement/${account.id}`)}
                        className="me-2"
                      >
                        <FileText size={16} className="me-1" />
                        Statement
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash size={16} className="me-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AccountFormModal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        account={selectedAccount || undefined}
        customerId={customerId}
      />
    </>
  );
}
