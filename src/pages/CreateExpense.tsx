import { useEffect, useState} from "react";
import type { FormEvent } from "react"; // ✅ Esta es la forma correcta en tu proyecto
import axios from "axios";
import { useToken } from "../contexts/TokenContext";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

export default function CreateExpense() {
  const { token } = useToken();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/expenses_category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        setError("Error al cargar categorías");
        console.error(err);
      }
    };
    if (token) fetchCategories();
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      description: form.get("description"),
      amount: parseFloat(form.get("amount") as string),
      date: form.get("date"),
      categoryId: parseInt(form.get("categoryId") as string),
    };

    try {
      await axios.post("/expenses", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard"); // Regresa al resumen
    } catch (err) {
      setError("Error al registrar el gasto");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4 text-center">Registrar nuevo gasto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="description"
          type="text"
          placeholder="Descripción"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Monto"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="date"
          type="date"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <select name="categoryId" required className="w-full border px-3 py-2 rounded">
          <option value="">Selecciona categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Registrar gasto
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
