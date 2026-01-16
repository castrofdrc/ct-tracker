/**
 * Convierte un nombre a un slug válido para IDs de Firestore
 *
 * @param {string} name - Nombre original (ej: "Reserva El León")
 * @returns {string} - Slug limpio (ej: "reserva-el-leon")
 *
 * @example
 * slugify("Reserva El León") // "reserva-el-leon"
 * slugify("Estancia Los Algarrobos") // "estancia-los-algarrobos"
 * slugify("Campo   123!@#") // "campo-123"
 */
export function slugify(name) {
  if (!name || typeof name !== "string") {
    return "";
  }

  return name
    .toLowerCase() // "reserva el león"
    .trim() // Eliminar espacios al inicio/final
    .normalize("NFD") // Descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos (á→a, é→e, ñ→n)
    .replace(/[^a-z0-9]+/g, "-") // Reemplaza espacios y símbolos por "-"
    .replace(/^-+|-+$/g, ""); // Elimina guiones al inicio/final
}

/**
 * Valida que un nombre de proyecto cumpla con los requisitos
 *
 * @param {string} name - Nombre a validar
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateProjectName(name) {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "El nombre es obligatorio" };
  }

  const trimmed = name.trim();

  if (trimmed.length < 3) {
    return {
      valid: false,
      error: "El nombre debe tener al menos 3 caracteres",
    };
  }

  if (trimmed.length > 50) {
    return {
      valid: false,
      error: "El nombre no puede superar los 50 caracteres",
    };
  }

  // Verificar que no sea solo espacios/símbolos (slug vacío)
  const slug = slugify(trimmed);
  if (slug.length === 0) {
    return {
      valid: false,
      error: "El nombre debe contener al menos una letra o número",
    };
  }

  return { valid: true };
}
