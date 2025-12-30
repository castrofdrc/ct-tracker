import { useEffect, useState } from "react";
import {
  listenToCameras,
  createCamera as createCameraService,
  updateCamera,
} from "./services/cameras.service";
import { useAuth } from "./auth/useAuth";

import { listenToOperations } from "./services/operations.service";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
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

function MapClickHandler({ selectedCameraId, onSetLocation }) {
  useMapEvents({
    click(e) {
      console.log("CLICK MAPA", selectedCameraId);

      if (!selectedCameraId) return;

      onSetLocation(selectedCameraId, {
        location: {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        },
      });
    },
  });

  return null;
}

function FitBounds({ cameras, selectedCameraId }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCameraId) {
      const cam = cameras.find((c) => c.id === selectedCameraId);
      if (cam) {
        map.setView(
          [cam.location.lat, cam.location.lng],
          Math.max(map.getZoom(), 15),
        );
        return;
      }
    }

    if (cameras.length > 0) {
      const bounds = L.latLngBounds(
        cameras.map((c) => [c.location.lat, c.location.lng]),
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [cameras, selectedCameraId, map]);

  return null;
}

function CameraMap({
  cameras,
  onSelectCamera,
  selectedCameraId,
  onUpdateCamera,
}) {
  const camerasWithLocation = cameras.filter(
    (c) =>
      typeof c.location?.lat === "number" &&
      typeof c.location?.lng === "number",
  );

  if (camerasWithLocation.length === 0) {
    return <p>No hay cámaras con ubicación</p>;
  }

  return (
    <MapContainer style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds
        cameras={camerasWithLocation}
        selectedCameraId={selectedCameraId}
      />

      <MapClickHandler
        selectedCameraId={selectedCameraId}
        onSetLocation={onUpdateCamera}
      />

      {camerasWithLocation.map((camera) => (
        <Marker
          key={camera.id}
          position={[camera.location.lat, camera.location.lng]}
          eventHandlers={{
            click: () => onSelectCamera(camera.id),
          }}
        >
          <Popup>
            <strong>{camera.id}</strong>
            <br />
            Estado: {camera.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function CameraItem({
  camera,
  operations,
  onUpdateCamera,
  onSelect,
  isSelected,
}) {
  const [draftLocation, setDraftLocation] = useState(camera.location);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_VISIBLE = 3;
  const visibleOperations = isExpanded
    ? operations
    : operations.slice(0, MAX_VISIBLE);

  return (
    <li
      style={{
        border: isSelected ? "2px solid #2563eb" : "1px solid #ddd",
        padding: "8px",
        marginBottom: "8px",
        borderRadius: "4px",
      }}
    >
      <strong onClick={onSelect} style={{ cursor: "pointer" }}>
        {camera.id}
      </strong>
      <br />
      Estado:
      <select
        value={camera.status}
        onChange={(e) => onUpdateCamera(camera.id, { status: e.target.value })}
      >
        <option value="active">active</option>
        <option value="inactive">inactive</option>
        <option value="broken">broken</option>
        <option value="lost">lost</option>
      </select>
      <button onClick={() => onUpdateCamera(camera.id, { status: "inactive" })}>
        Dar de baja
      </button>
      <br />
      <input
        type="number"
        step="any"
        value={draftLocation?.lat ?? ""}
        onChange={(e) =>
          setDraftLocation({
            ...draftLocation,
            lat: e.target.value === "" ? null : Number(e.target.value),
          })
        }
      />
      <input
        type="number"
        step="any"
        value={draftLocation?.lng ?? ""}
        onChange={(e) =>
          setDraftLocation({
            ...draftLocation,
            lng: e.target.value === "" ? null : Number(e.target.value),
          })
        }
      />
      <button
        onClick={() =>
          onUpdateCamera(camera.id, {
            location: draftLocation,
          })
        }
      >
        Guardar ubicación
      </button>
      <h4>Historial</h4>
      <ul>
        {visibleOperations.map((op) => (
          <li key={op.id}>
            <strong>{op.type}</strong> —{" "}
            {op.createdAt?.toDate().toLocaleString() || "…"}
            {op.statusAfter && <> — status: {op.statusAfter}</>}
            {op.location && (
              <>
                {" "}
                — loc: {op.location.lat}, {op.location.lng}
              </>
            )}
          </li>
        ))}
      </ul>
      {operations.length > MAX_VISIBLE && (
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </li>
  );
}

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cameras, setCameras] = useState([]);
  const [newCameraId, setNewCameraId] = useState("");
  const [operationsByCamera, setOperationsByCamera] = useState({});
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const { user, activeProjectId, authLoading, login } = useAuth();

  const createCamera = async () => {
    if (!newCameraId) return;

    if (!/^CT_\d{3}$/.test(newCameraId)) {
      alert("Formato inválido. Usar CT_XXX (ej: CT_005)");
      return;
    }

    try {
      await createCameraService(newCameraId, activeProjectId);
      setNewCameraId("");
    } catch (err) {
      console.error("Error creando cámara:", err);
      alert("No se pudo crear la cámara.");
    }
  };

  // Camaras
  //
  useEffect(() => {
    if (authLoading) return;
    if (!user || !activeProjectId) return;

    const unsubscribe = listenToCameras(
      activeProjectId,
      setCameras,
      (error) => {
        if (error.code === "permission-denied") {
          console.warn("Lost access to project");
        }
      },
    );

    return () => unsubscribe();
  }, [authLoading, user, activeProjectId]);

  // Operaciones
  //
  useEffect(() => {
    if (authLoading) return;
    if (!user || !activeProjectId || cameras.length === 0) return;

    const unsubscribers = cameras.map((camera) =>
      listenToOperations(
        camera.id,
        (ops) =>
          setOperationsByCamera((prev) => ({
            ...prev,
            [camera.id]: ops,
          })),
        () => {},
      ),
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [authLoading, user, cameras, activeProjectId]);

  if (authLoading) {
    return <div>Cargando sesión...</div>;
  }

  if (!user) {
    return (
      <div>
        <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => login(email, password)}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h1>CT Tracker</h1>

      {user && activeProjectId && (
        <>
          <p>Logueado como {user.email}</p>

          <h2>Mapa de cámaras</h2>
          <CameraMap
            cameras={cameras}
            selectedCameraId={selectedCameraId}
            onSelectCamera={setSelectedCameraId}
            onUpdateCamera={updateCamera}
          />

          <h2>Cámaras</h2>

          {cameras.length === 0 && <p>No hay cámaras</p>}

          <input
            placeholder="CT_005"
            value={newCameraId}
            onChange={(e) => setNewCameraId(e.target.value)}
          />
          <button onClick={createCamera}>Crear cámara</button>

          <ul>
            {cameras.map((camera) => (
              <CameraItem
                key={camera.id + (camera.updatedAt?.seconds ?? "")}
                camera={camera}
                operations={operationsByCamera[camera.id] || []}
                onUpdateCamera={updateCamera}
                onSelect={() => setSelectedCameraId(camera.id)}
                isSelected={camera.id === selectedCameraId}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
