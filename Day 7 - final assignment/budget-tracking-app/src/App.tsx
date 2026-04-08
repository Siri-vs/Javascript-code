import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import CustomerList from "./features/customers/CustomerList";
import StatementPage from "./features/transactions/StatementPage";

function App() {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Budget Tracking App</h1>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/statement/:accountId" element={<StatementPage />} />
      </Routes>
    </Container>
  );
}

export default App;
