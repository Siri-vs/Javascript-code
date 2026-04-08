import { useState } from "react";
import type { Customer } from "../type";
import { addCustomer } from "./customerAPI";
import { Alert, Button, Container, Form } from "react-bootstrap";

const AddCustomer = () => {
  const [customer, setCustomer] = useState<Customer>({
    id: 0,
    name: "",
    crn: "",
    mobile: "",
    mailId: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addCustomer(customer);
      setMessage("Customer added successfully!");
      setCustomer({
        id: 0,
        name: "",
        crn: "",
        mobile: "",
        mailId: "",
      });
    } catch (error) {
      setMessage("Failed to add customer");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add Customer</h2>

      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>CRN</Form.Label>
          <Form.Control
            type="text"
            name="crn"
            value={customer.crn}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile</Form.Label>
          <Form.Control
            type="text"
            name="mobile"
            value={customer.mobile}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="mailId"
            value={customer.mailId}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Customer
        </Button>
      </Form>
    </Container>
  );
};

export default AddCustomer;
