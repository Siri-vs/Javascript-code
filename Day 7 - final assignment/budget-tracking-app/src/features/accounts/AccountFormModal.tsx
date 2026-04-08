import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Account } from "../type";

interface AccountFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (account: Omit<Account, "id"> | Account) => Promise<void>;
  account?: Account;
  customerId: number;
}

export default function AccountFormModal({
  show,
  onHide,
  onSubmit,
  account,
  customerId,
}: AccountFormModalProps) {
  const [formData, setFormData] = useState({
    accountNumber: "",
    type: "Savings" as "Savings" | "Current",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        accountNumber: account.accountNumber,
        type: account.type,
      });
    } else {
      setFormData({
        accountNumber: "",
        type: "Savings",
      });
    }
    setErrors({});
  }, [account, show]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.accountNumber.trim())
      newErrors.accountNumber = "Account number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "currentBalance" ? parseFloat(value) || 0 : value,
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
      if (account) {
        await onSubmit({
          id: account.id,
          customerId,
          currentBalance: account.currentBalance,
          ...formData,
        } as Account);
      } else {
        await onSubmit({
          customerId,
          currentBalance: 0,
          ...formData,
        } as Omit<Account, "id">);
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
      accountNumber: "",
      type: "Savings",
    });
    setErrors({});
    onHide();
  };

  const isEditMode = !!account;
  const title = isEditMode ? "Edit Account" : "Add Account";

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              isInvalid={!!errors.accountNumber}
              placeholder="Enter Account Number"
            />
            <Form.Control.Feedback type="invalid">
              {errors.accountNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Account Type</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
            >
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </Form.Select>
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
