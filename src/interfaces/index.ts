export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  memberIds: string[];
  taskCount: number;
  completedTaskCount: number;
  sections: ProjectSection[];
}

export interface ProjectSection {
  id: string;
  name: string;
  projectId: string;
  order: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  sectionId: string;
  assigneeId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ViewType = 'dashboard' | 'projects' | 'tasks';
export type TaskViewType = 'board' | 'list';