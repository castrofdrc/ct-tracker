import { useState } from "react";

export function useUI() {
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [newCameraId, setNewCameraId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [pendingCameraState, setPendingCameraState] = useState({});
  const [activeScreen, setActiveScreen] = useState("home");

  const goTo = (screen) => {
    setActiveScreen(screen);
  };

  const selectProject = (projectId) => {
    setSelectedProjectId(projectId);
  };

  const resetNavigation = () => {
    setActiveScreen("home");
  };

  const closeProject = () => {
    setSelectedProjectId(null);
    setSelectedCameraId(null);
    setStatusFilter("all");
    setActiveScreen("projects");
  };

  const resetSession = () => {
    setSelectedProjectId(null);
    setSelectedCameraId(null);
    setStatusFilter("all");
    setNewCameraId("");
  };

  return {
    activeScreen,
    goTo,
    resetNavigation,

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
    selectProject,

    closeProject,
    resetSession,

    pendingCameraState,
    setPendingCameraState,
  };
}
