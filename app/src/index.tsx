import * as React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect } from "react";

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as Element | DocumentFragment
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
