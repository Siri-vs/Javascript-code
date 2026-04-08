import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Transaction } from "../type";

interface TransactionFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (
    transaction: Omit<Transaction, "id"> | Transaction,
  ) => Promise<void>;
  transaction?: Transaction;
  accountId: number;
}

export default function TransactionFormModal({
  show,
  onHide,
  onSubmit,
  transaction,
  accountId,
}: TransactionFormModalProps) {
  const [formData, setFormData] = useState({
    txnDate: new Date().toISOString().split("T")[0],
    header: "",
    amount: 0,
    type: "Debit" as "Debit" | "Credit",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        txnDate: transaction.txnDate,
        header: transaction.header,
        amount: transaction.amount,
        type: transaction.type,
      });
    } else {
      setFormData({
        txnDate: new Date().toISOString().split("T")[0],
        header: "",
        amount: 0,
        type: "Debit",
      });
    }
    setErrors({});
  }, [transaction, show]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.txnDate.trim()) newErrors.txnDate = "Date is required";
    if (!formData.header.trim()) newErrors.header = "Description is required";
    if (formData.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      if (transaction) {
        await onSubmit({
          id: transaction.id,
          accountId,
          ...formData,
        } as Transaction);
      } else {
        await onSubmit({
          accountId,
          ...formData,
        } as Omit<Transaction, "id">);
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      txnDate: new Date().toISOString().split("T")[0],
      header: "",
      amount: 0,
      type: "Debit",
    });
    setErrors({});
    onHide();
  };

  const isEditMode = !!transaction;
  const title = isEditMode ? "Edit Transaction" : "Add Transaction";

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="txnDate"
              value={formData.txnDate}
              onChange={handleChange}
              isInvalid={!!errors.txnDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.txnDate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="header"
              value={formData.header}
              onChange={handleChange}
              isInvalid={!!errors.header}
              placeholder="Enter transaction description"
            />
            <Form.Control.Feedback type="invalid">
              {errors.header}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
            >
              <option value="Debit">Debit (Withdrawal)</option>
              <option value="Credit">Credit (Deposit)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              isInvalid={!!errors.amount}
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
            <Form.Control.Feedback type="invalid">
              {errors.amount}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : isEditMode ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
