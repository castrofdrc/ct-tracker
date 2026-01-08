import logo from "../../../assets/logo.svg";

export function HomeScreen({
  email,
  password,
  setEmail,
  setPassword,
  onLogin,
}) {
  const fieldStyle = {
    width: "100%",
    height: 55,
    borderRadius: 8,
    border: "1px solid #0A0A0A",
    padding: "0 14px",
    fontSize: 16,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  // Wrapper para manejar el evento Enter del teclado
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          height: "100%",
          paddingLeft: "15%",
          paddingRight: "15%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Roboto, system-ui, sans-serif",
          color: "#0A0A0A",
        }}
      >
        {/* Spacer Top: Se permite encoger un poco en pantallas muy chicas */}
        <div style={{ height: 73, flexShrink: 1, minHeight: 20 }} />

        {/* Logo: Se permite encoger (flexShrink: 1) para salvar la pantalla en móviles pequeños */}
        <img
          src={logo}
          alt="CT Tracker"
          style={{
            width: 226,
            height: 277,
            objectFit: "contain",
            flexShrink: 1, // VITAL: Permite que el logo se achique si no hay espacio
            minHeight: 100, // Límite para que no desaparezca
          }}
        />

        {/* Spacer Logo-Inputs: Se comprime agresivamente si es necesario */}
        <div style={{ height: 107, flexShrink: 2, minHeight: 30 }} />

        {/* FORM WRAPPER: Para funcionalidad de teclado */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            type="email"
            placeholder="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={fieldStyle}
          />

          <div style={{ height: 20 }} />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={fieldStyle}
          />

          <button
            type="button" // Type button para que no dispare submit
            onClick={() => {}}
            style={{
              marginTop: 16,
              background: "none",
              border: "none",
              fontSize: 12,
              fontFamily: "inherit",
              textDecoration: "underline",
              cursor: "pointer",
              opacity: 0.5,
            }}
          >
            Olvidaste la contraseña?
          </button>

          <div style={{ height: 45 }} />

          <button
            type="submit" // Type submit activa el onLogin al dar Enter
            style={{
              ...fieldStyle,
              background: "#0A0A0A",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ingresar
          </button>
        </form>

        {/* ELIMINADO: <div style={{ height: 73 }} /> que sobraba aquí */}

        {/* Este flex: 1 empuja el registro hacia abajo */}
        <div style={{ flex: 1 }} />

        <div
          style={{
            marginTop: 24, // Margen mínimo seguro
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            fontSize: 14,
            fontFamily: "inherit",
          }}
        >
          <span>No tienes cuenta aún?</span>
          <button
            onClick={() => {}}
            style={{
              background: "none",
              border: "none",
              fontWeight: 700,
              textDecoration: "underline",
              cursor: "pointer",
              color: "#0A0A0A",
              fontFamily: "inherit",
            }}
          >
            Regístrate
          </button>
        </div>

        {/* Spacer Bottom: Se mantiene firme para la estética */}
        <div style={{ height: 73, flexShrink: 0 }} />
      </div>
    </div>
  );
}
