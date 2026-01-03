import { deriveCameraState } from "./deriveCameraState";

/**
 * Lanza error si la cámara no está activa
 */
export function assertCameraIsActive(operations) {
  const state = deriveCameraState(operations);

  if (state !== "active") {
    throw new Error("Operación inválida: la cámara no está activa.");
  }
}

/**
 * Lanza error si nunca hubo placement
 */
export function assertHasBeenPlaced(operations) {
  const hasPlacement = operations.some((op) => op.type === "placement");

  if (!hasPlacement) {
    throw new Error(
      "Operación inválida: la cámara nunca fue colocada en campo.",
    );
  }
}

export function assertNotRemoved(operations) {
  if (!Array.isArray(operations) || operations.length === 0) {
    return;
  }

  const last = [...operations].sort((a, b) => {
    const toMillis = (d) =>
      typeof d?.toMillis === "function" ? d.toMillis() : d;
    return toMillis(b.createdAt) - toMillis(a.createdAt);
  })[0];

  if (last?.type === "removal") {
    throw new Error("Operación inválida: la cámara fue retirada del campo.");
  }
}
