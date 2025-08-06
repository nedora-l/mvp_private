"use client";

import React, { useEffect, useState } from "react";

export default function OverviewPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v0/projects");
        if (!res.ok) throw new Error("Erreur lors du chargement des projets");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const total = projects.length;
  const byType = projects.reduce((acc: Record<string, number>, p: any) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vue d'ensemble</h1>
      <div className="mb-6 text-slate-600">Résumé global des projets enregistrés dans le workspace.</div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-slate-400 italic">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-900 shadow">
            <div className="text-lg font-semibold">Total Projets</div>
            <div className="text-3xl font-bold">{total}</div>
          </div>
          {Object.entries(byType).map(([type, count]) => (
            <div key={type} className="p-4 rounded-xl bg-slate-50 text-slate-800 shadow">
              <div className="text-lg font-semibold">{type}</div>
              <div className="text-2xl font-bold">{count}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
