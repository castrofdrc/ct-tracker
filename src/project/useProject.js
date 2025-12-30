import { useEffect, useState } from "react";
import {
  listenToCameras,
  createCamera,
  updateCamera,
} from "../services/cameras.service";
import { listenToOperations } from "../services/operations.service";

export function useProject(projectId, authLoading, user) {
  const [cameras, setCameras] = useState([]);
  const [operationsByCamera, setOperationsByCamera] = useState({});

  useEffect(() => {
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

  return {
    cameras,
    operationsByCamera,
    createCamera: createCameraForProject,
    updateCamera: updateCameraForProject,
  };
}
