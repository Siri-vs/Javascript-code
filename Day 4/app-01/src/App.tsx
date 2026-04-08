//import React from "react";
import Header from "./ui/Header";
import Statements from "./ui/Statements";

const App = () => (
  <>
    <Header appTitle="Budget Tracker" />

    <div className="container-fluid p-2">
      <Statements />
    </div>
  </>
);

export default App;