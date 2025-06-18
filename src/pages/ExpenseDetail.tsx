import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useToken } from "../contexts/TokenContext";

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export default function ExpenseDetail() {
  const { token } = useToken();
  const { categoryId } = useParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `/expenses/detail?year=2025&month=6&categoryId=${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setExpenses(res.data);
      } catch (err) {
        console.error("Error al obtener detalles:", err);
        setError("No se pudo cargar el detalle de gastos.");
      }
    };

    if (token && categoryId) {
      fetchDetails();
    }
  }, [token, categoryId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Detalle de gastos por categoría
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-3">
        {expenses.map((exp) => (
          <li key={exp.id} className="border p-3 rounded flex justify-between">
            <div>
              <p className="font-medium">{exp.description}</p>
              <p className="text-sm text-gray-600">{new Date(exp.date).toLocaleDateString()}</p>
            </div>
            <div className="font-bold">S/ {exp.amount.toFixed(2)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
