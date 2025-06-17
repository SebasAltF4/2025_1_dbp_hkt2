// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { useToken } from "../contexts/TokenContext";

export default function Navbar() {
  const { token, removeToken } = useToken();
  return (
    <nav className="p-4 bg-gray-100 flex justify-between">
      <span className="font-bold">AuthApp</span>
      <div className="space-x-4">
        {!token && (
          <>
            <Link to="/">Registro</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {token && (
          <>
            <Link to="/protected">Protected</Link>
            <button onClick={removeToken} className="ml-2 text-red-500">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
