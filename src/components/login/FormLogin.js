import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logo from "../../imgs/logoFG.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getUsuarioLoginAPI } from "../../redux/usuariosSlice";
import axios from "axios";
import Bowser from "bowser";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";

const FormLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UsuarioLogin = useSelector((state) => state.usuario.loginState);
  const [viewPassword, setViewPassword] = useState(false);
  const onSubmit = async (data) => {
    const response = await axios.get("https://api.ipify.org?format=json");
    const ip_address = response.data.ip;
    const browser = Bowser.parse(navigator.userAgent);
    const user_agent = browser.browser.name + " " + browser.browser.version;
    dispatch(
      getUsuarioLoginAPI(data.correo, data.password, ip_address, user_agent)
    );
  };

  useEffect(() => {
    if (UsuarioLogin && UsuarioLogin.correo !== undefined) {
      sessionStorage.setItem(
        "logged",
        JSON.stringify({ sesion: UsuarioLogin })
      );

      navigate("/");
    } else if (UsuarioLogin && UsuarioLogin.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error en Login",
        text: "El usuario o contraseña es incorrecto.",
      });
    }
  }, [UsuarioLogin, navigate]);

  const buttonOlvidoPassword = () => {
    Swal.fire({
      title: "Recuperación de contraseña",
      text: `Envie un correo al administrador gonzalo@example.com`,
      icon: "info",
    });
  };

  return (
    <div className="login">
      <div className="logo-container">
        <img className="logo" src={logo} alt="not logo" />
      </div>

      <form className="formulario" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="correo">Correo</label>
        <input
          type="text"
          {...register("correo", { required: true })}
          autoFocus
        />
        {errors.correo && (
          <p className="errorsHandler">Este campo correo es requerido</p>
        )}

        <label htmlFor="password">Contraseña</label>
        <div style={{ position: "relative", width: "20%" }}>
          <input
            type={viewPassword ? "text" : "password"}
            {...register("password", { required: true })}
            style={{ width: "100%", paddingRight: "40px" }} // Espacio para el ícono
          />
          {viewPassword ? (
            <IoEyeSharp
              onClick={() => setViewPassword(!viewPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "30%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#d2d2d2",
                width: "24px",
                height: "24px",
              }}
            />
          ) : (
            <IoEyeOffSharp
              onClick={() => setViewPassword(!viewPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "30%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#d2d2d2",
                width: "24px",
                height: "24px",
              }}
            />
          )}
        </div>
        {errors.password && (
          <p className="errorsHandler">El campo contraseña es requerido</p>
        )}

        <label
          className="forgetPassword"
          style={{ fontSize: "13px", marginTop: "-20px" }}
          onClick={buttonOlvidoPassword}
        >
          Olvidó su contraseña?
        </label>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default FormLogin;
