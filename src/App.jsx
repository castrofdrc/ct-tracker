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
  const { user, authLoading, login, logout } = useAuth();
  const project = useProject({
    projectId: ui.selectedProjectId,
    user,
    authLoading,
  });

  const handleCreateCamera = async () => {
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
      <div>
        <input
          placeholder="email"
          onChange={(e) => ui.setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => ui.setPassword(e.target.value)}
        />
        <button onClick={() => login(ui.email, ui.password)}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>CT Tracker</h1>
      <ProjectContext.Provider value={project}>
        <UIContext.Provider value={ui}>
          {user && !ui.selectedProjectId && <ProjectSelector user={user} />}

          {user && ui.selectedProjectId && (
            <>
              <button
                onClick={async () => {
                  ui.resetSession();
                  await logout();
                }}
              >
                Logout
              </button>

              <p>Proyecto activo: {ui.selectedProjectId}</p>

              <h2>Mapa de cámaras</h2>
              <CameraMap
                cameras={project.cameras.filter((camera) => {
                  if (ui.statusFilter === "all") return true;
                  return camera.derivedState === ui.statusFilter;
                })}
                onRelocate={project.relocateCamera}
              />

              <CameraRelocationPanel />
              <CameraMaintenancePanel />

              <h2>Cámaras</h2>

              <label>
                Filtrar por estado:{" "}
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
                      usersById={project.usersById}
                      placeCamera={project.placeCamera}
                      removeCamera={project.removeCamera}
                      isSelected={camera.id === ui.selectedCameraId}
                    />
                  ))}
              </ul>
            </>
          )}
        </UIContext.Provider>
      </ProjectContext.Provider>
    </div>
  );
}

export default App;
