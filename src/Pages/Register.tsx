import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (passwd.length < 12) {
      setError("La contraseña debe tener al menos 12 caracteres");
      return;
    }

    const success = await register(email, passwd);
    if (success) navigate("/login");
    else setError("Error al registrar. El correo puede estar en uso.");
  };

  return (
    <div>
      <h1>Registrarse</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
      <input value={passwd} onChange={(e) => setPasswd(e.target.value)} type="password" placeholder="Contraseña" />
      <button onClick={handleRegister}>Crear cuenta</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
