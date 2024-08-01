import React, { useEffect, useState } from "react";
import logo from "../../imgs/logoFG.png";
import { useNavigate } from "react-router-dom";
import { getUsuarioLoginAPI } from "../../redux/usuariosSlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
const FormLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const UsuarioLogin = useSelector((state) => state.usuario.loginState);
  console.log("UsuarioLogin ", UsuarioLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(false);
    dispatch(getUsuarioLoginAPI(correo, password));
  };

  useEffect(() => {
    if (UsuarioLogin && UsuarioLogin.length > 0) {
      sessionStorage.setItem(
        "logged",
        JSON.stringify({ sesion: UsuarioLogin })
      );
      navigate("/productos");
    } else if (UsuarioLogin && UsuarioLogin.length == 0) {
      Swal.fire({
        icon: "error",
        title: "Error en Login",
        text: "El usuario o contraseña es incorrecto.",
      });
    }
  }, [handleSubmit]);

  return (
    <div className="login">
      <div className="logo-container">
        <img className="logo" src={logo} alt="not logo" />
      </div>

      <form className="formulario" onSubmit={handleSubmit}>
        <label htmlFor="correo">Usuario / Correo</label>
        <input
          type="text"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
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
