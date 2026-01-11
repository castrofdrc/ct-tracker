import { useContext, useState, useEffect } from "react";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";

export function NewOperationScreen() {
  const ui = useContext(UIContext);
  const project = useContext(ProjectContext);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
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

  const [confirmAction, setConfirmAction] = useState(false);

  const actionButtonStyle = {
    height: 44,
    borderRadius: 8,
    border: "1px solid #0A0A0A",
    background: "#ffffff",
    fontSize: 15,
    fontWeight: 500,
    textAlign: "left",
    padding: "0 20px",
  };

  const inputStyle = {
    height: 44,
    borderRadius: 8,
    border: "1px solid #0A0A0A",
    padding: "0 20px",
    fontSize: 14,
  };

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
    setConfirmAction(false);
  }, [ui.activeScreen]);

  useEffect(() => {
    setMaintenanceType(null);
  }, [selectedCameraId]);

  useEffect(() => {
    // Cuando cambia la operación principal:
    setMaintenanceType(null);
  }, [selectedOperation]);

  useEffect(() => {
    if (pendingCameraState?.lat && pendingCameraState?.lng) {
      setLat(pendingCameraState.lat.toFixed(6));
      setLng(pendingCameraState.lng.toFixed(6));
      setPendingCameraState({});
    }
  }, [pendingCameraState]);

  useEffect(() => {
    setConfirmAction(false);
  }, [selectedCameraId, selectedOperation]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        paddingLeft: "15%",
        paddingRight: "15%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: 44, display: "flex", alignItems: "center" }}>
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
      </div>

      <div style={{ flex: 1 }} />

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
        Seleccionar CT
      </h2>

      <button
        onClick={() => setIsPickerOpen(true)}
        style={{
          height: 55,
          borderRadius: 8,
          border: "1px solid #0A0A0A",
          background: "#ffffff",
          fontSize: 16,
          fontWeight: 500,
          textAlign: "left",
          padding: "0 20px",
          opacity: selectedCameraId ? 1 : 0.5,
        }}
      >
        {selectedCameraId || "CT_001"}
      </button>

      {isPickerOpen && (
        <div
          style={{
            marginTop: 10,
            border: "1px solid #0A0A0A",
            borderRadius: 8,
            maxHeight: 300,
            overflowY: "auto",
            background: "#ffffff",
          }}
        >
          {/* Buscador */}
          <input
            placeholder="Buscar CT…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              height: 44,
              border: "none",
              borderBottom: "1px solid #0A0A0A",
              padding: "0 20px",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />

          {/* Lista */}
          <div>
            {project.cameras
              .filter((c) => c.id.toLowerCase().includes(search.toLowerCase()))
              .map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => {
                    setSelectedCameraId(camera.id);
                    setIsPickerOpen(false);
                    setSearch("");
                  }}
                  style={{
                    width: "100%",
                    height: 44,
                    border: "none",
                    borderBottom: "1px solid #eee",
                    background: "#ffffff",
                    textAlign: "left",
                    padding: "0 20px",
                    fontSize: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{camera.id}</span>
                  <span style={{ opacity: 0.5 }}>{camera.derivedState}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {selectedCamera && (
        <div style={{ marginTop: 30 }}>
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
            Tipo de operación
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedCamera.derivedState === "active" && (
              <>
                <button
                  style={{
                    ...actionButtonStyle,
                    background:
                      selectedOperation === "maintenance"
                        ? "#f5f5f5"
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
                      selectedOperation === "removal" ? "#f5f5f5" : "#ffffff",
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

            {selectedCamera?.derivedState === "inactive" && (
              <button
                style={{
                  ...actionButtonStyle,
                  background:
                    selectedOperation === "placement" ? "#f5f5f5" : "#ffffff",
                }}
                onClick={() => {
                  ui.setPendingOperation("placement");
                  setMaintenanceType(null);
                }}
              >
                Colocación
              </button>
            )}
          </div>
        </div>
      )}

      {selectedOperation === "maintenance" && (
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
            Tipo de mantenimiento
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => setMaintenanceType("battery")}
              style={{
                ...actionButtonStyle,
                background:
                  maintenanceType === "battery" ? "#f5f5f5" : "#ffffff",
              }}
            >
              Cambio de pilas
            </button>

            <button
              onClick={() => setMaintenanceType("sd")}
              style={{
                ...actionButtonStyle,
                background: maintenanceType === "sd" ? "#f5f5f5" : "#ffffff",
              }}
            >
              Cambio de memoria
            </button>

            <button
              onClick={() => setMaintenanceType("both")}
              style={{
                ...actionButtonStyle,
                background: maintenanceType === "both" ? "#f5f5f5" : "#ffffff",
              }}
            >
              Pilas y memoria
            </button>

            <button
              onClick={() => {
                if (!maintenanceType) {
                  alert("Seleccioná el tipo de mantenimiento.");
                  return;
                }
                setConfirmAction(true);
              }}
              style={actionButtonStyle}
            >
              Confirmar mantenimiento
            </button>
          </div>
        </div>
      )}
      {/*
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
      )}*/}

      {selectedOperation === "removal" && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 12 }}>
            La cámara será retirada del campo y quedará inactiva.
          </div>

          <button
            onClick={() => setConfirmAction(true)}
            style={actionButtonStyle}
          >
            Confirmar retiro
          </button>
        </div>
      )}

      {selectedOperation === "placement" && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 12 }}>
            Ingresá la ubicación de la cámara.
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 16,
            }}
          >
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
          </div>

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

          <button
            onClick={() => setConfirmAction(true)}
            style={actionButtonStyle}
          >
            Confirmar colocación
          </button>
        </div>
      )}

      {confirmAction && (
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            ¿Confirmar acción?
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setConfirmAction(false)}
              style={{
                ...actionButtonStyle,
                background: "#ffffff",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={async () => {
                try {
                  if (selectedOperation === "placement") {
                    const latNum = Number(lat);
                    const lngNum = Number(lng);

                    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
                      alert("Latitud y longitud inválidas.");
                      return;
                    }

                    await project.placeCamera(selectedCameraId, latNum, lngNum);

                    ui.goTo("main");
                  }

                  if (selectedOperation === "removal") {
                    await project.removeCamera(selectedCameraId);
                    ui.goTo("main");
                  }

                  if (selectedOperation === "maintenance") {
                    if (!maintenanceType) {
                      alert("Seleccioná el tipo de mantenimiento.");
                      return;
                    }

                    try {
                      await project.maintenanceCamera(
                        selectedCameraId,
                        maintenanceType,
                      );
                      ui.goTo("main");
                    } catch (err) {
                      alert(err.message);
                    }
                  }
                } catch (err) {
                  alert(err.message);
                } finally {
                  setConfirmAction(false);
                }
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 40 }} />
    </div>
  );
}
