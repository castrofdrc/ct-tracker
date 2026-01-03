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

  it("respeta el orden por clientCreatedAt", () => {
    const ops = [
      { type: "deploy", clientCreatedAt: 1 },
      { type: "placement", clientCreatedAt: 2 },
      { type: "maintenance", clientCreatedAt: 3 },
    ];

    expect(deriveCameraState(ops)).toBe("active");
  });
});
