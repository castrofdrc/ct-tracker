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

  const [locationMethod, setLocationMethod] = useState(null);

  const [gettingLocation, setGettingLocation] = useState(false);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const { pendingCameraState, setPendingCameraState } = ui;

  const [maintenanceType, setMaintenanceType] = useState(null);

  const [pickedCameraId, setPickedCameraId] = useState(null);

  const actionButtonStyle = {
    height: 48,
    borderRadius: 6,
    border: "1px solid #0A0A0A",
    fontSize: 14,
    textAlign: "left",
    padding: "0 20px",
    marginBottom: 10,
  };

  const inputStyle = {
    height: 48,
    borderRadius: 6,
    border: "1px solid #0A0A0A",
    padding: "0 20px",
    fontSize: 14,
    width: "100%",
    textAlign: "left",
    outline: "none",
  };

  const subtitleStyle = {
    fontSize: 12,
    fontWeight: 500,
    textTransform: "uppercase",
    marginBottom: 6,
  };

  const isValidCoordinate = (latStr, lngStr) => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    return (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180 &&
      latStr.trim() !== "" &&
      lngStr.trim() !== ""
    );
  };

  const canAccept =
    selectedCameraId &&
    selectedOperation &&
    (selectedOperation !== "maintenance" || maintenanceType) &&
    (selectedOperation !== "placement" || isValidCoordinate(lat, lng));

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
    setLocationMethod(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.activeScreen]);

  useEffect(() => {
    if (selectedOperation !== "maintenance") {
      setMaintenanceType(null);
    }
  }, [selectedOperation]);

  useEffect(() => {
    if (ui.returningFromMap) return;

    if (selectedOperation !== "placement") {
      setLocationMethod(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOperation]);

  useEffect(() => {
    if (pendingCameraState?.lat && pendingCameraState?.lng) {
      setLat(pendingCameraState.lat.toFixed(6));
      setLng(pendingCameraState.lng.toFixed(6));
      setLocationMethod("map");
      setPendingCameraState({});
    }
  }, [pendingCameraState, setPendingCameraState]);

  useEffect(() => {
    if (selectedCameraId && selectedCamera) {
      if (selectedCamera.derivedState === "inactive") {
        setPendingOperation("placement");
      }
    }
  }, [selectedCameraId, selectedCamera, setPendingOperation]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingTop: "clamp(30px, 15vh, 48px)",
        paddingBottom: "clamp(20px, 10vh, 30px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
            setPendingOperation(null);
            setMaintenanceType(null);
            setLat("");
            setLng("");
            setLocationMethod(null);
          }}
          style={{
            ...inputStyle,
            background: selectedCameraId ? "#E4E4E4" : "#ffffff",
            fontWeight: selectedCameraId ? 700 : 400,
          }}
        >
          {selectedCameraId || "Seleccionar cámara..."}
        </button>
      </div>

      {/* RENDER MÓVIL */}

      <div
        style={{
          flex: 1,
          minHeight: 200,
          borderRadius: 6,
          marginBottom: 0,
          overflow: "hidden",
        }}
      >
        {/* ===== PICKER CT ===== */}
        {!selectedCameraId && (
          <div
            style={{
              border: "1px solid #000",
              borderRadius: 8,
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
                    onClick={() => {
                      setSelectedCameraId(camera.id);
                      setSearch("");
                    }}
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
                <div style={{ fontSize: 14, opacity: 0.6 }}>
                  La cámara será colocada en el campo y quedará activa.
                </div>
              )}

              {selectedOperation === "placement" && (
                <div
                  style={{
                    marginTop: "clamp(32px, 5vh, 48px)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Subtítulo */}
                  <h2 style={subtitleStyle}>Ingresar ubicación</h2>

                  {/* Lat / Long */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <input
                      placeholder="Lat"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      style={inputStyle}
                    />

                    <input
                      placeholder="Long"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  {/* Botones */}
                  <button
                    onClick={() => {
                      setLocationMethod("current");
                      useCurrentLocation();
                    }}
                    disabled={gettingLocation}
                    style={{
                      ...actionButtonStyle,
                      background:
                        locationMethod === "current" ? "#E4E4E4" : "#ffffff",
                      opacity: gettingLocation ? 0.5 : 1,
                    }}
                  >
                    {gettingLocation
                      ? "Obteniendo ubicación…"
                      : "Usar ubicación actual"}
                  </button>

                  <button
                    onClick={() => {
                      setLocationMethod("map");
                      ui.goTo("mapPicker");
                    }}
                    style={{
                      ...actionButtonStyle,
                      background:
                        locationMethod === "map" ? "#E4E4E4" : "#ffffff",
                    }}
                  >
                    Elegir en el mapa
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BLOQUE FIJO 2 - Solo visible cuando hay CT confirmada */}

      {selectedCameraId && (
        <div style={{ display: "flex", gap: 20 }}>
          <button
            style={{
              flex: 1,
              height: 48,
              borderRadius: 6,
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
              borderRadius: 6,
              border: "1px solid #000",
              background: "#0a0a0a",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 14,
            }}
            disabled={!canAccept}
            onClick={async () => {
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
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}
