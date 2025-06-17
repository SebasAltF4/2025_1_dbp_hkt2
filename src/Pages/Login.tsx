import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const success = await login(email, passwd);
    if (success) navigate("/dashboard");
    else setError("Correo o contraseña incorrectos");
  };

  return (
  <div className="container">
    <h1>Iniciar sesión</h1>
    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
    <input value={passwd} onChange={(e) => setPasswd(e.target.value)} type="password" placeholder="Contraseña" />
    <button onClick={handleLogin}>Ingresar</button>
    {error && <p style={{ color: "red" }}>{error}</p>}
  </div>
);

}
