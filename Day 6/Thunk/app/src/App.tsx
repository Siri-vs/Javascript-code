import { Fragment } from "react/jsx-runtime";
import Header from "./ui/Header";
import Statement from "./ui/Statement";
import { Container } from "react-bootstrap";

const App = () => (
  <Fragment>
    <Header appTitle="Budget Tracker" />
    <Container fluid className="p-2">
      <Statement />
    </Container>
  </Fragment>
);

export default App;
