
// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ExpenseDetail from "./pages/ExpenseDetail";
import CreateExpense from "./pages/CreateExpense";
import Goals from "./pages/Goals";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
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
          path="/expenses/:categoryId"
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

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
