import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSave, FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { editUsuarioAPI } from "../../redux/usuariosSlice";

const EditUsuarioFormModal = ({ usuarioSelected, Roles }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: usuarioSelected?.Nombre || "",
      apellido: usuarioSelected?.Apellido || "",
      correo: usuarioSelected?.Correo || "",
      roleID: usuarioSelected?.rol_id || "",
    },
  });

  const [show, setShow] = useState(false);
  const [roleDesc, setRoleDesc] = useState(usuarioSelected?.Rol || "");
  const [userID, setUserID] = useState(usuarioSelected?.usuario_id || "");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    try {
      dispatch(
        editUsuarioAPI({
          usuario_id: parseInt(userID),
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          rol_id: data.roleID === "" ? null : parseInt(data.roleID),
          Rol: roleDesc,
        })
      );
      handleClose();
    } catch {}
  };

  const handleChangeRole = (e) => {
    const selectedRoleDesc =
      e.target.selectedOptions[0].getAttribute("data-user-role");
    setRoleDesc(selectedRoleDesc);
    setValue("roleID", e.target.value);
  };

  useEffect(() => {
    if (usuarioSelected) {
      setValue("nombre", usuarioSelected.Nombre);
      setValue("apellido", usuarioSelected.Apellido);
      setValue("correo", usuarioSelected.Correo);
      setValue("roleID", usuarioSelected.rol_id);
      setRoleDesc(usuarioSelected.Rol);
      setUserID(usuarioSelected.usuario_id);
    }
  }, [usuarioSelected, setValue]);

  return (
    <>
      <FaEdit className="iconABM" onClick={handleShow} />

      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Usuario</Modal.Title>
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
            </div>
            <div className="form-group col-md-12">
              <label htmlFor="roleID">Roles:</label>
              <select
                id="roleID"
                className="form-select"
                {...register("roleID", { required: true })}
                onChange={handleChangeRole}
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
                Editar
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

export default EditUsuarioFormModal;
