import { useEffect, useState } from "react";
import axios from "axios";
import { useToken } from "../contexts/TokenContext";
import { useNavigate } from "react-router-dom";

interface SummaryItem {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
}

export default function Dashboard() {
  const { token } = useToken();
  const [summary, setSummary] = useState<SummaryItem[]>([]);
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
        setSummary(res.data);
      } catch (err) {
        console.error("Error al obtener resumen:", err);
        setError("No se pudo cargar el resumen de gastos.");
      }
    };

    if (token) {
      fetchSummary();
    }
  }, [token]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold text-center">
        Resumen mensual de gastos
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-3">
        {summary.map((item) => (
          <li
            key={item.categoryId}
            onClick={() => navigate(`/expenses/${item.categoryId}`)}
            className="cursor-pointer border p-3 rounded hover:bg-gray-100 flex justify-between"
          >
            <span>{item.categoryName}</span>
            <span>S/ {item.totalAmount.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
