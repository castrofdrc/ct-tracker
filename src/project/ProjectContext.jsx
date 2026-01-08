import { createContext } from "react";

export const ProjectContext = createContext(null);

export const emptyProject = {
  projects: [],
  loading: true,
};
