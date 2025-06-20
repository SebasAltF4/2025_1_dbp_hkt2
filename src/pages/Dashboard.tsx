// src/pages/Dashboard.tsx
import { useEffect, useState, useMemo } from "react";
import { useToken } from "../contexts/TokenContext";
import { useExpensesSummary } from "../api";

interface RawExpense {
  id: number;
  expenseCategory: {
    id: number;
    name: string;
  };
  year: number;
  month: number;
  amount: number;
}

interface Grouped {
  categoryName: string;
  month: number;
  totalAmount: number;
}

export default function Dashboard() {
  const { token } = useToken();
  const { fetchSummary } = useExpensesSummary();
  const [rawData, setRawData] = useState<RawExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getData = async () => {
      const result = await fetchSummary(token ?? "");
      if (result.success) {
        setRawData(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };
    getData();
  }, [token]);

  // ✅ Agrupación optimizada: por Categoria + Mes (sin año)
  const grouped = useMemo(() => {
    const map = new Map<string, Grouped>();

    rawData.forEach((item) => {
      const key = `${item.expenseCategory.name}-${item.month}`;
      if (!map.has(key)) {
        map.set(key, {
          categoryName: item.expenseCategory.name,
          month: item.month,
          totalAmount: 0,
        });
      }
      map.get(key)!.totalAmount += item.amount;
    });

    return Array.from(map.values()).sort((a, b) => {
      // Ordena por Categoria ASC, Mes ASC
      const catCompare = a.categoryName.localeCompare(b.categoryName);
      if (catCompare !== 0) return catCompare;
      return a.month - b.month;
    });
  }, [rawData]);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Resumen mensual por categoría y mes</h1>

      {loading && <p className="text-center">Cargando...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Categoría</th>
            <th className="border p-2">Mes</th>
            <th className="border p-2">Monto Total</th>
          </tr>
        </thead>
        <tbody>
          {grouped.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border p-2">{item.categoryName}</td>
              <td className="border p-2">{item.month}</td>
              <td className="border p-2">S/ {item.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
