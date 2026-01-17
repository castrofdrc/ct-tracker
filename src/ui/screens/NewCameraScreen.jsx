import { useContext, useState } from "react";
import { UIContext } from "../UIContext";
import { ProjectContext } from "../../project/ProjectContext";

export function NewCameraScreen() {
  const ui = useContext(UIContext);
  const project = useContext(ProjectContext);

  // Estados para campos obligatorios
  const [cameraId, setCameraId] = useState("");

  // Estados para campos opcionales
  const [brand, setBrand] = useState("");
  const [batteries, setBatteries] = useState("");
  const [sdCapacity, setSdCapacity] = useState("");
  const [comments, setComments] = useState("");

  // Estado de creación
  const [isCreating, setIsCreating] = useState(false);

  // Estilos (copiados de NewOperationScreen)
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

  const textareaStyle = {
    ...inputStyle,
    minHeight: 80,
    padding: "12px 20px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%230A0A0A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 20px center",
    paddingRight: "48px",
  };

  // Validación del ID
  const isValidId = /^CT\d{3}$/.test(cameraId);
  const canCreate = isValidId && !isCreating;

  const handleCreate = async () => {
    if (!navigator.onLine) {
      alert("Para crear una cámara necesitás conexión.");
      return;
    }

    if (!isValidId) {
      alert("Formato inválido. Usar CTXXX (ej: CT005)");
      return;
    }

    setIsCreating(true);

    try {
      // Construir objeto de campos opcionales
      const optionalFields = {};

      if (brand.trim()) {
        optionalFields.brand = brand.trim();
      }

      if (batteries.trim() && !isNaN(batteries)) {
        optionalFields.batteries = parseInt(batteries, 10);
      }

      if (sdCapacity) {
        optionalFields.sdCapacity = parseInt(sdCapacity, 10);
      }

      if (comments.trim()) {
        optionalFields.comments = comments.trim();
      }

      // Crear cámara
      await project.createCamera(cameraId, optionalFields);

      // Limpiar formulario
      setCameraId("");
      setBrand("");
      setBatteries("");
      setSdCapacity("");
      setComments("");

      // Volver al mapa
      ui.goTo("main");
    } catch (err) {
      console.error("Error creando cámara:", err);
      alert("No se pudo crear la cámara. Intentá de nuevo.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingTop: "clamp(40px, 8vh, 60px)",
        paddingBottom: "clamp(20px, 5vh, 40px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ===== BLOQUE FIJO SUPERIOR ===== */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Nueva cámara
        </div>
      </div>

      {/* ===== BLOQUE MÓVIL (FORMULARIO) ===== */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: 0,
        }}
      >
        {/* Campo 1: ID de cámara (OBLIGATORIO) */}
        <div style={{ marginBottom: "clamp(12px, 5vh, 28px)" }}>
          <div style={subtitleStyle}>ID de cámara</div>
          <input
            type="text"
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value.toUpperCase())}
            style={inputStyle}
            maxLength={5}
            autoFocus
          />
          <div
            style={{
              fontSize: 12,
              color: "#666",
              marginTop: 6,
              fontStyle: "italic",
            }}
          >
            *Campo requerido
          </div>
        </div>

        {/* Campo 2: Marca y modelo */}
        <div style={{ marginBottom: "clamp(12px, 5vh, 28px)" }}>
          <div style={subtitleStyle}>Marca y modelo</div>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            style={inputStyle}
            maxLength={50}
          />
        </div>

        {/* Campo 3: Cantidad de pilas */}
        <div style={{ marginBottom: "clamp(12px, 5vh, 28px)" }}>
          <div style={subtitleStyle}>Cantidad de pilas</div>
          <input
            type="number"
            inputMode="numeric"
            value={batteries}
            onChange={(e) => {
              const val = e.target.value;
              // Solo permitir números entre 1-12
              if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
                setBatteries(val);
              }
            }}
            style={inputStyle}
            min="1"
            max="12"
          />
        </div>

        {/* Campo 4: Capacidad SD */}
        <div style={{ marginBottom: "clamp(12px, 5vh, 28px)" }}>
          <div style={subtitleStyle}>Capacidad máxima de SD</div>
          <select
            value={sdCapacity}
            onChange={(e) => setSdCapacity(e.target.value)}
            style={selectStyle}
          >
            <option value=""></option>
            <option value="8">8 GB</option>
            <option value="16">16 GB</option>
            <option value="32">32 GB</option>
            <option value="64">64 GB</option>
            <option value="128">128 GB</option>
            <option value="256">256 GB</option>
          </select>
        </div>

        {/* Campo 5: Comentarios */}
        <div style={{ marginBottom: "clamp(12px, 5vh, 28px)" }}>
          <div style={subtitleStyle}>Comentarios</div>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            style={textareaStyle}
            maxLength={250}
            placeholder="Estado, color, observaciones..."
            rows={3}
          />
          <div
            style={{
              fontSize: 12,
              color: "#999",
              marginTop: 6,
              textAlign: "right",
            }}
          >
            {comments.length}/250
          </div>
        </div>
      </div>

      {/* ===== BLOQUE FIJO INFERIOR (BOTONES) ===== */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => ui.goTo("main")}
          disabled={isCreating}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 4,
            border: "1px solid #000",
            background: "#fff",
            fontWeight: "bold",
            fontSize: 14,
            opacity: isCreating ? 0.5 : 1,
          }}
        >
          Cancelar
        </button>

        <button
          onClick={handleCreate}
          disabled={!canCreate}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 4,
            border: "1px solid #000",
            background: "#0a0a0a",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 14,
            opacity: !canCreate ? 0.5 : 1,
          }}
        >
          {isCreating ? "Creando..." : "Aceptar"}
        </button>
      </div>

      <div style={{ height: 0 }} />
    </div>
  );
}
