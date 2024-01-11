import * as React from "react";
import { useState, useEffect } from "react";

import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const root = ReactDOM.createRoot(
  document.getElementById("root") as Element | DocumentFragment
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
