// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TokenProvider } from "./contexts/TokenContext";
import App from "./App";
import './index.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TokenProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TokenProvider>
  </React.StrictMode>
);
