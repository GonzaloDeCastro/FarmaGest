import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { addUsuarioAPI } from "../../redux/usuariosSlice";

const UsuarioFormModal = ({ Roles }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [show, setShow] = useState(false);
  const [roleDesc, setRoleDesc] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    if (data.password !== data.repeatPassword) {
      // Handle password mismatch
      return;
    }

    try {
      dispatch(
        addUsuarioAPI({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          rol_id: data.roleID === "" ? null : parseInt(data.roleID),
          Rol: roleDesc,
          contrasena: data.password,
        })
      );
      handleClose();
      setValue("nombre", "");
      setValue("apellido", "");
      setValue("correo", "");
      setValue("password", "");
      setValue("repeatPassword", "");
      setRoleDesc("");
    } catch {}
  };

  const handleChange = (e) => {
    const selectedRoleDesc =
      e.target.selectedOptions[0].getAttribute("data-user-role");
    setRoleDesc(selectedRoleDesc);
    setValue("roleID", e.target.value);
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Agregar Usuario</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  {...register("nombre", { required: true })}
                  autoFocus
                />
                {errors.nombre && (
                  <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                    Nombre requerido
                  </p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  className="form-control"
                  {...register("apellido", { required: true })}
                />
                {errors.apellido && (
                  <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                    Apellido requerido
                  </p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  className="form-control"
                  {...register("correo", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  })}
                />
                {errors.correo?.type === "required" && (
                  <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                    Correo requerido
                  </p>
                )}
                {errors.correo?.type === "pattern" && (
                  <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                    Correo inválido
                  </p>
                )}
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    {...register("password", {
                      required: true,
                      minLength: 12,
                      pattern: /^(?=.*\d)(?=.*[A-Z]).{12,}$/,
                    })}
                  />
                  {errors.password?.type === "required" && (
                    <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                      Contraseña requerida
                    </p>
                  )}
                  {errors.password?.type === "minLength" && (
                    <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                      La contraseña debe tener al menos 12 caracteres
                    </p>
                  )}
                  {errors.password?.type === "pattern" && (
                    <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                      La contraseña debe contener al menos un número y una letra
                      mayúscula
                    </p>
                  )}
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="repeatPassword">Repetir Password:</label>
                  <input
                    type="password"
                    id="repeatPassword"
                    className="form-control"
                    {...register("repeatPassword", { required: true })}
                  />
                  {errors.repeatPassword && (
                    <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                      Repetir contraseña requerida
                    </p>
                  )}
                  {watch("password") !== watch("repeatPassword") && (
                    <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="roleID">Roles:</label>
              <select
                id="roleID"
                className="form-select"
                {...register("roleID", { required: true })}
                onChange={handleChange}
              >
                <option value="" className="default-option">
                  Seleccionar rol
                </option>
                {Roles?.map((rol) => (
                  <option
                    key={rol.rol_id}
                    value={rol.rol_id}
                    data-user-role={rol.rol}
                  >
                    {rol.rol.charAt(0).toUpperCase() + rol.rol.slice(1)}
                  </option>
                ))}
              </select>
              {errors.roleID && (
                <p style={{ color: "#b70f0a", fontWeight: "bold" }}>
                  Rol requerido
                </p>
              )}
            </div>
            <Modal.Footer>
              <Button type="submit" className="buttonConfirm">
                <FaSave className="iconConfirm" />
                Confirmar
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UsuarioFormModal;
