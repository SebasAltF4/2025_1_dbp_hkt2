import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface SummaryItem {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
}

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://198.211.105.95:8080/expenses_summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(res.data);
    } catch (err) {
      setError("Error al cargar el resumen de gastos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div>
      <h1>Resumen mensual de gastos</h1>
      <button onClick={logout}>Cerrar sesión</button>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {summary.map((item) => (
          <li key={item.categoryId}>
            <strong>{item.categoryName}</strong>: S/ {item.totalAmount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
