// src/pages/ExpenseDetail.tsx

import { useEffect, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import { useExpenseCategories, useExpenseDetails, useDeleteExpense } from "../api";

interface Category {
  id: number;
  name: string;
}

interface Expense {
  id: number;
  date: string;
  amount: number;
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

export default function ExpenseDetail() {
  const { token } = useToken();
  const { fetchCategories } = useExpenseCategories();
  const { fetchDetails } = useExpenseDetails();
  const { deleteExpense } = useDeleteExpense();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

  // 🔹 Cargar categorías una sola vez
  useEffect(() => {
    const getCategories = async () => {
      const result = await fetchCategories(token ?? "");
      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error ?? "Ocurrió un error al cargar categorías");
      }
    };
    getCategories();
  }, [token]);

  // 🔹 Buscar gastos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      setError("Selecciona una categoría");
      return;
    }
    const result = await fetchDetails(
      token ?? "",
      selectedYear,
      selectedMonth,
      selectedCategory
    );
    if (result.success) {
      const ordered = [...result.data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setExpenses(ordered);
      setError("");
    } else {
      setError(result.error ?? "Ocurrió un error al cargar gastos");
    }
  };

  // 🔹 Eliminar gasto individual
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este gasto?")) return;
    const result = await deleteExpense(token ?? "", id);
    if (result.success) {
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } else {
      alert(result.error ?? "No se pudo eliminar");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Detalle de Gasto</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {[
            "Enero","Febrero","Marzo","Abril","Mayo","Junio",
            "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
          ].map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>

        <select
          value={selectedCategory ?? ""}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="">Selecciona categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {expenses.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Monto</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="border p-2">{formatDate(exp.date)}</td>
                <td className="border p-2">S/ {exp.amount.toFixed(2)}</td>
                <td className="border p-2 text-center">
  <div className="flex justify-center items-center">
    <button
      onClick={() => handleDelete(exp.id)}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    >
      Eliminar
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {expenses.length === 0 && !error && (
        <p className="text-center">No hay resultados para los filtros seleccionados.</p>
      )}
    </div>
  );
}
