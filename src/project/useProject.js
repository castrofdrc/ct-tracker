import { useEffect, useState } from "react";
import { listenToUser } from "../services/users.service";
import { deriveCameraState } from "../domain/deriveCameraState";

import {
  listenToCameras,
  createCamera,
  placeCamera,
  removeCamera,
} from "../services/cameras.service";

import {
  listenToOperations,
  createMaintenance,
} from "../services/operations.service";

import {
  listenToLastLocation,
  listenToLocations,
} from "../services/locations.service";

export function useProject({ projectId, authLoading, user }) {
  const [cameras, setCameras] = useState([]);
  const [operationsByCamera, setOperationsByCamera] = useState({});
  const [lastLocationsByCamera, setLastLocationsByCamera] = useState({});
  const [usersById, setUsersById] = useState({});
  const [locationsByCamera, setLocationsByCamera] = useState({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCameras([]);
    setOperationsByCamera({});
    setLastLocationsByCamera({});
    setUsersById({});
    setLocationsByCamera({});
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
        camera.firestoreId, // ⬅️ CAMBIO: Usar firestoreId para Firestore
        (ops) =>
          setOperationsByCamera((prev) => ({
            ...prev,
            [camera.id]: ops, // ⬅️ Pero indexar por id display para UI
          })),
        () => {},
      ),
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [authLoading, user, projectId, cameras]);

  // Usuarios
  useEffect(() => {
    if (!projectId) return;

    const userIds = new Set();

    Object.values(operationsByCamera).forEach((ops) => {
      ops.forEach((op) => {
        if (op.userId) userIds.add(op.userId);
      });
    });

    userIds.forEach((uid) => {
      // ya tenemos el usuario cacheado → no hacemos nada
      if (usersById[uid]) return;

      listenToUser(
        uid,
        (user) => {
          setUsersById((prev) => {
            // evitar re-render inútil
            if (prev[uid]) return prev;
            return { ...prev, [uid]: user };
          });
        },
        (err) => {
          console.error("Error escuchando usuario", uid, err);
        },
      );
    });
  }, [operationsByCamera, projectId]); // ⬅️ usersById NO VA ACÁ

  // Ubicaciones
  useEffect(() => {
    if (authLoading) return;
    if (!user || !projectId || cameras.length === 0) return;

    const unsubs = cameras.map((camera) =>
      listenToLastLocation(
        camera.firestoreId, // ⬅️ CAMBIO: Usar firestoreId para Firestore
        (loc) =>
          setLastLocationsByCamera((prev) => ({
            ...prev,
            [camera.id]: loc, // ⬅️ Indexar por id display
          })),
        () => {},
      ),
    );

    return () => unsubs.forEach((u) => u());
  }, [authLoading, user, projectId, cameras]);

  // Historial de ubicaciones
  useEffect(() => {
    if (authLoading) return;
    if (!user || !projectId || cameras.length === 0) return;

    const unsubs = cameras.map((camera) =>
      listenToLocations(
        camera.firestoreId, // ⬅️ CAMBIO: Usar firestoreId para Firestore
        (locs) =>
          setLocationsByCamera((prev) => ({
            ...prev,
            [camera.id]: locs, // ⬅️ Indexar por id display
          })),
        () => {},
      ),
    );

    return () => unsubs.forEach((u) => u());
  }, [authLoading, user, projectId, cameras]);

  const createCameraForProject = (cameraId) => {
    return createCamera(cameraId, projectId);
  };

  const placeCameraForProject = (cameraId, lat, lng) => {
    return placeCamera(cameraId, projectId, lat, lng);
  };

  const removeCameraForProject = (cameraId) => {
    return removeCamera(cameraId, projectId);
  };

  const maintenanceCameraForProject = (cameraId, maintenanceType) => {
    const ops = operationsByCamera[cameraId] || [];
    return createMaintenance(cameraId, projectId, maintenanceType, ops);
  };

  const camerasWithDerivedState = cameras.map((camera) => {
    const ops = operationsByCamera[camera.id] || [];
    const derivedState = deriveCameraState(ops);
    const location = lastLocationsByCamera[camera.id] ?? null;

    return {
      ...camera,
      derivedState,
      location,
    };
  });

  return {
    cameras: camerasWithDerivedState,
    operationsByCamera,
    locationsByCamera,
    usersById,
    createCamera: createCameraForProject,
    placeCamera: placeCameraForProject,
    maintenanceCamera: maintenanceCameraForProject,
    removeCamera: removeCameraForProject,
  };
}
