import { create } from "zustand";
import { Project, ProjectSection, Task } from "@/interfaces";

const LOCAL_STORAGE_KEY = "asana-projects";
const LOCAL_STORAGE_TASKS_KEY = "asana-tasks";

interface ProjectsState {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  loadProjects: () => void;
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

  loadProjects: () => {
    if (typeof window === "undefined") return;

    const storedTasks = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

    const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    const projects: Project[] = storedProjects
      ? JSON.parse(storedProjects)
      : [];

    // Construir proyectos con tasks en cada sección
    const projectsWithTasks = projects.map((project) => ({
      ...project,
      sections: project.sections.map((section) => ({
        ...section,
        // Aquí agregamos la propiedad tasks temporalmente
        tasks: tasks.filter(
          (t) => t.projectId === project.id && t.sectionId === section.id
        ),
      })),
    }));

    set({
      projects: projectsWithTasks,
      selectedProjectId: projectsWithTasks[0]?.id || "",
    });
  },

  addProject: (project) => {
    const newProjectId = crypto.randomUUID();
    const newProject: Project = {
      ...project,
      id: newProjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
      sections: project.sections.map((section, index) => ({
        ...section,
        id: crypto.randomUUID(),
        projectId: newProjectId,
        order: index,
        createdAt: new Date(),
        tasks: [], // inicializar vacío
      })),
    };

    set((state) => {
      const updated = [...state.projects, newProject];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { projects: updated, selectedProjectId: newProjectId };
    });
  },

  updateProject: (updatedProject) =>
    set((state) => {
      const projects = state.projects.map((p) =>
        p.id === updatedProject.id
          ? { ...updatedProject, updatedAt: new Date() }
          : p
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      return { projects };
    }),

  deleteProject: (projectId) =>
    set((state) => {
      const projects = state.projects.filter((p) => p.id !== projectId);
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

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      return { projects };
    }),
}));
