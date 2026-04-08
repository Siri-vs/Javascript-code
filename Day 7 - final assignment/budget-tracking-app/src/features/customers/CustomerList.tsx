import { useEffect, useState } from "react";
import type { Customer } from "../type";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash,
} from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCustomers,
  deleteCustomer,
  createCustomer,
  updateCustomer,
} from "./customerSlice";
import CustomerFormModal from "./CustomerFormModal";
import AccountAccordion from "../accounts/AccountAccordion";

const CustomerList = () => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customer.customers);
  const loading = useAppSelector((state) => state.customer.loading);
  const error = useAppSelector((state) => state.customer.error);

  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [expandedCustomerId, setExpandedCustomerId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setShowFormModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowFormModal(true);
  };

  const handleDeleteCustomer = (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      dispatch(deleteCustomer(id));
    }
  };

  const handleFormSubmit = async (
    customerData: Omit<Customer, "id"> | Customer,
  ) => {
    try {
      if (selectedCustomer) {
        dispatch(updateCustomer(customerData as Customer));
      } else {
        dispatch(createCustomer(customerData as Omit<Customer, "id">));
      }
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  if (loading && customers.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Customers</h2>
        <Button variant="success" onClick={handleAddCustomer}>
          <Plus size={18} className="me-2" />
          Add Customer
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: "40px" }}></th>
            <th>CRN</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <>
              <tr key={customer.id}>
                <td className="text-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      setExpandedCustomerId(
                        expandedCustomerId === customer.id ? null : customer.id,
                      )
                    }
                    style={{ padding: "0", textDecoration: "none" }}
                  >
                    {expandedCustomerId === customer.id ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </Button>
                </td>
                <td>{customer.crn}</td>
                <td>{customer.name}</td>
                <td>{customer.mobile}</td>
                <td>{customer.mailId}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleEditCustomer(customer)}
                    className="me-2"
                  >
                    <Pencil size={16} className="me-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    <Trash size={16} className="me-1" />
                    Delete
                  </Button>
                </td>
              </tr>
              {expandedCustomerId === customer.id && (
                <tr key={`expanded-${customer.id}`}>
                  <td colSpan={6} style={{ padding: 0, border: "none" }}>
                    <AccountAccordion
                      customerId={customer.id}
                      customerName={customer.name}
                      expanded={expandedCustomerId === customer.id}
                    />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </Table>

      {customers.length === 0 && !loading && (
        <Alert variant="info">
          No customers found. Add one to get started!
        </Alert>
      )}

      <CustomerFormModal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        customer={selectedCustomer || undefined}
      />
    </Container>
  );
};

export default CustomerList;
