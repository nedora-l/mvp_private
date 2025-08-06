"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const STATUSES = ["À faire", "En cours", "Terminé"];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingTask, setAddingTask] = useState<{ [status: string]: boolean }>({});
  const [newTaskTitle, setNewTaskTitle] = useState<{ [status: string]: string }>({});
  const [newTaskDescription, setNewTaskDescription] = useState<{ [status: string]: string }>({});
  const [newTaskPriority, setNewTaskPriority] = useState<{ [status: string]: string }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v0/tasks");
      if (!res.ok) throw new Error("Erreur lors du chargement des tâches");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    // Si la colonne change, on met à jour le statut
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    if (sourceStatus !== destStatus) {
      const taskId = Number(draggableId);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      try {
        await fetch("/api/v0/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...task, status: destStatus }),
        });
        await fetchTasks();
      } catch (err: any) {
        setError("Erreur lors du déplacement de la tâche");
      }
    }
  };

  const handleAddTask = async (status: string) => {
    const title = newTaskTitle[status]?.trim();
    if (!title) return;
    setAddingTask(t => ({ ...t, [status]: true }));
    setError(null);
    try {
      const res = await fetch("/api/v0/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: 1, // Par défaut, ou à adapter si multi-projets
          title,
          status,
          description: newTaskDescription[status] || '',
          priority: newTaskPriority[status] || 'Normale',
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout de la tâche");
      setNewTaskTitle(t => ({ ...t, [status]: "" }));
      setNewTaskDescription(t => ({ ...t, [status]: "" }));
      setNewTaskPriority(t => ({ ...t, [status]: "" }));
      await fetchTasks();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setAddingTask(t => ({ ...t, [status]: false }));
    }
  };

  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditDescription(task.description || "");
    setEditPriority(task.priority || "Normale");
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTitle.trim() || !editStatus) return;
    setSavingEdit(true);
    setError(null);
    try {
      const task = tasks.find(t => t.id === editingId);
      if (!task) return;
      const res = await fetch("/api/v0/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...task,
          title: editTitle,
          status: editStatus,
          description: editDescription,
          priority: editPriority,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification");
      setEditingId(null);
      setEditTitle("");
      setEditStatus("");
      setEditDescription("");
      setEditPriority("");
      await fetchTasks();
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
      await fetchTasks();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tableau Kanban</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-slate-400 italic">Chargement...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATUSES.map(status => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-slate-50 rounded-xl p-4 shadow min-h-[300px]"
                  >
                    <div className="font-semibold text-lg mb-2">{status}</div>
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleAddTask(status);
                      }}
                      className="flex flex-col gap-2 mb-4"
                    >
                      <input
                        type="text"
                        placeholder="Nouvelle tâche..."
                        value={newTaskTitle[status] || ""}
                        onChange={e => setNewTaskTitle(t => ({ ...t, [status]: e.target.value }))}
                        className="border border-slate-300 rounded-lg px-2 py-1 flex-1"
                        required
                      />
                      <textarea
                        placeholder="Description"
                        value={newTaskDescription[status] || ""}
                        onChange={e => setNewTaskDescription(t => ({ ...t, [status]: e.target.value }))}
                        className="border border-slate-300 rounded-lg px-2 py-1 flex-1"
                        rows={2}
                      />
                      <select
                        value={newTaskPriority[status] || "Normale"}
                        onChange={e => setNewTaskPriority(t => ({ ...t, [status]: e.target.value }))}
                        className="border border-slate-300 rounded-lg px-2 py-1"
                      >
                        <option value="Basse">Basse</option>
                        <option value="Normale">Normale</option>
                        <option value="Haute">Haute</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                        disabled={addingTask[status]}
                      >
                        {addingTask[status] ? "Ajout..." : "+"}
                      </button>
                    </form>
                    <ul className="space-y-2">
                      {tasks.filter(t => t.status === status).map((task, idx) => (
                        <Draggable draggableId={String(task.id)} index={idx} key={task.id}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-3 rounded bg-white border shadow flex flex-col gap-2"
                            >
                              {editingId === task.id ? (
                                <form onSubmit={handleEditTask} className="flex flex-col gap-2">
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={e => setEditTitle(e.target.value)}
                                    className="border border-yellow-300 rounded px-2 py-1"
                                    required
                                  />
                                  <textarea
                                    value={editDescription}
                                    onChange={e => setEditDescription(e.target.value)}
                                    className="border border-yellow-300 rounded px-2 py-1"
                                    rows={2}
                                    placeholder="Description"
                                  />
                                  <select
                                    value={editPriority}
                                    onChange={e => setEditPriority(e.target.value)}
                                    className="border border-yellow-300 rounded px-2 py-1"
                                  >
                                    <option value="Basse">Basse</option>
                                    <option value="Normale">Normale</option>
                                    <option value="Haute">Haute</option>
                                  </select>
                                  <select
                                    value={editStatus}
                                    onChange={e => setEditStatus(e.target.value)}
                                    className="border border-yellow-300 rounded px-2 py-1"
                                    required
                                  >
                                    {STATUSES.map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      className="px-3 py-1 rounded bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition"
                                      disabled={savingEdit}
                                    >
                                      {savingEdit ? "Enregistrement..." : "Enregistrer"}
                                    </button>
                                    <button
                                      type="button"
                                      className="px-3 py-1 rounded bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition"
                                      onClick={() => { setEditingId(null); setEditTitle(""); setEditStatus(""); setEditDescription(""); setEditPriority(""); }}
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <span className="font-medium">{task.title}</span>
                                  {task.description && <span className="text-xs text-slate-500 mt-1">{task.description}</span>}
                                  <div className="flex gap-2 mt-1 items-center">
                                    <span className={`text-xs px-2 py-1 rounded ${task.priority === 'Haute' ? 'bg-red-100 text-red-700' : task.priority === 'Basse' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{task.priority}</span>
                                    <span className="text-xs text-slate-400">ID: {task.id}</span>
                                    {task.createdAt && <span className="text-xs text-slate-400">{task.createdAt}</span>}
                                  </div>
                                  <div className="flex gap-2 mt-1">
                                    <button
                                      className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
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
                                  </div>
                                </>
                              )}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
