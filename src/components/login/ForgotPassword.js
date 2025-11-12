import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(
      "Si el correo corresponde a un usuario registrado, enviaremos instrucciones en breve."
    );
    setEmail("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, rgba(46,125,50,0.18), rgba(23,23,23,1) 55%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "18px",
          padding: "32px",
          color: "#f7f7f7",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
        }}
      >
        <h2
          style={{
            marginBottom: "12px",
            fontWeight: 600,
            fontSize: "1.6rem",
            textAlign: "center",
          }}
        >
          Recuperar contraseña
        </h2>
        <p
          style={{
            marginBottom: "24px",
            fontSize: "0.95rem",
            color: "rgba(247,247,247,0.75)",
            textAlign: "center",
          }}
        >
          Ingresá tu correo electrónico y, si encontramos una cuenta asociada,
          te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label
            htmlFor="email"
            style={{ fontSize: "0.9rem", letterSpacing: "0.01em" }}
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.35)",
              backgroundColor: "rgba(0,0,0,0.35)",
              color: "#ffffff",
              fontSize: "1rem",
              transition: "border 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.border = "1px solid rgba(46,125,50,0.9)";
              e.target.style.boxShadow = "0 0 0 3px rgba(46,125,50,0.3)";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid rgba(255,255,255,0.35)";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            disabled={!email}
            style={{
              marginTop: "8px",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "none",
              background:
                "linear-gradient(135deg, rgba(46,125,50,1), rgba(56,142,60,0.85))",
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: email ? "pointer" : "not-allowed",
              opacity: email ? 1 : 0.5,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseDown={(e) => {
              if (!email) return;
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Enviar enlace
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "24px",
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "rgba(46,125,50,0.25)",
              color: "#c8e6c9",
              fontSize: "0.95rem",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
