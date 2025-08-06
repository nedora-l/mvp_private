"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectCreateModal from "@/components/projects/ProjectCreateModal";
import { mockProjects as initialProjects, Project } from "./mockProjects";

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showModal, setShowModal] = useState(false);

  const handleCreate = (form: { name: string; type: string; description: string }) => {
    const newProject: Project = {
      id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      name: form.name,
      type: form.type as Project["type"],
      description: form.description,
    };
    setProjects([newProject, ...projects]);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion de Projets</h1>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-slate-600">Liste des projets et modules associés :</p>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white">Créer un projet</Button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full">
            <ProjectCreateModal onCreate={handleCreate} />
            <Button variant="outline" className="mt-4 w-full" onClick={() => setShowModal(false)}>Annuler</Button>
          </div>
        </div>
      )}
      <ul className="space-y-3 mt-4">
        {projects.map(project => (
          <li key={project.id} className="flex flex-col md:flex-row md:items-center gap-2 p-3 bg-slate-50 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <span role="img" aria-label="Project">�</span>
              <span className="font-semibold">{project.name}</span>
              <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">{project.type}</span>
            </div>
            {project.description && (
              <span className="text-slate-500 text-sm ml-6">{project.description}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
