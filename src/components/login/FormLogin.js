import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import logo from "../../imgs/logoFG.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getUsuarioLoginAPI } from "../../redux/usuariosSlice";

const FormLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UsuarioLogin = useSelector((state) => state.usuario.loginState);

  const onSubmit = (data) => {
    dispatch(getUsuarioLoginAPI(data.correo, data.password));
  };

  useEffect(() => {
    if (UsuarioLogin && UsuarioLogin.correo !== undefined) {
      sessionStorage.setItem(
        "logged",
        JSON.stringify({ sesion: UsuarioLogin })
      );
      console.log("aca llega?");
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
        <input type="text" {...register("correo", { required: true })} />
        {errors.correo && (
          <p className="errorsHandler">Este campo correo es requerido</p>
        )}
        <label htmlFor="password">Contraseña</label>
        <input type="password" {...register("password", { required: true })} />
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
