import { useEffect, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import { useNavigate } from "react-router-dom";
import { useExpensesSummary } from "../api";

interface SummaryItem {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
}

export default function Dashboard() {
  const { token } = useToken();
  const { fetchSummary } = useExpensesSummary();
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSummary = async () => {
      if (!token) return;

      const result = await fetchSummary(token);

      if (result.success) {
        setSummary(result.data);
      } else {
        setError(result.error);
      }
    };

    loadSummary();
  }, [token]);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = summary.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(summary.length / itemsPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold text-center">
        Resumen mensual de gastos
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4 flex justify-between items-center">
        <label className="text-sm">
          Mostrar{" "}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>{" "}
          filas por página
        </label>
        <div className="text-sm">
          Página {currentPage} de {totalPages}
        </div>
      </div>

      <table className="w-full border border-gray-300 rounded text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Categoría</th>
            <th className="p-2 border">Monto total</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr
              key={item.categoryId}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/expenses/${item.categoryId}`)}
            >
              <td className="p-2 border">{item.categoryName}</td>
              <td className="p-2 border">S/ {item.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-4 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Anterior
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
