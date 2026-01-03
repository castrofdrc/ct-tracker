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
