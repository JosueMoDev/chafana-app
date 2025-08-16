"use client";

import * as React from "react";
import { ProjectBoard } from "@/components/ProjectBoard";
import { useProjects } from "@/hooks/useProjects";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = React.use(params); // ✅ use() para acceder a params
  const { projects, selectProject, selectedProject } = useProjects();

  // Selección automática del proyecto según id
  if (!selectedProject && projects.length > 0) {
    const projectToSelect = projects.find((p) => p.id === id) ?? projects[0];
    selectProject(projectToSelect.id);
  }

  if (!selectedProject) return <p className="p-4">Cargando proyecto...</p>;

  return (
    <ProjectBoard
      project={selectedProject}
      users={[]} // añadir useUsers si quieres
    />
  );
}
