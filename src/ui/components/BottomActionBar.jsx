export function BottomActionBar() {
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
        onClick={() => console.log("config")}
      >
        Conf
      </button>

      {/* Acción principal */}
      <button
        style={{
          background: "transparent",
          border: "none",
          fontSize: "0.85em",
        }}
        onClick={() => console.log("new")}
      >
        More
      </button>

      {/* Lista */}
      <button
        style={{
          background: "transparent",
          border: "none",
          fontSize: "0.85em",
        }}
        onClick={() => console.log("list")}
      >
        List
      </button>
    </div>
  );
}
