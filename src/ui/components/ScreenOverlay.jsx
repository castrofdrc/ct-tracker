export function ScreenOverlay({ children }) {
  return (
    <>
      {/* Fondo semi-transparente */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.50)",
          zIndex: 1000,
        }}
      />

      {/* Contenedor del modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(20px, 5vh, 40px)",
        }}
      >
        {/* Modal interior */}
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: 900,
            background: "#ffffff",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
