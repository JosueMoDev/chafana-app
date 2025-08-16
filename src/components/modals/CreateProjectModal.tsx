import { useState } from "react";
import { Project, User } from "@/interfaces";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreate: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => void;
  users: User[];
}

const projectColors = [
  "#4338ca",
  "#059669",
  "#dc2626",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#be185d",
  "#ca8a04",
];

const defaultSections = ["Pendientes", "En Progreso", "Completado"];

export function CreateProjectModal({
  open,
  onOpenChange,
  onProjectCreate,
  users,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: projectColors[0],
    memberIds: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ formData });
    // if (!formData.name.trim()) return;

    const sections = defaultSections.map((name, index) => ({
      id: crypto.randomUUID(),
      name,
      projectId: "", // Will be set by parent
      order: index,
      createdAt: new Date(),
    }));

    onProjectCreate({
      ...formData,
      taskCount: 0,
      completedTaskCount: 0,
      sections,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      color: projectColors[0],
      memberIds: [],
    });

    onOpenChange(false);
  };

  const handleMemberToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(userId)
        ? prev.memberIds.filter((id) => id !== userId)
        : [...prev.memberIds, userId],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
          <DialogDescription>
            Configura los detalles de tu nuevo proyecto y asigna miembros del
            equipo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Proyecto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ej. Sistema de E-commerce"
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
                placeholder="Describe el objetivo y alcance del proyecto..."
                rows={3}
              />
            </div>

            <div>
              <Label>Color del Proyecto</Label>
              <div className="flex space-x-2 mt-2">
                {projectColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? "border-gray-900 scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Miembros del Equipo</Label>
              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`member-${user.id}`}
                      checked={formData.memberIds.includes(user.id)}
                      onCheckedChange={() => handleMemberToggle(user.id)}
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
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
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Crear Proyecto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
