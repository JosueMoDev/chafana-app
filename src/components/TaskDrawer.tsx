"use client";

import { useState, useRef } from "react";
import { Task, User, TaskAttachment, TaskComment } from "@/interfaces";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Paperclip,
  Send,
  Download,
  Trash2,
  Edit3,
  Save,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  User as UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TaskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  users: User[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskDrawer({
  open,
  onOpenChange,
  task,
  users,
  onTaskUpdate,
  onTaskDelete,
}: TaskDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!task) return null;

  const currentTask = editedTask || task;
  const assignee = currentTask.assigneeId
    ? users.find((u) => u.id === currentTask.assigneeId)
    : null;

  const handleEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTask) {
      onTaskUpdate({
        ...editedTask,
        updatedAt: new Date(),
      });
      setIsEditing(false);
      setEditedTask(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment: TaskAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: e.target?.result as string,
          type: getFileType(file.type),
          size: file.size,
          uploadedAt: new Date(),
          uploadedBy: "1", // Current user ID
        };

        const updatedTask = {
          ...currentTask,
          attachments: [...(currentTask.attachments || []), attachment],
          updatedAt: new Date(),
        };

        onTaskUpdate(updatedTask);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileType = (mimeType: string): TaskAttachment["type"] => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("text")
    )
      return "document";
    return "other";
  };

  const getFileIcon = (type: TaskAttachment["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: TaskComment = {
      id: Date.now().toString(),
      content: newComment,
      authorId: "1", // Current user ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTask = {
      ...currentTask,
      comments: [...(currentTask.comments || []), comment],
      updatedAt: new Date(),
    };

    onTaskUpdate(updatedTask);
    setNewComment("");
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    const updatedTask = {
      ...currentTask,
      attachments:
        currentTask.attachments?.filter((a) => a.id !== attachmentId) || [],
      updatedAt: new Date(),
    };
    onTaskUpdate(updatedTask);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "todo":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-hidden flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">
              {isEditing ? (
                <Input
                  value={editedTask?.title || ""}
                  onChange={(e) =>
                    setEditedTask((prev) =>
                      prev ? { ...prev, title: e.target.value } : null
                    )
                  }
                  className="text-xl font-semibold border-none p-0 h-auto focus-visible:ring-0"
                />
              ) : (
                currentTask.title
              )}
            </SheetTitle>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-1" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" variant="outline" onClick={handleEdit}>
                    <Edit3 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onTaskDelete(currentTask.id);
                      onOpenChange(false);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {/* Task Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Estado
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedTask?.status}
                      onValueChange={(value) =>
                        setEditedTask((prev) =>
                          prev
                            ? {
                                ...prev,
                                status: value as Task["status"],
                              }
                            : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">Por Hacer</SelectItem>
                        <SelectItem value="in-progress">En Progreso</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(currentTask.status)}>
                      {currentTask.status === "todo"
                        ? "Por Hacer"
                        : currentTask.status === "in-progress"
                        ? "En Progreso"
                        : "Completado"}
                    </Badge>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Prioridad
                  </label>
                  {isEditing ? (
                    <Select
                      value={editedTask?.priority}
                      onValueChange={(value) =>
                        setEditedTask((prev) =>
                          prev
                            ? {
                                ...prev,
                                priority: value as Task["priority"],
                              }
                            : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getPriorityColor(currentTask.priority)}>
                      {currentTask.priority === "low"
                        ? "Baja"
                        : currentTask.priority === "medium"
                        ? "Media"
                        : "Alta"}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Asignado a
                </label>
                {isEditing ? (
                  <Select
                    value={editedTask?.assigneeId || "unassigned"}
                    onValueChange={(value) =>
                      setEditedTask((prev) =>
                        prev
                          ? {
                              ...prev,
                              assigneeId:
                                value === "unassigned" ? undefined : value,
                            }
                          : null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Sin asignar</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="text-xs">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : assignee ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                      <AvatarFallback className="text-xs">
                        {assignee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{assignee.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <UserIcon className="w-6 h-6" />
                    <span className="text-sm">Sin asignar</span>
                  </div>
                )}
              </div>

              {/* Due Date */}
              {currentTask.dueDate && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Fecha Límite
                  </label>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(currentTask.dueDate), "dd MMMM yyyy", {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Descripción
                </label>
                {isEditing ? (
                  <Textarea
                    value={editedTask?.description || ""}
                    onChange={(e) =>
                      setEditedTask((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    rows={4}
                    placeholder="Describe los detalles de la tarea..."
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {currentTask.description || "Sin descripción"}
                  </p>
                )}
              </div>

              <Separator />

              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Archivos Adjuntos</h3>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      Adjuntar Archivo
                    </Button>
                  </div>
                </div>

                {currentTask.attachments &&
                currentTask.attachments.length > 0 ? (
                  <div className="space-y-3">
                    {currentTask.attachments.map((attachment) => {
                      const uploader = users.find(
                        (u) => u.id === attachment.uploadedBy
                      );
                      return (
                        <div
                          key={attachment.id}
                          className="border rounded-lg p-3 hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              {getFileIcon(attachment.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(attachment.size)} •{" "}
                                  {uploader?.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {format(
                                    new Date(attachment.uploadedAt),
                                    "dd MMM yyyy HH:mm",
                                    { locale: es }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = attachment.url;
                                  link.download = attachment.name;
                                  link.click();
                                }}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDeleteAttachment(attachment.id)
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Preview for images */}
                          {attachment.type === "image" && (
                            <div className="mt-2">
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="max-w-full h-32 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No hay archivos adjuntos
                  </p>
                )}
              </div>

              <Separator />

              {/* Comments */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Comentarios</h3>

                {/* Add Comment */}
                <div className="flex space-x-3 mb-6">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={users[0]?.avatar} alt={users[0]?.name} />
                    <AvatarFallback>
                      {users[0]?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Comentar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                {currentTask.comments && currentTask.comments.length > 0 ? (
                  <div className="space-y-4">
                    {currentTask.comments.map((comment) => {
                      const author = users.find(
                        (u) => u.id === comment.authorId
                      );
                      return (
                        <div key={comment.id} className="flex space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={author?.avatar}
                              alt={author?.name}
                            />
                            <AvatarFallback>
                              {author?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                  {author?.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {format(
                                    new Date(comment.createdAt),
                                    "dd MMM yyyy HH:mm",
                                    { locale: es }
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No hay comentarios aún
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
