"use client";

import { useEffect } from "react";
import { useProjectsStore } from "@/stores/useProjectStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const projects = useProjectsStore((state) => state.projects);
  const router = useRouter();

  useEffect(() => {
    if (projects.length > 0) {
      router.replace(`/projects/${projects[0].id}`);
    }
  }, [projects, router]);

  return <p className="p-4">Cargando proyectos...</p>;
}
