"use client";

import React, { useEffect, useState } from "react";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ projectId: '', title: '', status: 'À faire' });
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTask, setEditTask] = useState({ projectId: '', title: '', status: 'À faire' });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Déplacer fetchAll ici pour qu’elle soit accessible partout
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projRes, taskRes] = await Promise.all([
        fetch("/api/v0/projects"),
        fetch("/api/v0/tasks"),
      ]);
      if (!projRes.ok || !taskRes.ok) throw new Error("Erreur lors du chargement");
      const projData = await projRes.json();
      const taskData = await taskRes.json();
      setProjects(projData.projects || []);
      setTasks(taskData.tasks || []);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectIdNum = Number(newTask.projectId);
    if (!projectIdNum || !newTask.title || !newTask.status) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/v0/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectIdNum,
          title: newTask.title,
          status: newTask.status,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout de la tâche");
      setNewTask({ projectId: '', title: '', status: 'À faire' });
      setShowForm(false);
      await fetchAll();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditTask({
      projectId: String(task.projectId),
      title: task.title,
      status: task.status,
    });
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectIdNum = Number(editTask.projectId);
    if (!editingId || !projectIdNum || !editTask.title || !editTask.status) return;
    setSavingEdit(true);
    setError(null);
    try {
      const res = await fetch("/api/v0/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          projectId: projectIdNum,
          title: editTask.title,
          status: editTask.status,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification");
      setEditingId(null);
      setEditTask({ projectId: '', title: '', status: 'À faire' });
      await fetchAll();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/v0/tasks?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      await fetchAll();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tâches par projet</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => { setShowForm(v => !v); setEditingId(null); }}
        >
          {showForm ? "Annuler" : "Ajouter une tâche"}
        </button>
      </div>
      {showForm && !editingId && (
        <form onSubmit={handleAddTask} className="mb-6 bg-slate-50 p-4 rounded-xl shadow flex flex-col gap-3">
          <select
            value={newTask.projectId}
            onChange={e => setNewTask({ ...newTask, projectId: e.target.value })}
            className="border border-slate-300 rounded-lg px-4 py-2"
            required
          >
            <option value="">Sélectionner un projet</option>
            {projects.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Titre de la tâche"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            className="border border-slate-300 rounded-lg px-4 py-2"
            required
          />
          <select
            value={newTask.status}
            onChange={e => setNewTask({ ...newTask, status: e.target.value })}
            className="border border-slate-300 rounded-lg px-4 py-2"
            required
          >
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            disabled={adding}
          >
            {adding ? "Ajout..." : "Ajouter"}
          </button>
        </form>
      )}
      {editingId && (
        <form onSubmit={handleEditTask} className="mb-6 bg-yellow-50 p-4 rounded-xl shadow flex flex-col gap-3">
          <select
            value={editTask.projectId}
            onChange={e => setEditTask({ ...editTask, projectId: e.target.value })}
            className="border border-yellow-300 rounded-lg px-4 py-2"
            required
          >
            <option value="">Sélectionner un projet</option>
            {projects.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Titre de la tâche"
            value={editTask.title}
            onChange={e => setEditTask({ ...editTask, title: e.target.value })}
            className="border border-yellow-300 rounded-lg px-4 py-2"
            required
          />
          <select
            value={editTask.status}
            onChange={e => setEditTask({ ...editTask, status: e.target.value })}
            className="border border-yellow-300 rounded-lg px-4 py-2"
            required
          >
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="mt-2 px-4 py-2 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition"
              disabled={savingEdit}
            >
              {savingEdit ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              className="mt-2 px-4 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
              onClick={() => { setEditingId(null); setEditTask({ projectId: '', title: '', status: 'À faire' }); }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-slate-400 italic">Chargement...</div>
      ) : (
        <div className="space-y-8">
          {filteredProjects.map((project: any) => {
            const projectTasks = tasks.filter((t: any) => t.projectId === project.id);
            return (
              <div key={project.id} className="bg-slate-50 rounded-xl p-4 shadow">
                <div className="font-semibold text-lg mb-2">{project.name}</div>
                {projectTasks.length === 0 ? (
                  <div className="text-slate-400 italic">Aucune tâche pour ce projet.</div>
                ) : (
                  <ul className="space-y-1">
                    {projectTasks.map((task: any) => (
                      <li key={task.id} className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">{task.status}</span>
                        <span>{task.title}</span>
                        <button
                          className="ml-2 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          onClick={() => startEdit(task)}
                          disabled={editingId === task.id}
                        >
                          Éditer
                        </button>
                        <button
                          className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                          onClick={() => handleDelete(task.id)}
                          disabled={deletingId === task.id}
                        >
                          {deletingId === task.id ? "Suppression..." : "Supprimer"}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
