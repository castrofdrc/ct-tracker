import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { slugify } from "../utils/slugify";

export function listenToUserProjects(userId, onChange, onError) {
  const q = query(
    collection(db, "projects"),
    where("members", "array-contains", userId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onChange(projects);
    },
    onError,
  );
}

/**
 * Crea un nuevo proyecto con slug único
 *
 * @param {string} name - Nombre del proyecto (ej: "Reserva El León")
 * @param {string} creatorUserId - UID del usuario creador
 * @returns {Promise<{ id: string, name: string }>} - Proyecto creado
 * @throws {Error} - Si el nombre es inválido o hay error en Firestore
 */
export async function createProject(name, creatorUserId) {
  if (!name || !creatorUserId) {
    throw new Error("Nombre y creador son obligatorios");
  }

  // Generar slug base
  let baseSlug = slugify(name);

  if (!baseSlug) {
    throw new Error("El nombre debe contener al menos una letra o número");
  }

  // Buscar slug único (con sufijos si es necesario)
  let finalSlug = baseSlug;
  let suffix = 2;
  let exists = true;

  while (exists) {
    const docRef = doc(db, "projects", finalSlug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      exists = false;
    } else {
      finalSlug = `${baseSlug}-${suffix}`;
      suffix++;
    }
  }

  // Crear el proyecto
  const projectRef = doc(db, "projects", finalSlug);

  await setDoc(projectRef, {
    name: name.trim(),
    members: [creatorUserId],
    createdAt: serverTimestamp(),
  });

  return {
    id: finalSlug,
    name: name.trim(),
  };
}
