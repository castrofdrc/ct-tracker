import { useContext } from "react";
import { UIContext } from "../UIContext";
import addIcon from "../../../assets/add.svg";

export function BottomActionBar() {
  const ui = useContext(UIContext);

  return (
    <div
      style={{
        position: "fixed",
        // CAMBIO CRÍTICO: Suma el área segura del home indicator
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
        padding: "0 16px",
      }}
    >
      {/* ... tus botones siguen igual ... */}
      <button
        style={{
          background: "transparent",
          border: "none",
          fontSize: "0.85em",
          padding: 10, // Aumentar área de toque (fat finger friendly)
        }}
        onClick={() => ui.goTo("settings")}
      >
        Conf
      </button>

      {/* Acción principal */}
      <button
        onClick={() => ui.setAddActionButton((v) => !v)}
        style={{
          background: "transparent",
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <img
          src={addIcon}
          alt="Agregar"
          style={{
            width: 40,
            height: 40,
          }}
        />
      </button>

      {/* Lista */}
      <button
        style={{
          background: "transparent",
          border: "none",
          fontSize: "0.85em",
        }}
        onClick={() => ui.goTo("cameraList")}
      >
        List
      </button>
    </div>
  );
}
