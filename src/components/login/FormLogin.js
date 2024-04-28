import React, { useState } from "react";
import logo from "../../imgs/logoFG.png";
const FormLogin = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === "" || password === "") {
      setError(true);
      return;
    }
    setError(false);
    setIsLoggedIn([user]);
  };

  return (
    <div className="login">
      <div className="logo-container">
        <img className="logo" src={logo} alt="not logo" />
      </div>

      <form className="formulario" onSubmit={handleSubmit}>
        <label htmlFor="user">Usuario</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Iniciar sesión </button>
        {error && <p>Todos los campos deben estar completos</p>}
      </form>
    </div>
  );
};

export default FormLogin;
