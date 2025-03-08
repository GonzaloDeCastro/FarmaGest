import React from "react";
import { Button, Modal } from "react-bootstrap";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { addObraSocialAPI } from "../../redux/obrasSocialesSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const ObraSocialForm = ({ usuarioId }) => {
  const dispatch = useDispatch();
  const [show, setShow] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      obraSocial: "",
      plan: "",
      descuento: "",
      codigo: "",
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onSubmit = (data) => {
    try {
      dispatch(
        addObraSocialAPI({
          obra_social: data.obraSocial,
          plan: data.plan,
          descuento: data.descuento,
          codigo: data.codigo,
          usuario_id: usuarioId,
        })
      );
      handleClose();
      reset(); // Limpiar los campos después de agregar la obra social
    } catch (error) {
      console.error("Error al agregar la obra social:", error);
    }
  };

  return (
    <>
      <div className="buttonNewItem" onClick={handleShow}>
        <FaPlusCircle
          style={{ width: "30px", height: "30px", marginRight: "5px" }}
        />
        <div>Nueva Obra Social</div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Nueva Obra Social</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group col-md-12">
                <label htmlFor="obraSocial">Obra Social:</label>
                <input
                  type="text"
                  id="obraSocial"
                  className="form-control"
                  {...register("obraSocial", {
                    required: "Este campo es obligatorio",
                  })}
                  autoFocus
                />
                {errors.obraSocial && (
                  <p className="text-danger">{errors.obraSocial.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="plan">Plan:</label>
                <input
                  type="text"
                  id="plan"
                  className="form-control"
                  {...register("plan", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.plan && (
                  <p className="text-danger">{errors.plan.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="descuento">Descuento:</label>
                <input
                  type="text"
                  id="descuento"
                  className="form-control"
                  {...register("descuento", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[0-9]*\.?[0-9]+$/,
                      message: "El descuento debe ser un número válido",
                    },
                  })}
                />
                {errors.descuento && (
                  <p className="text-danger">{errors.descuento.message}</p>
                )}
              </div>
              <div className="form-group col-md-12">
                <label htmlFor="codigo">Código:</label>
                <input
                  type="text"
                  id="codigo"
                  className="form-control"
                  {...register("codigo", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.codigo && (
                  <p className="text-danger">{errors.codigo.message}</p>
                )}
              </div>
            </div>
            <Modal.Footer>
              <Button className="buttonConfirm" type="submit">
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

export default ObraSocialForm;
