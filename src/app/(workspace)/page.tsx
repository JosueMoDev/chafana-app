"use client";

import { useEffect } from "react";
import { useProjectsStore } from "@/stores/useProjectStore";
import { useRouter } from "next/navigation";
import { useTasksStore } from "@/stores/useTaskStore";

export default function Home() {
  const projects = useProjectsStore((state) => state.projects);
  const loadProjects = useProjectsStore((state) => state.loadProjects);
  const loadTasks = useTasksStore((state) => state.loadTasks);
  const router = useRouter();

  useEffect(() => {
    console.log(projects, loadProjects);
    loadProjects();
    loadTasks();
  }, [loadProjects, loadTasks]);

  useEffect(() => {
    if (projects.length > 0) {
      console.log(projects);
      router.replace(`/projects/${projects[0].id}`);
    }
  }, [projects, router]);

  return <p className="p-4">Cargando proyectos...</p>;
}
