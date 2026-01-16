import { useContext, useState } from "react";
import { UIContext } from "../UIContext";
import { useAuth } from "../../auth/useAuth";
import { createProject } from "../../services/projects.service";
import { validateProjectName } from "../../utils/slugify";

export function NewProjectScreen() {
  const ui = useContext(UIContext);
  const { user } = useAuth();
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    // Limpiar error previo
    setError("");

    // Validar nombre
    const validation = validateProjectName(projectName);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Verificar conexión
    if (!navigator.onLine) {
      setError("Sin conexión. Conectate a internet para crear un proyecto.");
      return;
    }

    // Crear proyecto
    setIsCreating(true);
    try {
      const newProject = await createProject(projectName, user.uid);

      // Éxito: seleccionar el proyecto y volver al mapa
      ui.selectProject(newProject.id);
      setProjectName("");
      ui.goTo("main");
    } catch (err) {
      console.error("Error creando proyecto:", err);
      setError("No se pudo crear el proyecto. Intentá de nuevo.");
    } finally {
      setIsCreating(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: 55,
    borderRadius: 6,
    border: "1px solid #0A0A0A",
    padding: "0 20px",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    height: 55,
    borderRadius: 6,
    border: "1px solid #0A0A0A",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        paddingLeft: "15%",
        paddingRight: "15%",
        paddingTop: "clamp(40px, 8vh, 60px)",
        paddingBottom: "clamp(20px, 5vh, 40px)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 60,
          display: "flex",
          alignItems: "center",
          marginBottom: 30,
          marginLeft: -8,
        }}
      >
        <button
          onClick={() => ui.goTo("settings")}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 18,
            fontWeight: 700,
            cursor: "pointer",
            padding: "10px 8px",
            color: "#0A0A0A",
          }}
        >
          <span style={{ fontSize: 24, lineHeight: 0.5 }}>←</span>
        </button>
      </div>

      {/* Título */}
      <div style={{ marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 800,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Nuevo proyecto
        </h1>
      </div>

      {/* Formulario */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Input nombre */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              marginBottom: 8,
              color: "#666",
            }}
          >
            Nombre del proyecto
          </label>
          <input
            type="text"
            placeholder="ej: Reserva El León"
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
              setError(""); // Limpiar error al escribir
            }}
            style={{
              ...inputStyle,
              borderColor: error ? "#dc2626" : "#0A0A0A",
            }}
            maxLength={50}
            autoFocus
          />

          {/* Contador de caracteres */}
          <div
            style={{
              fontSize: 12,
              color: "#999",
              marginTop: 6,
              textAlign: "right",
            }}
          >
            {projectName.length}/50
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 6,
              background: "#fee2e2",
              color: "#dc2626",
              fontSize: 14,
              border: "1px solid #fca5a5",
            }}
          >
            {error}
          </div>
        )}

        {/* Info helper */}
        <div
          style={{
            fontSize: 13,
            color: "#666",
            lineHeight: 1.5,
            padding: "12px 16px",
            background: "#f9fafb",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
          }}
        >
          El proyecto se creará y podrás empezar a agregar cámaras
          inmediatamente. En el futuro podrás invitar a otros usuarios como
          miembros.
        </div>
      </div>

      {/* Spacer para empujar botones al fondo */}
      <div style={{ flex: 1 }} />

      {/* Botones de acción */}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button
          onClick={() => ui.goTo("settings")}
          disabled={isCreating}
          style={{
            ...buttonStyle,
            background: "#ffffff",
            color: "#0A0A0A",
            opacity: isCreating ? 0.5 : 1,
          }}
        >
          Cancelar
        </button>

        <button
          onClick={handleCreate}
          disabled={isCreating || !projectName.trim()}
          style={{
            ...buttonStyle,
            background: "#0A0A0A",
            color: "#ffffff",
            opacity: isCreating || !projectName.trim() ? 0.5 : 1,
          }}
        >
          {isCreating ? "Creando..." : "Crear proyecto"}
        </button>
      </div>
    </div>
  );
}
