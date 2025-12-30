import { useState } from "react";

export function useUI() {
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [newCameraId, setNewCameraId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return {
    selectedCameraId,
    setSelectedCameraId,

    newCameraId,
    setNewCameraId,

    email,
    setEmail,

    password,
    setPassword,
  };
}
