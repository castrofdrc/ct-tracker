import { useContext } from "react";
import { UIContext } from "../UIContext";
import { useAuth } from "../../auth/useAuth";

import logoutIcon from "../../../assets/logout.svg";
import exitProjectIcon from "../../../assets/exit-project.svg";

export function SettingsScreen() {
  const ui = useContext(UIContext);
  const { logout } = useAuth();

  const actionStyle = {
    width: "100%",
    height: 55, // Estandarizado con Login/ProjectSelector
    borderRadius: 8,
    border: "1px solid #0A0A0A", // Color consistente
    background: "#ffffff",
    fontSize: 16,
    fontWeight: 500, // Roboto Medium
    display: "flex",
    alignItems: "center",
    gap: 16, // Más aire entre icono y texto
    padding: "0 20px",
    cursor: "pointer",
    textAlign: "left",
  };

  const iconStyle = {
    width: 24, // Iconos ligeramente más grandes para balancear los 55px de alto
    height: 24,
    objectFit: "contain",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        display: "flex",
        justifyContent: "center", // Centrado horizontal para tablets/desktop
        zIndex: 2000, // Asegura que tape todo
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430, // Mismo contenedor que pantallas anteriores
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingLeft: "15%",
          paddingRight: "15%", // Margen lateral seguro
          // Padding superior dinámico para salvar el Notch
          paddingTop: "calc(16px + env(safe-area-inset-top))",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
          boxSizing: "border-box",
        }}
      >
        {/* Header de Navegación */}
        <div
          style={{
            height: 60, // Área de toque generosa para volver
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
            marginLeft: -8, // Compensación óptica para alinear el icono con el borde
          }}
        >
          <button
            onClick={() => ui.goTo("main")}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 18, // Título más prominente
              fontWeight: 700,
              cursor: "pointer",
              padding: "10px 8px", // Hitbox invisible más grande
              color: "#0A0A0A",
            }}
          >
            <span style={{ fontSize: 24, lineHeight: 0.5 }}>←</span>
            Ajustes
          </button>
        </div>

        {/* Grupo de Acciones */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h2
            style={{
              fontSize: 14,
              color: "#666",
              margin: "0 0 8px 4px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            General
          </h2>

          {/* Salir del proyecto */}
          <button
            onClick={() => {
              ui.closeProject();
              ui.goTo("projects");
            }}
            style={actionStyle}
          >
            <img src={exitProjectIcon} alt="" style={iconStyle} />
            Salir del proyecto actual
          </button>

          <div style={{ height: 20 }} />

          <h2
            style={{
              fontSize: 14,
              color: "#666",
              margin: "0 0 8px 4px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Cuenta
          </h2>

          {/* Logout */}
          <button
            onClick={async () => {
              ui.resetSession();
              await logout();
            }}
            style={{
              ...actionStyle,
              borderColor: "#fee2e2", // Borde rojo muy sutil
              background: "#fef2f2", // Fondo rojo muy sutil (alerta)
              color: "#dc2626",
            }}
          >
            {/* Nota: Si el SVG no es rojo nativamente, necesitarás una máscara CSS o un SVG diferente */}
            <img src={logoutIcon} alt="" style={iconStyle} />
            Cerrar sesión
          </button>
        </div>

        {/* Versión de la app (buena práctica en settings) */}
        <div style={{ flex: 1 }} />
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#999",
            marginBottom: 20,
          }}
        >
          v1.0.0
        </div>
      </div>
    </div>
  );
}
