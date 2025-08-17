"use client";

import { useEffect, useState } from "react";
import { Project } from "@/interfaces";
import { useProjectsStore } from "@/stores/useProjectStore";

export function useProjects() {
  const {
    projects,
    addProject,
    setSelectedProjectId,
    selectedProjectId,
    loadProjects,
  } = useProjectsStore();

  const [projectsWithTasks, setProjectsWithTasks] = useState<Project[]>([]);

  // Cargar los proyectos procesados del store al montar
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Mantener sincronizado el state local con los projects del store
  useEffect(() => {
    console.log(projects);
    setProjectsWithTasks(projects);
  }, [projects]);

  const selectedProject =
    projectsWithTasks.find((p) => p.id === selectedProjectId) || null;

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
    setSelectedProjectId(newProject.id);
  };

  const selectProject = (projectId: string) => setSelectedProjectId(projectId);

  return {
    projects: projectsWithTasks,
    selectedProject,
    createProject,
    selectProject,
  };
}
