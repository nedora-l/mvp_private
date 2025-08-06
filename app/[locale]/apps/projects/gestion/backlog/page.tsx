"use client";

import React, { useEffect, useState } from "react";

export default function BacklogPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v0/tasks");
        if (!res.ok) throw new Error("Erreur lors du chargement");
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Backlog</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-slate-400 italic">Chargement...</div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-4 shadow">
          <ul className="space-y-1">
            {tasks.filter((t) => t.sprintId == null).length === 0 ? (
              <li className="text-slate-400 italic">Aucune tâche dans le backlog.</li>
            ) : (
              tasks
                .filter((t) => t.sprintId == null)
                .map((t) => (
                  <li key={t.id} className="flex gap-2 items-center">
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                      {t.status}
                    </span>
                    <span>{t.title}</span>
                  </li>
                ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
