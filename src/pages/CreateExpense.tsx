// src/pages/CreateExpense.tsx
import { useEffect, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import axios from "axios";

interface Category {
  id: number;
  name: string;
}

export default function CreateExpense() {
  const { token } = useToken();
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/expenses_category", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Categorías recibidas:", res.data);

        const data = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };

    fetchCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        "/expenses",
        {
          description,
          amount: parseFloat(amount),
          categoryId: parseInt(categoryId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Gasto registrado exitosamente");
      setDescription("");
      setAmount("");
      setCategoryId("");
    } catch (err) {
      console.error("Error al registrar gasto", err);
      setMessage("❌ Error al registrar gasto");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Registrar nuevo gasto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
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
