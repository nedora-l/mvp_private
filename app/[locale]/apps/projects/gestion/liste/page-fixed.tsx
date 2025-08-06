"use client";

import React, { useState } from "react";
import { Project, useProjects } from "@/contexts/projects-context";
import ProjectCreateModal from "@/components/projects/ProjectCreateModal";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ListeDesProjetsPage() {
  const [search, setSearch] = useState("");
  // ✅ Utiliser le contexte avec les bons types
  const { projects, loading, addProject, editProject, deleteProject } = useProjects();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState({
    name: "",
    type: "Jira",
    customType: "",
    description: "",
    status: "En cours",
    startDate: "",
    endDate: "",
    members: ""
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Fonction d'ajout compatible avec le contexte
  const handleAddProjectLocal = async (projectForm: { name: string; type: string; description: string; status?: string; startDate?: string; endDate?: string; members?: string }) => {
    setAdding(true);
    try {
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectForm.name,
        type: projectForm.type,
        description: projectForm.description,
        customType: "",
        status: projectForm.status || "En cours",
        startDate: projectForm.startDate || "",
        endDate: projectForm.endDate || "",
        members: projectForm.members || ""
      };
      
      await addProject(newProject);
      setShowModal(false);
      console.log("✅ Projet ajouté via contexte");
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout:", error);
      setError("Erreur lors de l'ajout du projet");
    } finally {
      setAdding(false);
    }
  };

  // ✅ Suppression avec conversion ID→index
  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce projet ?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const index = projects.findIndex(p => p.id === id);
      if (index === -1) throw new Error("Projet non trouvé");
      
      await deleteProject(index); // ✅ Utiliser l'index
      console.log("✅ Projet supprimé via contexte");
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
      setError("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Édition avec conversion ID→index
  const handleEdit = async (id: string, form: typeof editedProject) => {
    setEditingId(id);
    setError(null);
    try {
      const index = projects.findIndex(p => p.id === id);
      if (index === -1) throw new Error("Projet non trouvé");

      const updatedProject: Project = {
        id,
        name: form.name,
        type: form.type,
        description: form.description,
        customType: form.customType || "",
        status: form.status || "En cours",
        startDate: form.startDate || "",
        endDate: form.endDate || "",
        members: form.members || ""
      };
      
      await editProject(index, updatedProject); // ✅ Utiliser l'index
      setEditingId(null);
      console.log("✅ Projet modifié via contexte");
    } catch (error) {
      console.error("❌ Erreur lors de la modification:", error);
      setError("Erreur lors de la modification");
    } finally {
      setEditingId(null);
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditedProject({
      name: project.name,
      type: project.type,
      customType: project.customType || "",
      description: project.description,
      status: project.status || "En cours",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      members: project.members || ""
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      handleEdit(editingId, editedProject);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Mes Projets ({projects.length})
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
              ➕ Nouveau Projet
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {project.type === "Jira" && <img src="/logo/jira.svg" alt="Jira" className="h-6" />}
                    {project.type === "Trello" && <img src="/logo/trello.svg" alt="Trello" className="h-6" />}
                    {project.type === "Slack" && <img src="/logo/slack.svg" alt="Slack" className="h-6" />}
                    {project.type === "Autre" && <span className="text-2xl">🛠️</span>}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-gray-500">{project.type}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.status === "Terminé" ? "bg-green-100 text-green-800" :
                    project.status === "En cours" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {project.status || "En cours"}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(project)}
                  disabled={editingId === project.id}
                >
                  {editingId === project.id ? "⏳" : "✏️"} Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id ? "⏳" : "🗑️"} Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {search ? "Aucun projet trouvé pour cette recherche." : "Aucun projet créé."}
            </p>
          </div>
        )}
      </div>

      {/* ✅ Modal d'ajout avec la bonne interface */}
      {showModal && (
        <ProjectCreateModal
          onCreate={(project) => {
            handleAddProjectLocal(project);
          }}
        />
      )}

      {/* Modal d'édition de projet */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card className="max-w-md mx-auto shadow-lg rounded-2xl border-0 bg-white animate-fadein max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-col items-center justify-center pb-0">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 to-blue-400 mb-2 shadow-lg">
                {editedProject.type === "Jira" && <img src="/logo/jira.svg" alt="Jira" className="h-8" />}
                {editedProject.type === "Trello" && <img src="/logo/trello.svg" alt="Trello" className="h-8" />}
                {editedProject.type === "Slack" && <img src="/logo/slack.svg" alt="Slack" className="h-8" />}
                {editedProject.type === "Autre" && <span className="text-3xl text-slate-400">🛠️</span>}
              </div>
              <CardTitle className="text-xl font-bold text-yellow-700">Modifier le projet</CardTitle>
              <CardDescription className="text-xs text-slate-500 pt-1">Tous les champs sont éditables</CardDescription>
            </CardHeader>
            <form onSubmit={handleEditSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
                  <input
                    type="text"
                    required
                    value={editedProject.name}
                    onChange={e => setEditedProject({ ...editedProject, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de projet</label>
                  <select
                    value={editedProject.type}
                    onChange={e => setEditedProject({ ...editedProject, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="Jira">Jira</option>
                    <option value="Trello">Trello</option>
                    <option value="Slack">Slack</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {editedProject.type === "Autre" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type personnalisé</label>
                      <input
                        type="text"
                        placeholder="Spécifiez le type..."
                        value={editedProject.customType}
                        onChange={e => setEditedProject({ ...editedProject, customType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={editedProject.description}
                    onChange={e => setEditedProject({ ...editedProject, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={editedProject.status}
                    onChange={e => setEditedProject({ ...editedProject, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="En attente">En attente</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                    <input
                      type="date"
                      value={editedProject.startDate}
                      onChange={e => setEditedProject({ ...editedProject, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                    <input
                      type="date"
                      value={editedProject.endDate}
                      onChange={e => setEditedProject({ ...editedProject, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membres (séparés par des virgules)</label>
                  <input
                    type="text"
                    placeholder="Jean, Marie, Pierre..."
                    value={editedProject.members}
                    onChange={e => setEditedProject({ ...editedProject, members: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="w-full" type="button" onClick={() => {
                  setEditingId(null);
                  setEditedProject({ name: "", type: "Jira", customType: "", description: "", status: "En cours", startDate: "", endDate: "", members: "" });
                }}>
                  Annuler
                </Button>
                <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700">
                  {editingId ? "⏳ Modification..." : "💾 Sauvegarder"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
