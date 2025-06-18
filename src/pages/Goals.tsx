// src/pages/Goals.tsx
import { useEffect, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import axios from "axios";

interface Goal {
  id: number;
  month: string;
  year: number;
  amount: number;
}

export default function Goals() {
  const { token } = useToken();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get("/goals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Metas:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        setGoals(data);
      } catch (err) {
        console.error("Error al cargar metas", err);
      }
    };

    fetchGoals();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const today = new Date();
      const body = {
        year: today.getFullYear(),
        month: String(today.getMonth() + 1).padStart(2, "0"),
        amount: parseFloat(amount),
      };

      await axios.post("/goals", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Meta creada exitosamente");
      setAmount("");
    } catch (err) {
      console.error("Error al crear meta", err);
      setMessage("Error al crear meta");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Metas de Ahorro</h2>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto a ahorrar"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Definir meta
        </button>
      </form>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      <ul className="space-y-3">
        {Array.isArray(goals) && goals.map((g) => (
          <li
            key={g.id}
            className="bg-white border p-4 rounded shadow flex justify-between"
          >
            <span>
              {g.month}/{g.year}
            </span>
            <strong>S/ {g.amount.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
