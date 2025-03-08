import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addProveedorAPI } from "../../redux/proveedoresSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const ProveedorForm = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    setShow(false);
    reset();
  };
  const handleShow = () => setShow(true);

  const handleAddProveedor = (data) => {
    try {
      dispatch(addProveedorAPI(data));
      handleClose();
    } catch (error) {
      console.error("Error al agregar el proveedor:", error);
    }
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Nuevo Proveedor</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleAddProveedor)}>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="razonSocial">Razón Social:</label>
                <input
                  type="text"
                  id="razonSocial"
                  className="form-control"
                  {...register("razon_social", {
                    required: "Este campo es requerido",
                  })}
                  autoFocus
                />
                {errors.razon_social && (
                  <p style={{ color: "red" }}>{errors.razon_social.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  className="form-control"
                  {...register("direccion", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.direccion && (
                  <p style={{ color: "red" }}>{errors.direccion.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="text"
                  id="telefono"
                  className="form-control"
                  {...register("telefono", {
                    required: "Este campo es requerido",
                  })}
                />
                {errors.telefono && (
                  <p style={{ color: "red" }}>{errors.telefono.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  {...register("email", {
                    required: "Este campo es requerido",
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Email inválido",
                    },
                  })}
                />
                {errors.email && (
                  <p style={{ color: "red" }}>{errors.email.message}</p>
                )}
              </div>
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

export default ProveedorForm;
