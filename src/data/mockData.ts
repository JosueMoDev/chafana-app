import { User, Project, Task } from "@/interfaces";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Ana García",
    email: "ana@company.com",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "Carlos López",
    email: "carlos@company.com",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "María Rodríguez",
    email: "maria@company.com",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "David Martínez",
    email: "david@company.com",
    avatar:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?w=100&h=100&fit=crop&crop=face",
  },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Sistema de E-commerce",
    description:
      "Desarrollo completo de plataforma de e-commerce con React y Node.js",
    color: "#4338ca",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    memberIds: ["1", "2", "3"],
    taskCount: 8,
    completedTaskCount: 3,
    sections: [
      {
        id: "sec1",
        name: "Pendientes",
        projectId: "1",
        order: 0,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "sec2",
        name: "En Desarrollo",
        projectId: "1",
        order: 1,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "sec3",
        name: "Testing",
        projectId: "1",
        order: 2,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "sec4",
        name: "Completado",
        projectId: "1",
        order: 3,
        createdAt: new Date("2024-01-15"),
      },
    ],
  },
];

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Configurar base de datos",
    description: "Crear esquema de base de datos y configurar conexiones",
    status: "completed",
    priority: "high",
    projectId: "1",
    sectionId: "sec4",
    assigneeId: "1",
    dueDate: new Date("2024-01-25"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
];
