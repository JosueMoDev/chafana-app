"use client";

import { useState } from "react";
import { Task, User } from "@/interfaces";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreate: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  users: User[];
  projectId: string; // obligatorio
  sectionId: string; // obligatorio
}

export function CreateTaskModal({
  open,
  onOpenChange,
  onTaskCreate,
  users,
  projectId,
  sectionId,
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"],
    projectId, // obligatorio
    sectionId, // obligatorio
    assigneeId: "unassigned",
    dueDate: undefined as Date | undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enviar tarea
    onTaskCreate({
      ...formData,
      assigneeId:
        formData.assigneeId === "unassigned" ? undefined : formData.assigneeId,
      dueDate: formData.dueDate,
    });

    // Resetear formulario manteniendo projectId y sectionId
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      projectId,
      sectionId,
      assigneeId: "unassigned",
      dueDate: undefined,
    });

    onOpenChange(false);
  };

  const getAssignee = (id: string) => users.find((user) => user.id === id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            Define los detalles de la tarea y asigna un responsable.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título de la Tarea</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Ej. Implementar sistema de autenticación"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe los detalles y requerimientos de la tarea..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as Task["status"],
                    }))
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
              </div>

              <div>
                <Label>Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: value as Task["priority"],
                    }))
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
              </div>
            </div>

            <div>
              <Label>Asignado a</Label>
              <Select
                value={formData.assigneeId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, assigneeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar miembro del equipo">
                    {formData.assigneeId !== "unassigned" && (
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const assignee = getAssignee(formData.assigneeId);
                          return assignee ? (
                            <>
                              <Avatar className="w-5 h-5">
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
                              <span>{assignee.name}</span>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </SelectValue>
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
            </div>

            <div>
              <Label>Fecha Límite</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start w-full font-normal text-left"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {formData.dueDate
                      ? format(formData.dueDate, "dd/MM/yyyy")
                      : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) =>
                      setFormData((prev) => ({ ...prev, dueDate: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 theme-transition"
            >
              Crear Tarea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
