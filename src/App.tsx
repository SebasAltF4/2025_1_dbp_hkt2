// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ExpenseDetail from "./pages/ExpenseDetail";
import CreateExpense from "./pages/CreateExpense";
import ProtectedRoute from "./Components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses-detail"
          element={
            <ProtectedRoute>
              <ExpenseDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-expense"
          element={
            <ProtectedRoute>
              <CreateExpense />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
