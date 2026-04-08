import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Customer } from "../type";

interface CustomerFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (customer: Omit<Customer, "id"> | Customer) => Promise<void>;
  customer?: Customer;
}

export default function CustomerFormModal({
  show,
  onHide,
  onSubmit,
  customer,
}: CustomerFormModalProps) {
  const [formData, setFormData] = useState({
    crn: "",
    name: "",
    mobile: "",
    mailId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        crn: customer.crn,
        name: customer.name,
        mobile: customer.mobile,
        mailId: customer.mailId,
      });
    } else {
      setFormData({
        crn: "",
        name: "",
        mobile: "",
        mailId: "",
      });
    }
    setErrors({});
  }, [customer, show]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.crn.trim()) newErrors.crn = "CRN is required";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
    if (!formData.mailId.trim()) newErrors.mailId = "Email is required";

    if (
      formData.mailId.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mailId)
    ) {
      newErrors.mailId = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      if (customer) {
        await onSubmit({
          id: customer.id,
          ...formData,
        } as Customer);
      } else {
        await onSubmit(formData);
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
      crn: "",
      name: "",
      mobile: "",
      mailId: "",
    });
    setErrors({});
    onHide();
  };

  const isEditMode = !!customer;
  const title = isEditMode ? "Edit Customer" : "Add Customer";

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>CRN</Form.Label>
            <Form.Control
              type="text"
              name="crn"
              value={formData.crn}
              onChange={handleChange}
              isInvalid={!!errors.crn}
              placeholder="Enter CRN"
            />
            <Form.Control.Feedback type="invalid">
              {errors.crn}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder="Enter Name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              isInvalid={!!errors.mobile}
              placeholder="Enter Mobile Number"
            />
            <Form.Control.Feedback type="invalid">
              {errors.mobile}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="mailId"
              value={formData.mailId}
              onChange={handleChange}
              isInvalid={!!errors.mailId}
              placeholder="Enter Email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.mailId}
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
