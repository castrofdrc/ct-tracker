import { useContext, useState, useEffect } from "react";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";

export function NewOperationScreen() {
  const ui = useContext(UIContext);
  const project = useContext(ProjectContext);

  const [search, setSearch] = useState("");
  const { selectedCameraId, setSelectedCameraId } = ui;

  const selectedCamera = project.cameras.find((c) => c.id === selectedCameraId);
  const { pendingOperation, setPendingOperation } = ui;
  const selectedOperation = pendingOperation;

  const [gettingLocation, setGettingLocation] = useState(false);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const { pendingCameraState, setPendingCameraState } = ui;

  const [maintenanceType, setMaintenanceType] = useState(null);

  const [pickedCameraId, setPickedCameraId] = useState(null);

  const actionButtonStyle = {
    height: 48,
    borderRadius: 8,
    border: "1px solid #0A0A0A",
    fontSize: 14,
    textAlign: "left",
    padding: "0 20px",
    marginBottom: 10,
  };

  const inputStyle = {
    height: 48,
    borderRadius: 8,
    border: "1px solid #0A0A0A",
    padding: "0 20px",
    fontSize: 14,
    width: "100%",
    textAlign: "left",
  };

  const subtitleStyle = {
    fontSize: 12,
    fontWeight: 500,
    textTransform: "uppercase",
    marginBottom: 6,
  };

  const canAccept =
    selectedCameraId &&
    selectedOperation &&
    (selectedOperation !== "maintenance" || maintenanceType) &&
    (selectedOperation !== "placement" ||
      (Number.isFinite(+lat) && Number.isFinite(+lng)));

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("El dispositivo no soporta geolocalización.");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setGettingLocation(false);
      },
      () => {
        setGettingLocation(false);
        alert("No se pudo obtener la ubicación actual.");
      },
      { enableHighAccuracy: true },
    );
  };

  useEffect(() => {
    if (ui.activeScreen !== "newAction") return;

    if (ui.returningFromMap) {
      // Venimos del map picker → NO resetear flujo
      ui.setReturningFromMap(false);
      return;
    }

    // Entrada nueva desde MainScreen → reset total
    ui.setSelectedCameraId(null);
    ui.setPendingOperation(null);

    setMaintenanceType(null);
    setLat("");
    setLng("");
    setPickedCameraId(null);
  }, [ui.activeScreen]);

  useEffect(() => {
    if (selectedOperation !== "maintenance") {
      setMaintenanceType(null);
    }
  }, [selectedOperation]);

  useEffect(() => {
    if (pendingCameraState?.lat && pendingCameraState?.lng) {
      setLat(pendingCameraState.lat.toFixed(6));
      setLng(pendingCameraState.lng.toFixed(6));
      setPendingCameraState({});
    }
  }, [pendingCameraState]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        paddingLeft: "15%",
        paddingRight: "15%",
        paddingTop: "clamp(96px, 18vh, 73px)",
        paddingBottom: "clamp(72px, 14vh, 73px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* <div style={{ height: 44, display: "flex", alignItems: "center" }}>
        <button
          onClick={() => ui.goTo("main")}
          style={{
            background: "none",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          ← Nueva operación
        </button>
      </div>*/}

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Nueva operación
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={subtitleStyle}>
          {selectedCameraId ? "Cámara seleccionada" : "Seleccionar cámara"}
        </div>

        <button
          onClick={() => {
            setSelectedCameraId(null);
          }}
          style={inputStyle}
        >
          {selectedCameraId || "CT_001"}
        </button>
      </div>

      {/* RENDER MÓVIL */}

      <div
        style={{
          flex: 1,
          minHeight: 200,
          borderRadius: 8,
          marginBottom: 40,
          overflow: "hidden",
        }}
      >
        {/* ===== PICKER CT ===== */}
        {!selectedCameraId && (
          <div
            style={{
              border: "1px solid #000",
              borderRadius: 10,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <input
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: 48,
                padding: "0 16px",
                border: "none",
                borderBottom: "1px solid #000",
                fontSize: 14,
                outline: "none",
              }}
            />

            <div style={{ flex: 1, overflowY: "auto" }}>
              {project.cameras
                .filter((c) =>
                  c.id.toLowerCase().includes(search.toLowerCase()),
                )
                .map((camera) => (
                  <button
                    key={camera.id}
                    onClick={() => setPickedCameraId(camera.id)}
                    style={{
                      width: "100%",
                      height: 48,
                      padding: "0 16px",
                      border: "none",
                      borderBottom: "1px solid #000",
                      background:
                        pickedCameraId === camera.id ? "#E4E4E4" : "#fff",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    <span>{camera.id}</span>
                    <span style={{ opacity: 0.7 }}>{camera.derivedState}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* ===== FORMULARIO OPERACIÓN ===== */}
        {selectedCameraId && (
          <div
            style={{
              height: "100%",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                marginTop: "clamp(32px, 5vh, 48px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2 style={subtitleStyle}>Tipo de operación</h2>

              {selectedCamera.derivedState === "active" && (
                <>
                  <button
                    style={{
                      ...actionButtonStyle,
                      background:
                        selectedOperation === "maintenance"
                          ? "#E4E4E4"
                          : "#ffffff",
                    }}
                    onClick={() => {
                      setPendingOperation("maintenance");
                      setMaintenanceType(null);
                    }}
                  >
                    Mantenimiento
                  </button>

                  <button
                    style={{
                      ...actionButtonStyle,
                      background:
                        selectedOperation === "removal" ? "#E4E4E4" : "#ffffff",
                    }}
                    onClick={() => {
                      setPendingOperation("removal");
                      setMaintenanceType(null);
                    }}
                  >
                    Retiro
                  </button>
                </>
              )}

              {selectedCamera.derivedState === "inactive" && (
                <button
                  style={{
                    ...actionButtonStyle,
                    background:
                      selectedOperation === "placement" ? "#E4E4E4" : "#ffffff",
                  }}
                  onClick={() => {
                    setPendingOperation("placement");
                    setMaintenanceType(null);
                  }}
                >
                  Colocación
                </button>
              )}

              {selectedOperation === "maintenance" && (
                <div
                  style={{
                    marginTop: "clamp(32px, 5vh, 48px)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h2 style={subtitleStyle}>Tipo de mantenimiento</h2>

                  <button
                    onClick={() => setMaintenanceType("battery")}
                    style={{
                      ...actionButtonStyle,
                      background:
                        maintenanceType === "battery" ? "#E4E4E4" : "#ffffff",
                    }}
                  >
                    Cambio de pilas
                  </button>

                  <button
                    onClick={() => setMaintenanceType("sd")}
                    style={{
                      ...actionButtonStyle,
                      background:
                        maintenanceType === "sd" ? "#E4E4E4" : "#ffffff",
                    }}
                  >
                    Cambio de memoria
                  </button>

                  <button
                    onClick={() => setMaintenanceType("both")}
                    style={{
                      ...actionButtonStyle,
                      background:
                        maintenanceType === "both" ? "#E4E4E4" : "#ffffff",
                    }}
                  >
                    Pilas y memoria
                  </button>
                </div>
              )}

              {selectedOperation === "removal" && (
                <div style={{ fontSize: 14, opacity: 0.6 }}>
                  La cámara será retirada del campo y quedará inactiva.
                </div>
              )}

              {selectedOperation === "placement" && (
                <>
                  <div style={{ fontSize: 14, opacity: 0.6 }}>
                    Ingresá la ubicación de la cámara.
                  </div>

                  <input
                    placeholder="Latitud"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    style={inputStyle}
                  />

                  <input
                    placeholder="Longitud"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    style={inputStyle}
                  />

                  <button
                    onClick={useCurrentLocation}
                    disabled={gettingLocation}
                    style={{
                      ...actionButtonStyle,
                      opacity: gettingLocation ? 0.5 : 1,
                    }}
                  >
                    {gettingLocation
                      ? "Obteniendo ubicación…"
                      : "Usar ubicación actual"}
                  </button>

                  <button
                    onClick={() => ui.goTo("mapPicker")}
                    style={actionButtonStyle}
                  >
                    Elegir en el mapa
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BLOQUE FIJO 2 */}

      <div style={{ display: "flex", gap: 20 }}>
        <button
          style={{
            flex: 1,
            height: 48,
            borderRadius: 8,
            border: "1px solid #000",
            background: "#fff",
            fontWeight: "bold",
            fontSize: 14,
          }}
          onClick={() => ui.goTo("main")}
        >
          Cancelar
        </button>

        <button
          style={{
            flex: 1,
            height: 48,
            borderRadius: 8,
            border: "1px solid #000",
            background: "#0a0a0a",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 14,
          }}
          disabled={!pickedCameraId && !canAccept}
          onClick={async () => {
            // 1️⃣ Confirmar CT (NO ejecutar operación)
            if (!selectedCameraId && pickedCameraId) {
              setSelectedCameraId(pickedCameraId);
              setPickedCameraId(null);
              setSearch("");
              return;
            }

            // 2️⃣ Confirmar operación final
            try {
              if (selectedOperation === "placement") {
                await project.placeCamera(
                  selectedCameraId,
                  Number(lat),
                  Number(lng),
                );
              }

              if (selectedOperation === "removal") {
                await project.removeCamera(selectedCameraId);
              }

              if (selectedOperation === "maintenance") {
                await project.maintenanceCamera(
                  selectedCameraId,
                  maintenanceType,
                );
              }

              ui.goTo("main");
            } catch (err) {
              alert(err.message);
            }
          }}
        >
          Aceptar
        </button>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}

{
  /*
      {selectedOperation === "relocation" && (
        <div style={{ marginTop: 24 }}>
          <h2
            style={{
              fontSize: 14,
              color: "#666",
              margin: "0 0 8px 4px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Método de relocalización
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => setRelocationMode("current")}
              style={{
                ...actionButtonStyle,
                background:
                  relocationMode === "current" ? "#f5f5f5" : "#ffffff",
              }}
            >
              Usar ubicación actual
            </button>

            <button
              onClick={() => setRelocationMode("manual")}
              style={{
                ...actionButtonStyle,
                background: relocationMode === "manual" ? "#f5f5f5" : "#ffffff",
              }}
            >
              Ingresar coordenadas
            </button>

            <button
              onClick={() => setRelocationMode("map")}
              style={{
                ...actionButtonStyle,
                background: relocationMode === "map" ? "#f5f5f5" : "#ffffff",
              }}
            >
              Elegir en el mapa
            </button>
          </div>
        </div>
      )}

      {relocationMode === "current" && (
        <div style={{ marginTop: 16, fontSize: 13, opacity: 0.6 }}>
          Se utilizará la ubicación actual del dispositivo.
        </div>
      )}

      {relocationMode === "manual" && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <input
            placeholder="Latitud"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Longitud"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            style={inputStyle}
          />
        </div>
      )}

      {relocationMode === "map" && (
        <div style={{ marginTop: 16, fontSize: 13, opacity: 0.6 }}>
          Seleccioná una ubicación tocando el mapa. Se pedirá confirmación antes
          de aplicar.
        </div>
      )}*/
}
