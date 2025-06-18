import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../api";
import { useToken } from "../contexts/TokenContext";

export default function Signup() {
  const [form, setForm] = useState({ email: "", passwd: "" });
  const [error, setError] = useState("");
  const { signup } = useSignup();
  const { saveToken } = useToken();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signup(form);

    if (result.success && result.token) {
      saveToken(result.token);
      navigate("/login");
    } else {
      setError(result.error ?? "Error al registrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-gray-800"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Registro</h2>
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
        <input
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          required
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          type="password"
          name="passwd"
          placeholder="Contraseña"
          required
          value={form.passwd}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
