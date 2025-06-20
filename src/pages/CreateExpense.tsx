// src/pages/CreateExpense.tsx
import { useEffect, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import { useExpenseCategories, useCreateExpense } from "../api";

interface Category {
  id: number;
  name: string;
}

export default function CreateExpense() {
  const { token } = useToken();
  const { fetchCategories } = useExpenseCategories();
  const { createExpense } = useCreateExpense();

  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const result = await fetchCategories(token ?? "");
      if (result.success) {
        setCategories(result.data);
      } else {
        setMessage(result.error ?? "Error al cargar categorías");
      }
    };
    loadCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const category = categories.find((cat) => cat.id === Number(categoryId));
    if (!category) {
      setMessage("Selecciona una categoría válida");
      return;
    }

    const result = await createExpense(
      token ?? "",
      date,
      category,
      parseFloat(amount)
    );

    if (result.success) {
      setMessage("✅ Gasto registrado exitosamente");
      setDate("");
      setAmount("");
      setCategoryId("");
    } else {
      setMessage(result.error ?? "❌ Error al registrar gasto");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Registrar nuevo gasto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto"
          required
          className="w-full border px-3 py-2 rounded"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Registrar Gasto
        </button>
      </form>

      {message && <p className="text-center mt-4 text-blue-600">{message}</p>}
    </div>
  );
}
