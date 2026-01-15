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
          paddingLeft: "clamp(20px, 5vh, 40px)",
          paddingRight: "clamp(20px, 5vh, 40px)",
          paddingTop: "clamp(40px, 8vh, 60px)",
          paddingBottom: "clamp(40px, 8vh, 60px)",
        }}
      >
        {/* Modal interior */}
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: 900,
            background: "#ffffff",
            borderRadius: 4,
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
