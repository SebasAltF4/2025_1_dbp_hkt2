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
      <h1 className="text-xl font-bold">Ahorrista 💰</h1>
      {token && (
        <ul className="flex space-x-4">
          <li>
            <Link to="/dashboard" className="hover:underline">Resumen</Link>
          </li>
          <li>
            <Link to="/create-expense" className="hover:underline">Nuevo Gasto</Link>
          </li>
          <li>
            <Link to="/goals" className="hover:underline">Metas</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="hover:underline">Cerrar sesión</button>
          </li>
        </ul>
      )}
    </nav>
  );
}
