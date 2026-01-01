import { describe, it, expect } from "vitest";
import { deriveCameraState } from "./deriveCameraState";

describe("deriveCameraState", () => {
  it("devuelve inactive si no hay operaciones", () => {
    expect(deriveCameraState([])).toBe("inactive");
  });

  it("placement activa la cámara", () => {
    const ops = [{ type: "placement", createdAt: 1 }];
    expect(deriveCameraState(ops)).toBe("active");
  });

  it("removal desactiva la cámara", () => {
    const ops = [{ type: "removal", createdAt: 2 }];
    expect(deriveCameraState(ops)).toBe("inactive");
  });

  it("usa la última operación por fecha", () => {
    const ops = [
      { type: "placement", createdAt: 1 },
      { type: "removal", createdAt: 2 },
    ];
    expect(deriveCameraState(ops)).toBe("inactive");
  });

  it("legacy status_change se respeta", () => {
    const ops = [
      { type: "status_change", statusAfter: "active", createdAt: 1 },
    ];
    expect(deriveCameraState(ops)).toBe("active");
  });

  it("legacy relocate activa", () => {
    const ops = [{ type: "relocate", createdAt: 3 }];
    expect(deriveCameraState(ops)).toBe("active");
  });
});
