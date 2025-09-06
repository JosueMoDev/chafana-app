"use client";

import { useState, useEffect } from "react";
import { Project, Task, User, ProjectSection } from "@/interfaces";
import { useProjectsStore } from "@/stores/useProjectStore";
import { useTasksStore } from "@/stores/useTaskStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { TaskDrawer } from "./TaskDrawer";
import { CreateTaskModal } from "./modals/CreateTaskModal";
import { mockUsers } from "@/data/mockData";

import {
  Plus,
  MoreVertical,
  Calendar,
  AlertCircle,
  MessageCircle,
  Paperclip,
  X,
  Check,
  Edit3,
} from "lucide-react";

interface ProjectBoardProps {
  project: Project;
  users: User[];
}

export function ProjectBoard({ project, users }: ProjectBoardProps) {
  const { addSection, updateSection, deleteSection } = useProjectsStore();
  const { tasks, loadTasks, addTask, updateTask, deleteTask } = useTasksStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const getTasksBySection = (sectionId: string) =>
    tasks
      .filter((t) => t.sectionId === sectionId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const getUserById = (id: string) => users.find((user) => user.id === id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isOverdue = (task: Task) =>
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDrawerOpen(true);
  };

  const handleCreateTask = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setCreateTaskModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    targetSectionId: string,
    targetTaskId?: string
  ) => {
    e.preventDefault();
    if (!draggedTask) return;

    const sectionTasks = getTasksBySection(targetSectionId);

    if (targetTaskId) {
      const targetIndex = sectionTasks.findIndex((t) => t.id === targetTaskId);
      const updatedTasks = sectionTasks.filter((t) => t.id !== draggedTask.id);
      updatedTasks.splice(targetIndex, 0, {
        ...draggedTask,
        sectionId: targetSectionId,
      });

      updatedTasks.forEach((t, index) => {
        updateTask({ ...t, order: index, updatedAt: new Date() });
      });
    } else {
      const newOrder = sectionTasks.length;
      updateTask({
        ...draggedTask,
        sectionId: targetSectionId,
        order: newOrder,
        updatedAt: new Date(),
      });
    }

    setDraggedTask(null);
  };

  const handleSectionEdit = (section: ProjectSection) => {
    setEditingSectionId(section.id);
    setEditingSectionName(section.name);
  };

  const handleSectionSave = () => {
    if (editingSectionId && editingSectionName.trim()) {
      updateSection(project.id, editingSectionId, editingSectionName.trim());
    }
    setEditingSectionId(null);
    setEditingSectionName("");
  };

  const handleSectionCancel = () => {
    setEditingSectionId(null);
    setEditingSectionName("");
  };

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      addSection(project.id, newSectionName.trim());
      setNewSectionName("");
      setIsAddingSection(false);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    const section = project.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const firstSection = project.sections.find((s) => s.id !== sectionId);
    if (firstSection) {
      getTasksBySection(sectionId).forEach((task) => {
        updateTask({
          ...task,
          sectionId: firstSection.id,
          updatedAt: new Date(),
        });
      });
    }

    deleteSection(project.id, sectionId);
  };

  const sortedSections = [...project.sections].sort(
    (a, b) => a.order - b.order
  );

  return (
    <>
      <div className="p-6 space-y-6 theme-transition">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {project.name}
              </h1>
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>

        <div className="flex space-x-6 overflow-x-auto pb-4">
          {sortedSections.map((section) => {
            const sectionTasks = getTasksBySection(section.id);

            return (
              <div
                key={section.id}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section.id)}
              >
                <div className="bg-muted/30 rounded-lg p-4 mb-4 theme-transition">
                  <div className="flex items-center justify-between mb-3">
                    {editingSectionId === section.id ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <Input
                          value={editingSectionName}
                          onChange={(e) =>
                            setEditingSectionName(e.target.value)
                          }
                          className="h-8 text-sm font-semibold"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSectionSave();
                            if (e.key === "Escape") handleSectionCancel();
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={handleSectionSave}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSectionCancel}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-foreground">
                            {section.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {sectionTasks.length}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleSectionEdit(section)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteSection(section.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => handleCreateTask(section.id)}
                    className="w-full h-9 theme-transition"
                    variant="secondary"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Agregar Tarea
                  </Button>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {sectionTasks.map((task) => {
                    const assignee = task.assigneeId
                      ? getUserById(task.assigneeId)
                      : null;
                    const overdue = isOverdue(task);

                    return (
                      <Card
                        key={task.id}
                        className="hover:shadow-md transition-all duration-200 cursor-pointer theme-transition hover:scale-[1.02] border-border/50"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, section.id, task.id)}
                        onClick={() => handleTaskClick(task)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium leading-5">
                              {task.title}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <Badge
                              className={`text-xs ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority === "high"
                                ? "Alta"
                                : task.priority === "medium"
                                ? "Media"
                                : "Baja"}
                            </Badge>
                            {task.dueDate && (
                              <div
                                className={`flex items-center text-xs ${
                                  overdue
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {overdue && (
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                )}
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {(task.attachments?.length || 0) > 0 && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Paperclip className="w-3 h-3 mr-1" />
                                  {task.attachments?.length}
                                </div>
                              )}
                              {(task.comments?.length || 0) > 0 && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <MessageCircle className="w-3 h-3 mr-1" />
                                  {task.comments?.length}
                                </div>
                              )}
                            </div>
                            {assignee && (
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={assignee.avatar}
                                  alt={assignee.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {assignee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex-shrink-0 w-80">
            {isAddingSection ? (
              <div className="bg-muted/30 rounded-lg p-4 theme-transition">
                <Input
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Nombre de la sección"
                  className="mb-3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSection();
                    if (e.key === "Escape") {
                      setIsAddingSection(false);
                      setNewSectionName("");
                    }
                  }}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleAddSection}>
                    <Check className="w-4 h-4 mr-1" /> Agregar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingSection(false);
                      setNewSectionName("");
                    }}
                  >
                    <X className="w-4 h-4 mr-1" /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full h-16 border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-border theme-transition"
                onClick={() => setIsAddingSection(true)}
              >
                <Plus className="w-5 h-5 mr-2" /> Agregar Sección
              </Button>
            )}
          </div>
        </div>
      </div>

      <TaskDrawer
        open={taskDrawerOpen}
        onOpenChange={setTaskDrawerOpen}
        task={selectedTask}
        users={mockUsers}
        onTaskUpdate={updateTask}
        onTaskDelete={deleteTask}
      />

      <CreateTaskModal
        open={createTaskModalOpen}
        onOpenChange={setCreateTaskModalOpen}
        onTaskCreate={(taskData) =>
          addTask({
            ...taskData,
            projectId: project.id,
            sectionId: selectedSectionId,
            order: getTasksBySection(selectedSectionId).length,
          })
        }
        users={mockUsers}
        projectId={project.id}
        sectionId={selectedSectionId}
      />
    </>
  );
}
