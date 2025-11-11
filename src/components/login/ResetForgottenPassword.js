import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../config";

const ResetForgottenPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(`${API}/usuarios/reset-password`, {
        token,
        newPassword,
      });
      setMessage(response?.data?.mensaje || "Contraseña actualizada con éxito.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(
        error?.response?.data?.mensaje ||
          "No fue posible actualizar la contraseña. Revisa el enlace o solicita uno nuevo."
      );
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Actualizar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetForgottenPassword;
