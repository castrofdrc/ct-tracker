import { useContext } from "react";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";
import { TopStatusBar } from "../components/TopStatusBar";
import { BottomActionBar } from "../components/BottomActionBar";
import { CameraMap } from "../components/CameraMap";

export function MainScreen() {
  const ui = useContext(UIContext);
  const project = useContext(ProjectContext);

  // Detectar si hay un overlay activo
  const hasOverlay = ["settings", "newAction", "newCamera"].includes(
    ui.activeScreen,
  );

  return (
    <>
      {/* Solo mostrar barras cuando NO hay overlay */}
      {!hasOverlay && (
        <>
          <TopStatusBar projectId={ui.selectedProjectId} />
          <BottomActionBar />
        </>
      )}

      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <CameraMap cameras={project.cameras} />
      </div>

      {/* Botones flotantes de acción */}
      {ui.addActionButton && !hasOverlay && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: "calc(56px + 20px + env(safe-area-inset-bottom))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            zIndex: 200,
          }}
        >
          <button
            style={{
              width: 160,
              height: 44,
              borderRadius: 8,
              border: "1px solid #000",
              background: "#fff",
              fontWeight: 500,
            }}
            onClick={() => {
              ui.setAddActionButton(false);
              ui.goTo("newAction");
            }}
          >
            Nueva operación
          </button>

          <button
            style={{
              width: 160,
              height: 44,
              borderRadius: 8,
              border: "1px solid #000",
              background: "#fff",
              fontWeight: 500,
            }}
            onClick={() => {
              ui.setAddActionButton(false);
              ui.goTo("newCamera");
            }}
          >
            Nueva cámara
          </button>
        </div>
      )}
    </>
  );
}
