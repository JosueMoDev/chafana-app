"use client";
import { create } from "zustand";
import { Project, ProjectSection } from "@/interfaces";

const LOCAL_STORAGE_KEY = "asana-projects";

interface ProjectsState {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  loadProjects: () => void; // NUEVO
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addSection: (projectId: string, name: string) => void;
  updateSection: (projectId: string, sectionId: string, name: string) => void;
  deleteSection: (projectId: string, sectionId: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  selectedProjectId: "",
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),

  // Cargar desde localStorage solo en cliente
  loadProjects: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const projects: Project[] = stored ? JSON.parse(stored) : [];
    set({ projects, selectedProjectId: projects[0]?.id || "" });
  },

  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      sections: project.sections.map((section) => ({
        ...section,
        id: crypto.randomUUID(),
        projectId: crypto.randomUUID(),
        createdAt: new Date(),
      })),
    };
    set((state) => {
      const updated = [...state.projects, newProject];
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { projects: updated, selectedProjectId: newProject.id };
    });
  },

  updateProject: (updatedProject) =>
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === updatedProject.id
          ? { ...updatedProject, updatedAt: new Date() }
          : p
      );
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      return { projects };
    }),

  deleteProject: (projectId) =>
    set((state) => {
      const projects = state.projects.filter((p) => p.id !== projectId);
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      const selectedProjectId =
        state.selectedProjectId === projectId
          ? projects[0]?.id || ""
          : state.selectedProjectId;
      return { projects, selectedProjectId };
    }),

  addSection: (projectId, name) =>
    set((state) => {
      const projects = state.projects.map((p) => {
        if (p.id !== projectId) return p;
        const newSection: ProjectSection = {
          id: crypto.randomUUID(),
          name,
          projectId,
          order: p.sections.length,
          createdAt: new Date(),
        };
        return {
          ...p,
          sections: [...p.sections, newSection],
          updatedAt: new Date(),
        };
      });
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      return { projects };
    }),

  updateSection: (projectId, sectionId, name) =>
    set((state) => {
      const projects = state.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          sections: p.sections.map((s) =>
            s.id === sectionId ? { ...s, name } : s
          ),
          updatedAt: new Date(),
        };
      });
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      return { projects };
    }),

  deleteSection: (projectId, sectionId) =>
    set((state) => {
      const projects = state.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          sections: p.sections.filter((s) => s.id !== sectionId),
          updatedAt: new Date(),
        };
      });
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      return { projects };
    }),
}));
