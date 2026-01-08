import { useContext } from "react";
import { UIContext } from "../UIContext";
import { useAuth } from "../../auth/useAuth";

import logoutIcon from "../../../assets/logout.svg";
import exitProjectIcon from "../../../assets/exit-project.svg";

export function SettingsScreen() {
  const ui = useContext(UIContext);
  const { logout } = useAuth();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        padding: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <button
          onClick={() => ui.goTo("main")}
          style={{
            background: "none",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          ← Ajustes
        </button>
      </div>

      {/* Acciones */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Salir del proyecto */}
        <button
          onClick={() => {
            ui.closeProject();
            ui.goTo("projects");
          }}
          style={actionStyle}
        >
          <img src={exitProjectIcon} alt="" style={iconStyle} />
          Salir del proyecto
        </button>

        {/* Logout */}
        <button
          onClick={async () => {
            ui.resetSession();
            await logout();
          }}
          style={{
            ...actionStyle,
            color: "#dc2626",
            borderColor: "#dc2626",
          }}
        >
          <img src={logoutIcon} alt="" style={iconStyle} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

const actionStyle = {
  height: 44,
  borderRadius: 8,
  border: "1px solid #000",
  background: "#fff",
  fontSize: 16,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "0 16px",
};

const iconStyle = {
  width: 20,
  height: 20,
};
