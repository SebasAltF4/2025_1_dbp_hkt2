// src/pages/Login.tsx
import { type FormEvent } from "react";
import { useLogin } from "../api";
import { useToken } from "../contexts/TokenContext.tsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useLogin();
    const { saveToken } = useToken();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const passwd = formData.get("password") as string;

        const result = await login({ email, passwd});

        if (result.success && result.token) {
        saveToken(result.token);
        navigate("/protected");
        } else {
        alert(result.error ?? "Error al iniciar sesión");
        }
    };

    return (
        <div className="p-6 max-w-sm mx-auto mt-10 bg-white rounded shadow">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border px-3 py-2 rounded"
            />
            <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            className="w-full border px-3 py-2 rounded"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded">
            Login
            </button>
        </form>
        </div>
    );
}
