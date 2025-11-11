import { useState } from "react";
import axios from "axios";
import API from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${API}/usuarios/forgot-password`, {
        email,
      });
      setMessage(
        res?.data?.mensaje ||
          "Si el correo corresponde a un usuario registrado, enviaremos instrucciones en breve."
      );
    } catch (error) {
      setMessage(
        error?.response?.data?.mensaje ||
          "No pudimos enviar el correo de recuperación. Intenta nuevamente."
      );
    }
  };

  return (
    <div>
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ingrese su correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
