import { useAuth } from "./auth/useAuth";
import { ProjectContext } from "./project/ProjectContext";
import { useProject } from "./project/useProject";
import { UIContext } from "./ui/UIContext";
import { useUI } from "./ui/useUI";
import { CameraMap } from "./ui/components/CameraMap";
import { CameraItem } from "./ui/components/CameraItem";
import { ProjectSelector } from "./ui/components/ProjectSelector";
import { CameraRelocationPanel } from "./ui/components/CameraRelocationPanel";
import { CameraMaintenancePanel } from "./ui/components/CameraMaintenancePanel";
import { useNetworkStatus } from "./ui/useNetworkStatus";
import { TopStatusBar } from "./ui/components/TopStatusBar";
import { BottomActionBar } from "./ui/components/BottomActionBar";
import { HomeScreen } from "./ui/screens/HomeScreen";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  const ui = useUI();
  const isOnline = useNetworkStatus();
  const { user, authLoading, login, logout } = useAuth();
  const screen = ui.activeScreen;

  const project = useProject({
    projectId: ui.selectedProjectId,
    user,
    authLoading,
  });

  const handleCreateCamera = async () => {
    if (!navigator.onLine) {
      alert("Para crear una nueva cámara necesitás conexión.");
      return;
    }

    if (!ui.newCameraId) return;

    if (!/^CT_\d{3}$/.test(ui.newCameraId)) {
      alert("Formato inválido. Usar CT_XXX (ej: CT_005)");
      return;
    }

    try {
      await project.createCamera(ui.newCameraId);
      ui.setNewCameraId("");
    } catch (err) {
      console.error("Error creando cámara:", err);
      alert("No se pudo crear la cámara.");
    }
  };

  if (authLoading) {
    return <div>Cargando sesión...</div>;
  }

  if (!user) {
    return (
      <UIContext.Provider value={ui}>
        <HomeScreen
          email={ui.email}
          password={ui.password}
          setEmail={ui.setEmail}
          setPassword={ui.setPassword}
          onLogin={() => login(ui.email, ui.password)}
        />
      </UIContext.Provider>
    );
  }

  if (!ui.selectedProjectId) {
    return (
      <UIContext.Provider value={ui}>
        <ProjectSelector />
      </UIContext.Provider>
    );
  }

  return (
    <UIContext.Provider value={ui}>
      <ProjectContext.Provider value={project}>
        {screen === "main" && (
          <>
            <TopStatusBar projectId={ui.selectedProjectId} />
            <BottomActionBar />

            {/* MAPA */}
            {ui.activeScreen === "main" && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 0,
                }}
              >
                <CameraMap
                  cameras={project.cameras}
                  onRelocate={project.relocateCamera}
                />
              </div>
            )}

            {/* PANELS */}
            {/* <CameraRelocationPanel />
            <CameraMaintenancePanel />*/}

            {/* LISTA */}
            {/* <h3 style={{ marginTop: "16px" }}>Lista de Cámaras</h3>*/}

            {/* <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label>
                Filtrar por estado:
                <select
                  value={ui.statusFilter}
                  onChange={(e) => ui.setStatusFilter(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="active">Activas</option>
                  <option value="inactive">Inactivas</option>
                </select>
              </label>

              <input
                placeholder="CT_005"
                value={ui.newCameraId}
                onChange={(e) => ui.setNewCameraId(e.target.value)}
              />
              <button onClick={handleCreateCamera}>Crear cámara</button>
            </div>

            {ui.activeScreen === "cameraList" && (
              <ul>
                {project.cameras
                  .filter((camera) => {
                    if (ui.statusFilter === "all") return true;
                    return camera.derivedState === ui.statusFilter;
                  })
                  .map((camera) => (
                    <CameraItem
                      key={camera.id}
                      camera={camera}
                      operations={project.operationsByCamera[camera.id] || []}
                      locations={project.locationsByCamera?.[camera.id] || []}
                      usersById={project.usersById}
                      placeCamera={project.placeCamera}
                      removeCamera={project.removeCamera}
                      isSelected={camera.id === ui.selectedCameraId}
                    />
                  ))}
              </ul>
            )}*/}
          </>
        )}
      </ProjectContext.Provider>
    </UIContext.Provider>
  );
}

export default App;
