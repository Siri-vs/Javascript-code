import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { AppStore } from "./lib/state/AppStore.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={AppStore}>
      <App />
    </Provider>
  </StrictMode>,
);
