"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  FolderOpen,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectsStore } from "@/stores/useProjectStore";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  onCreateProject: () => void;
}

export function Sidebar({
  currentView,
  onViewChange,
  collapsed,
  onToggle,
  onCreateProject,
}: SidebarProps) {
  const { projects, selectedProjectId, setSelectedProjectId } =
    useProjectsStore();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-background border-r border-border transition-all duration-300 z-50 theme-transition",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">TaskFlow</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1 h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {/* Navigation */}
          <nav className="p-2">
            <Button
              variant={currentView === "projects" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10 theme-transition",
                collapsed ? "px-2" : "px-3"
              )}
              onClick={() => onViewChange("projects")}
            >
              <FolderOpen className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
              {!collapsed && <span>Proyectos</span>}
            </Button>
          </nav>

          {!collapsed && (
            <>
              <Separator className="my-4" />
              {/* Projects */}
              <div className="px-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    Proyectos
                  </h3>
                  <div className="flex items-center space-x-1">
                    {!collapsed && <ThemeToggle />}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={onCreateProject}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  {projects.map((project) => {
                    const isActive = selectedProjectId === project.id;
                    return (
                      <Button
                        key={project.id}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start h-9 px-3",
                          "theme-transition",
                          isActive &&
                            "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                        onClick={() => setSelectedProjectId(project.id)}
                      >
                        <Circle
                          className="w-3 h-3 mr-3 fill-current"
                          style={{ color: project.color }}
                        />
                        <span className="truncate text-sm">{project.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-2 border-t border-border">
          {collapsed && (
            <div className="flex justify-center mb-2">
              <ThemeToggle />
            </div>
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10 theme-transition",
              collapsed ? "px-2" : "px-3"
            )}
          >
            <Settings className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
            {!collapsed && <span>Configuración</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
