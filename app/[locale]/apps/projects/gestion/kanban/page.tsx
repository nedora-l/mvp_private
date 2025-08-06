"use client";

import React, { useEffect, useState } from "react";

const STATUSES = ["À faire", "En cours", "Terminé"];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tableau Kanban</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-slate-400 italic">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUSES.map(status => (
            <div key={status} className="bg-slate-50 rounded-xl p-4 shadow min-h-[300px]">
              <div className="font-semibold text-lg mb-2">{status}</div>
              <ul className="space-y-2">
                {tasks.filter(t => t.status === status).map(task => (
                  <li key={task.id} className="p-3 rounded bg-white border shadow flex flex-col">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-xs text-slate-400">ID: {task.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
