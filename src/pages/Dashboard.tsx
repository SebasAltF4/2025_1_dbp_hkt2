// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SummaryItem {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
}

export default function Dashboard() {
  const { token } = useToken();
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("/expenses_summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        setSummary(data);
      } catch (err) {
        setError("Error al cargar el resumen de gastos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token]);

  const goToDetails = (categoryId: number) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    navigate(`/expenses-detail/${categoryId}?year=${year}&month=${month}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Resumen mensual</h1>

      {loading && <p className="text-center">Cargando...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <ul className="space-y-4">
        {summary.map((item) => (
          <li
            key={item.categoryId}
            className="flex justify-between items-center bg-white shadow p-4 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => goToDetails(item.categoryId)}
          >
            <span>{item.categoryName}</span>
            <strong>S/ {item.totalAmount.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
