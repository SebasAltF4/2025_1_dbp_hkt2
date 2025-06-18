// src/components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useToken } from "../contexts/TokenContext";

export default function Navbar() {
  const { token, removeToken } = useToken();
  const location = useLocation();

  const navItems = token
    ? [
        { path: "/expenses_summary", label: "Resumen de Gastos" },
        { path: "/expenses_detail", label: "Detalle de Categoría" },
        { path: "/add_expense", label: "Agregar Gasto" },
        { path: "/", label: "Cerrar Sesión", isLogout: true },
      ]
    : [
        { path: "/login", label: "Iniciar Sesión" },
        { path: "/", label: "Registro" },
      ];

  const handleLogout = () => {
    removeToken();
  };

  return (
    <nav className="bg-white shadow border-b w-full fixed z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-600">Hackaton 2</h1>
        <ul className="list-none flex gap-4">
          {navItems.map((item) =>
            item.isLogout ? (
              <li key={item.path}>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-3 py-1 rounded ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
}
