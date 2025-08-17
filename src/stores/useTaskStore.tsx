import { create } from "zustand";
import { Task } from "@/interfaces";

const LOCAL_STORAGE_KEY = "asana-tasks";

interface TasksState {
  tasks: Task[];
  loadTasks: () => void;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt"> & {
      projectId: string;
      sectionId: string;
    }
  ) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],

  loadTasks: () => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const tasks: Task[] = stored ? JSON.parse(stored) : [];
    console.log("💥 Tasks cargadas:", tasks);
    set({ tasks });
  },

  addTask: (task) =>
    set((state) => {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updated = [...state.tasks, newTask];
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return { tasks: updated };
    }),

  updateTask: (updatedTask) =>
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === updatedTask.id
          ? { ...updatedTask, updatedAt: new Date() } // se puede cambiar sectionId
          : t
      );
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      return { tasks };
    }),

  deleteTask: (taskId) =>
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== taskId);
      if (typeof window !== "undefined")
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      return { tasks };
    }),
}));
