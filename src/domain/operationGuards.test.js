import { describe, it, expect } from "vitest";
import {
  assertCameraIsActive,
  assertHasBeenPlaced,
  assertNotRemoved,
} from "./operationGuards";

describe("operationGuards", () => {
  describe("assertCameraIsActive", () => {
    it("lanza error si la cámara está inactive", () => {
      const ops = [{ type: "deploy", createdAt: 1 }];

      expect(() => assertCameraIsActive(ops)).toThrow(/no está activa/i);
    });

    it("NO lanza error si la cámara está active", () => {
      const ops = [{ type: "placement", createdAt: 1 }];

      expect(() => assertCameraIsActive(ops)).not.toThrow();
    });

    it("lanza error si no hay operaciones", () => {
      expect(() => assertCameraIsActive([])).toThrow();
    });
  });

  describe("assertHasBeenPlaced", () => {
    it("lanza error si nunca hubo placement", () => {
      const ops = [{ type: "deploy", createdAt: 1 }];

      expect(() => assertHasBeenPlaced(ops)).toThrow(/nunca fue colocada/i);
    });

    it("NO lanza error si hubo placement", () => {
      const ops = [
        { type: "deploy", createdAt: 1 },
        { type: "placement", createdAt: 2 },
      ];

      expect(() => assertHasBeenPlaced(ops)).not.toThrow();
    });

    it("NO lanza error si hubo relocation luego de placement", () => {
      const ops = [
        { type: "placement", createdAt: 1 },
        { type: "relocation", createdAt: 2 },
      ];

      expect(() => assertHasBeenPlaced(ops)).not.toThrow();
    });
  });

  describe("assertNotRemoved", () => {
    it("lanza error si la última operación es removal", () => {
      const ops = [
        { type: "placement", createdAt: 1 },
        { type: "removal", createdAt: 2 },
      ];

      expect(() => assertNotRemoved(ops)).toThrow(/retirada/i);
    });

    it("NO lanza error si la cámara sigue activa", () => {
      const ops = [{ type: "placement", createdAt: 1 }];

      expect(() => assertNotRemoved(ops)).not.toThrow();
    });
  });
});
