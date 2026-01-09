import logo from "../../../assets/only-logo.svg";

export function LoadingScreen({ label = " " }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <img
        src={logo}
        alt=""
        style={{
          width: 64,
          height: 64,
          animation: "spin 1.8s linear infinite",
          opacity: 0.8,
        }}
      />

      <div style={{ fontSize: 14, opacity: 0.6 }}>{label}</div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
