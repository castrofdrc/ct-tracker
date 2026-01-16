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
    height: 55,
    borderRadius: 6,
    border: "1px solid #0A0A0A",
    background: "#ffffff",
    fontSize: 16,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "0 20px",
    cursor: "pointer",
    textAlign: "left",
  };

  const iconStyle = {
    width: 24,
    height: 24,
    objectFit: "contain",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        display: "flex",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingLeft: "15%",
          paddingRight: "15%",
          paddingTop: "calc(16px + env(safe-area-inset-top))",
          paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
          boxSizing: "border-box",
        }}
      >
        {/* Header de Navegación */}
        <div
          style={{
            height: 60,
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
            marginLeft: -8,
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
              fontSize: 18,
              fontWeight: 700,
              cursor: "pointer",
              padding: "10px 8px",
              color: "#0A0A0A",
            }}
          >
            <span style={{ fontSize: 24, lineHeight: 0.5 }}>←</span>
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
          {/* ===== SECCIÓN: PROYECTO ===== */}
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
            Proyecto
          </h2>

          {/* Crear nuevo proyecto */}
          <button onClick={() => ui.goTo("newProject")} style={actionStyle}>
            <span style={{ fontSize: 24 }}>+</span>
            Crear nuevo proyecto
          </button>

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

          {/* ===== SECCIÓN: CUENTA ===== */}
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
              borderColor: "#fee2e2",
              background: "#fef2f2",
              color: "#dc2626",
            }}
          >
            <img src={logoutIcon} alt="" style={iconStyle} />
            Cerrar sesión
          </button>
        </div>

        {/* Versión de la app */}
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
