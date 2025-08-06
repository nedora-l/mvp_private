"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";

export default function ProjectsDashboardClient({ params }: BasePageProps ) {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pRes, tRes] = await Promise.all([
          fetch("/api/v0/projects"),
          fetch("/api/v0/tasks")
        ]);
        if (!pRes.ok || !tRes.ok) throw new Error("Erreur lors du chargement");
        const pData = await pRes.json();
        const tData = await tRes.json();
        setProjects(pData.projects || []);
        setTasks(tData.tasks || []);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Statistiques dynamiques
  const activeProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Terminé").length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-slate-400 italic">Chargement...</div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Overview of ongoing projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{activeProjects} Active Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Rate</CardTitle>
            <CardDescription>Track progress of tasks across all projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{completionRate}% Average Completion. {completedTasks} Tasks Completed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation</CardTitle>
            <CardDescription>Manage team member workload and availability.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>—</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
            <CardDescription>Key deadlines and project milestones.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>—</p>
            <a href="#" className="text-sm text-blue-600 hover:underline">View All Milestones</a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Monitor project budgets and spending.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>—</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes in projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>—</p>
            <a href="#" className="text-sm text-blue-600 hover:underline">View Full Activity Log</a>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}
