// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../api";
import { useToken } from "../contexts/TokenContext.tsx";

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
  navigate("/protected");
} else {
  setError(result.error ?? "Error al registrar");
}
};



  return (
    <div className="p-6 max-w-sm mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 text-center">Registro</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="passwd"
          type="password"
          placeholder="Contraseña"
          value={form.passwd}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">Registrarse</button>
      </form>
    </div>
  );
}
