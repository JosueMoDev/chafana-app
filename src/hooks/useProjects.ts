"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Project } from "@/interfaces";
import { useProjectsStore } from "@/stores/useProjectStore";

export function useProjects() {
  const { projects, addProject, setSelectedProjectId, selectedProjectId } =
    useProjectsStore();
  const [storedProjects, setStoredProjects] = useLocalStorage<Project[]>(
    "asana-projects",
    []
  );

  // Inicializar store desde localStorage si está vacío
  if (projects.length === 0 && storedProjects.length > 0) {
    storedProjects.forEach((p) => addProject(p));
  }

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || null;

  // Función que ahora tu layout sí reconoce
  const createProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      sections: projectData.sections || [],
      memberIds: projectData.memberIds || [],
      taskCount: 0,
      completedTaskCount: 0,
    };
    addProject(newProject);
    setStoredProjects([...storedProjects, newProject]);
    setSelectedProjectId(newProject.id);
  };

  const selectProject = (projectId: string) => setSelectedProjectId(projectId);

  return {
    projects,
    selectedProject,
    createProject,
    selectProject,
  };
}
