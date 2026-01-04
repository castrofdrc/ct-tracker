import { useState } from "react";

export function useUI() {
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [newCameraId, setNewCameraId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [pendingCameraState, setPendingCameraState] = useState({});

  const closeProject = () => {
    setSelectedProjectId(null);
    setSelectedCameraId(null);
    setStatusFilter("all");
  };
  const resetSession = () => {
    setSelectedProjectId(null);
    setSelectedCameraId(null);
    setStatusFilter("all");
    setNewCameraId("");
  };

  return {
    selectedCameraId,
    setSelectedCameraId,

    newCameraId,
    setNewCameraId,

    email,
    setEmail,

    password,
    setPassword,

    statusFilter,
    setStatusFilter,

    selectedProjectId,
    setSelectedProjectId,

    closeProject,
    resetSession,

    pendingCameraState,
    setPendingCameraState,
  };
}
