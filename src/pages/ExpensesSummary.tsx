// src/pages/ExpensesSummary.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useToken } from "../contexts/TokenContext";
import { Link } from "react-router-dom";

type RawExpense = {
  id: number;
  expenseCategory: {
    id: number;
    name: string;
  };
  year: number;
  month: number;
  amount: number;
};

type SummaryItem = {
  categoryId: number;
  categoryName: string;
  year: number;
  month: number;
  total: number;
};

export default function ExpensesSummary() {
  const { token } = useToken();
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get<RawExpense[]>(
          "http://198.211.105.95:8080/expenses_summary",
          {
            headers: {
              Authorization: `Bearer ${token ?? ""}`,
            },
          }
        );

        // Agrupa por categoría + año + mes:
        const grouped: Record<string, SummaryItem> = {};

        response.data.forEach((item) => {
          const key = `${item.expenseCategory.id}-${item.year}-${item.month}`;
          if (!grouped[key]) {
            grouped[key] = {
              categoryId: item.expenseCategory.id,
              categoryName: item.expenseCategory.name,
              year: item.year,
              month: item.month,
              total: 0,
            };
          }
          grouped[key].total += item.amount;
        });

        const result = Object.values(grouped).sort((a, b) => {
          if (a.categoryName !== b.categoryName) {
            return a.categoryName.localeCompare(b.categoryName);
          } else if (a.year !== b.year) {
            return b.year - a.year;
          } else {
            return b.month - a.month;
          }
        });

        setSummary(result);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el resumen");
      }
    };

    fetchSummary();
  }, [token]);

  return (
    <div className="p-6 max-w-5xl mx-auto mt-20">
      <h2 className="text-2xl mb-4 font-bold">Resumen de gastos por categoría</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-left">Año</th>
              <th className="px-4 py-2 text-left">Mes</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item) => (
              <tr key={`${item.categoryId}-${item.year}-${item.month}`} className="border-t">
                <td className="px-4 py-2">
                  <Link
                    to={`/expenses_detail?categoryId=${item.categoryId}`}
                    className="text-blue-600 underline"
                  >
                    {item.categoryName}
                  </Link>
                </td>
                <td className="px-4 py-2">{item.year}</td>
                <td className="px-4 py-2">{item.month}</td>
                <td className="px-4 py-2 text-right">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
