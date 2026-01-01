import { useEffect, useState } from "react";
import {
  listenToCameras,
  createCamera,
  updateCamera,
  placeCamera,
  removeCamera,
} from "../services/cameras.service";

import { listenToOperations } from "../services/operations.service";
import { deriveCameraState } from "../domain/deriveCameraState";

export function useProject({ projectId, authLoading, user }) {
  const [cameras, setCameras] = useState([]);
  const [operationsByCamera, setOperationsByCamera] = useState({});

  useEffect(() => {
    // Reset explícito de estado al cambiar de proyecto
    // Evita datos zombis entre proyectos
    setCameras([]);
    setOperationsByCamera({});
  }, [projectId]);

  // Cámaras
  useEffect(() => {
    if (authLoading) return;
    if (!user || !projectId) return;

    const unsubscribe = listenToCameras(projectId, setCameras, (error) => {
      if (error.code === "permission-denied") {
        console.warn("Lost access to project");
      }
    });

    return () => unsubscribe();
  }, [authLoading, user, projectId]);

  // Operaciones
  useEffect(() => {
    if (authLoading) return;
    if (!user || !projectId || cameras.length === 0) return;

    const unsubscribers = cameras.map((camera) =>
      listenToOperations(
        camera.id,
        (ops) =>
          setOperationsByCamera((prev) => ({
            ...prev,
            [camera.id]: ops,
          })),
        () => {},
      ),
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [authLoading, user, projectId, cameras]);

  const createCameraForProject = (cameraId) => {
    return createCamera(cameraId, projectId);
  };

  const updateCameraForProject = (cameraId, updates) => {
    return updateCamera(cameraId, projectId, updates);
  };

  const placeCameraForProject = (cameraId) => {
    return placeCamera(cameraId, projectId);
  };

  const removeCameraForProject = (cameraId) => {
    return removeCamera(cameraId, projectId);
  };

  const camerasWithDerivedState = cameras.map((camera) => {
    const ops = operationsByCamera[camera.id] || [];
    const derivedState = deriveCameraState(ops);

    return {
      ...camera,
      derivedState,
    };
  });

  return {
    cameras: camerasWithDerivedState,
    operationsByCamera,
    createCamera: createCameraForProject,
    updateCamera: updateCameraForProject, // solo para ubicación (temporal)
    placeCamera: placeCameraForProject,
    removeCamera: removeCameraForProject,
  };
}
