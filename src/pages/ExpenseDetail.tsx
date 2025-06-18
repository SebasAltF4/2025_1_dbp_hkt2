// src/pages/ExpenseDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToken } from "../contexts/TokenContext";
import axios from "axios";

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
}

export default function ExpenseDetail() {
  const { token } = useToken();
  const { id } = useParams(); // id = categoryId

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");

        const res = await axios.get(
          `/expenses/detail?year=${year}&month=${month}&categoryId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setExpenses(data);
      } catch (err) {
        setError("Error al cargar los gastos de esta categoría");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, token]);

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Gastos por Categoría</h2>

      {loading && <p className="text-center">Cargando...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {expenses.length === 0 && !loading && <p className="text-center">No hay gastos en esta categoría.</p>}

      <ul className="space-y-3">
        {expenses.map((exp) => (
          <li
            key={exp.id}
            className="bg-white border p-4 rounded shadow flex justify-between"
          >
            <div>
              <p className="font-semibold">{exp.description}</p>
              <p className="text-sm text-gray-500">{new Date(exp.date).toLocaleDateString()}</p>
            </div>
            <span className="font-bold">S/ {exp.amount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
