"use client";

import { useState } from "react";
import { Sidebar } from "@/components/SideBar";
import { CreateProjectModal } from "@/components/modals/CreateProjectModal";
import { User } from "@/interfaces";
import { mockUsers } from "@/data/mockData";
import { useProjectsStore } from "@/stores/useProjectStore";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  const { addProject } = useProjectsStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView="projects"
        onViewChange={() => {}}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onCreateProject={() => setCreateProjectModalOpen(true)}
      />

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-64"
        } overflow-auto`}
      >
        {children}
      </main>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={createProjectModalOpen}
        onOpenChange={setCreateProjectModalOpen}
        onProjectCreate={(projectData) => {
          addProject(projectData); // Agrega el proyecto al store
          setCreateProjectModalOpen(false); // Cierra el modal
        }}
        users={mockUsers as User[]}
      />
    </div>
  );
}
