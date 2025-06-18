// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TokenProvider } from "./contexts/TokenContext";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// 🔑 Tus páginas reales:
import ExpensesSummary from "./pages/ExpensesSummary.tsx";
import ExpensesDetail from "./pages/ExpensesDetail.tsx";
import AddExpense from "./pages/AddExpense.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TokenProvider>
      <BrowserRouter>
        <Navbar />
        <div className="pt-16"> {/* para que la navbar fija no tape tu contenido */}
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/expenses_summary"
              element={
                <ProtectedRoute>
                  <ExpensesSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expenses_detail"
              element={
                <ProtectedRoute>
                  <ExpensesDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add_expense"
              element={
                <ProtectedRoute>
                  <AddExpense />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TokenProvider>
  </React.StrictMode>
);
