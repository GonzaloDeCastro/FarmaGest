import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { MdOutlineLockReset } from "react-icons/md";
import { resetPasswordDataAPI } from "../../redux/usuariosSlice";
const ResetPassword = ({ userID, userSelected, permissions_code }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleClose = () => {
    setPassword("");
    setRepeatPassword("");
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const correo = userSelected.Correo;
  console.log("userSelected ", userSelected);
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeRepeatPassword = (e) => setRepeatPassword(e.target.value);

  const isValidPassword = useMemo(() => {
    const minLength = 12;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;

    return (
      password.length >= minLength &&
      hasNumber.test(password) &&
      hasUpperCase.test(password)
    );
  }, [password]);

  useEffect(() => {
    if (!isValidPassword) {
      setPasswordError(
        "La contraseña debe tener al menos 12 caracteres, contener al menos un número y tener al menos una letra mayúscula y una minúscula."
      );
    } else if (password !== repeatPassword) {
      setPasswordError("Passwords diferentes");
    } else {
      setPasswordError("");
    }
  }, [password, repeatPassword, isValidPassword]);

  const handleConfirm = () => {
    if (!passwordError) {
      dispatch(resetPasswordDataAPI({ correo, password }));
      handleClose();
    }
  };

  return (
    <>
      <MdOutlineLockReset className="iconResetPassword" onClick={handleShow} />

      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header>
          <Modal.Title>
            Reset Password - {userSelected.Nombre} {userSelected.Apellido}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              maxLength="50"
              type="password"
              id="new-password"
              className="form-control"
              value={password}
              onChange={handleChangePassword}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="repeat-password">Repeat Password:</label>
            <input
              maxLength="50"
              type="password"
              id="repeat-password"
              className="form-control"
              value={repeatPassword}
              onChange={handleChangeRepeatPassword}
              autoComplete="new-password"
            />
          </div>
          {passwordError && (
            <p
              style={{ marginTop: "5px", color: "#b70f0a", fontWeight: "bold" }}
            >
              {passwordError}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!!passwordError}
          >
            Confirm
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResetPassword;
