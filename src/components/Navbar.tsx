// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useToken } from "../contexts/TokenContext";

export default function Navbar() {
  const { token, removeToken } = useToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold hover:underline">
        Ahorrista 💰
      </Link>

      <ul className="flex space-x-4">
        {!token ? (
          <>
            <li>
              <Link to="/signup" className="hover:underline">Registrarse</Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">Iniciar Sesión</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard" className="hover:underline">Resumen</Link>
            </li>
            <li>
              <Link to="/expenses-detail" className="hover:underline">Detalle de Gasto</Link>
            </li>
            <li>
              <Link to="/create-expense" className="hover:underline">Nuevo Gasto</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="hover:underline">Cerrar Sesión</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
