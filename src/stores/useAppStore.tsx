import { create } from "zustand";

interface AppState {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
}));
