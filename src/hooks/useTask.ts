import { useTasksStore } from "@/stores/useTaskStore";

export function useTasks() {
  const tasks = useTasksStore((state) => state.tasks);
  const addTask = useTasksStore((state) => state.addTask);
  const updateTask = useTasksStore((state) => state.updateTask);
  const deleteTask = useTasksStore((state) => state.deleteTask);

  const getTasksByProject = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId);

  return {
    tasks,
    getTasksByProject,
    addTask,
    updateTask,
    deleteTask,
  };
}
