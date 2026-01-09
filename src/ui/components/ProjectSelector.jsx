import { useContext, useEffect, useState } from "react";
import { UIContext } from "../../ui/UIContext";
import { useAuth } from "../../auth/useAuth";
import { useProjects } from "../../project/useProjects";
import { listenToUser } from "../../services/users.service";
import { LoadingScreen } from "../../ui/screens/LoadingScreen";

export function ProjectSelector() {
  const ui = useContext(UIContext);
  const { user, logout } = useAuth();
  const { projects, loading } = useProjects(user);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = listenToUser(
      user.uid,
      (userDoc) => {
        setCurrentUserProfile(userDoc);
      },
      (err) => {
        console.error("Error escuchando usuario", err);
      },
    );

    return () => unsubscribe?.();
  }, [user?.uid]);

  if (loading) return <LoadingScreen />;

  if (!projects || projects.length === 0)
    return <div>No tienes proyectos asignados</div>;

  const visibleProjects = projects.slice(0, 3);
  const hasMore = projects.length > 3;

  return (
    <div
      style={{
        height: "100dvh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Mantenemos el bloqueo de scroll
        background: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          height: "100%",
          paddingLeft: "15%",
          paddingRight: "15%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#0A0A0A",
        }}
      >
        <div style={{ height: 200, flexShrink: 1, minHeight: 40 }} />

        {/* Bienvenida */}
        <div
          style={{
            fontSize: 14, // Ajustado ligeramente para legibilidad
            marginBottom: 8,
            width: "100%", // Asegura alineación
            textAlign: "center",
          }}
        >
          Bienvenido,{" "}
          <strong>{currentUserProfile?.displayName || user?.email}</strong>.
        </div>

        {/* Título */}
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.1,
            textAlign: "center",
            margin: 0,
          }}
        >
          Selecciona
          <br />
          un proyecto
        </h1>

        {/* Separación título → botones */}
        <div style={{ height: 60, flexShrink: 1, minHeight: 30 }} />

        {/* Botones de proyectos */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {visibleProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                ui.setSelectedProjectId(p.id);
                ui.goTo("main");
              }}
              style={{
                height: 55,
                borderRadius: 8,
                border: "1px solid #0A0A0A",
                background: "#ffffff",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                color: "#0A0A0A",
                textAlign: "left",
                padding: "0 20px",
              }}
            >
              {p.name || p.id}
            </button>
          ))}

          {/* Ver más */}
          {hasMore && (
            <button
              onClick={() => {}}
              style={{
                marginTop: 20, // Aire extra para separar del último botón
                background: "none",
                border: "none",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                color: "#0A0A0A",
              }}
            >
              <span>Ver más</span>
              {/* Círculo simulado con CSS si no tienes icono aun */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#000",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                ↓
              </div>
            </button>
          )}
        </div>

        {/* SPACER FLEXIBLE INFERIOR:
            Este elemento es el que "empuja" el logout hacia abajo
            ocupando todo el espacio sobrante después de los 200px superiores.
        */}
        <div style={{ flex: 1 }} />

        {/* Logout (Abajo a la izquierda) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start", // Alineación izquierda como en la imagen
          }}
        >
          <button
            onClick={async () => {
              ui.resetSession();
              await logout();
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 700,
              color: "#E63946", // Color rojizo similar a la imagen (flecha)
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: 0,
            }}
          >
            {/* Simulación de icono de flecha atrás */}
            <span style={{ fontSize: 20 }}>←</span>
            {/* O dejamos solo el texto si prefieres */}
          </button>
        </div>

        {/* Spacer bottom fijo para no pegar al borde del teléfono */}
        <div style={{ height: 40, flexShrink: 0 }} />
      </div>
    </div>
  );
}
