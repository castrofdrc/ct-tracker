import { useContext } from "react";
import { UIContext } from "../UIContext";
import addIcon from "../../../assets/add.svg";
import settingsIcon from "../../../assets/settings.svg";
import listIcon from "../../../assets/list.svg";

export function BottomActionBar() {
  const ui = useContext(UIContext);

  return (
    <div
      style={{
        position: "fixed",
        // Suma el área segura del home indicator
        bottom: "calc(12px + env(safe-area-inset-bottom))",
        left: 12,
        right: 12,
        height: 56,
        zIndex: 100,
        background: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
      }}
    >
      <button
        onClick={() => ui.goTo("settings")}
        style={{
          width: 44,
          height: 44,
          padding: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={settingsIcon}
          alt="Configuración"
          style={{
            width: 26,
            height: 26,
            display: "block",
          }}
        />
      </button>

      {/* Acción principal */}
      <button
        onClick={() => ui.setAddActionButton((v) => !v)}
        style={{
          width: 44,
          height: 44,
          padding: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={addIcon}
          alt="Agregar"
          style={{
            width: 36,
            height: 36,
          }}
        />
      </button>

      {/* Lista */}
      <button
        onClick={() => ui.goTo("list")}
        style={{
          width: 44,
          height: 44,
          padding: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={listIcon}
          alt="Configuración"
          style={{
            width: 21,
            height: 21,
            display: "block",
          }}
        />
      </button>
    </div>
  );
}
