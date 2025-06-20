import type { FormEvent } from "react";
import { useLogin } from "../api";
import { useToken } from "../contexts/TokenContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useLogin();
  const { saveToken } = useToken();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await login({ email, passwd: password });

    if (result.success && result.token) {
      saveToken(result.token);
      navigate("/dashboard"); // 🔁 Redirige a donde quieras después del login
    } else {
      alert(result.error ?? "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
