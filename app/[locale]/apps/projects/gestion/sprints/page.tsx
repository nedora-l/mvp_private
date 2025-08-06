"use client";

import React, { useEffect, useState } from "react";

export default function SprintsPage() {
  const [sprints, setSprints] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sRes, tRes] = await Promise.all([
          fetch("/api/v0/sprints"),
          fetch("/api/v0/tasks"),
        ]);
        if (!sRes.ok || !tRes.ok) throw new Error("Erreur lors du chargement");
        const sData = await sRes.json();
        const tData = await tRes.json();
        setSprints(sData.sprints || []);
        setTasks(tData.tasks || []);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sprints</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-slate-400 italic">Chargement...</div>
      ) : (
        <div className="space-y-8">
          {sprints.length === 0 && (
            <div className="bg-slate-50 rounded-xl p-4 shadow text-slate-400 italic">
              Aucun sprint pour le moment.
            </div>
          )}
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="bg-slate-50 rounded-xl p-4 shadow"
            >
              <div className="font-semibold text-lg mb-2">
                {sprint.name}{" "}
                <span className="text-xs text-slate-400">
                  ({sprint.startDate} → {sprint.endDate})
                </span>
              </div>
              <ul className="space-y-1">
                {tasks.filter((t) => t.sprintId === sprint.id).length === 0 ? (
                  <li className="text-slate-400 italic">
                    Aucune tâche dans ce sprint.
                  </li>
                ) : (
                  tasks
                    .filter((t) => t.sprintId === sprint.id)
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
          ))}
        </div>
      )}
    </div>
  );
}
