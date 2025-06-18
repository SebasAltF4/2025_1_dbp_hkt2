import { useEffect, useState} from "react";
import type { FormEvent } from "react"; // ✅ Esta es la forma correcta en tu proyecto
import axios from "axios";
import { useToken } from "../contexts/TokenContext";

interface Goal {
  id: number;
  month: number;
  year: number;
  amount: number;
}

export default function Goals() {
  const { token } = useToken();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ month: 6, year: 2025, amount: 0 });

  const fetchGoals = async () => {
    try {
      const res = await axios.get("/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      setError("Error al cargar metas");
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchGoals();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/goals", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ ...form, amount: 0 });
      fetchGoals(); // recarga metas
    } catch (err) {
      setError("Error al registrar meta");
      console.error(err);
    }
  };

  const handleUpdate = async (goalId: number) => {
    const newAmount = prompt("Nuevo monto de meta:");
    if (!newAmount) return;
    try {
      await axios.patch(`/goals/${goalId}`, { amount: parseFloat(newAmount) }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGoals();
    } catch (err) {
      setError("Error al actualizar meta");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl mb-4 text-center">Metas de ahorro</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mes"
            min={1}
            max={12}
            required
            value={form.month}
            onChange={(e) => setForm({ ...form, month: parseInt(e.target.value) })}
            className="w-1/3 border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Año"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
            className="w-1/3 border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Monto"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
            className="w-1/3 border px-3 py-2 rounded"
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Registrar Meta</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {goals.map((goal) => (
          <li key={goal.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p>🗓️ {goal.month}/{goal.year}</p>
              <p className="font-semibold">S/ {goal.amount.toFixed(2)}</p>
            </div>
            <button
              onClick={() => handleUpdate(goal.id)}
              className="text-blue-600 underline"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}