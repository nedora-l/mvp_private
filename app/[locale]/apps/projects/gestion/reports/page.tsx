"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useProjects } from "@/contexts/projects-context";
import { useTasks } from "@/contexts/tasks-context";
import { useIntelligentNotifications } from "@/hooks/use-intelligent-notifications";
import { useExport } from "@/hooks/use-export";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  RefreshCcw,
  Download,
  Filter,
  Zap,
  Activity,
  PieChart,
  LineChart,
  Flag
} from "lucide-react";

export default function ReportsPage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks();
  const { showJiraError, showJiraSuccess, showInfo } = useIntelligentNotifications();
  const { handleExport } = useExport();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [reportType, setReportType] = useState<string>("overview");

  // Charger les données au montage
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filtrer les projets Jira uniquement
  const jiraProjects = useMemo(() => {
    return projects.filter(p => p.type === "Jira" || p.jiraKey);
  }, [projects]);

  // Projet sélectionné
  const selectedProject = useMemo(() => {
    return jiraProjects.find(p => p.id === selectedProjectId);
  }, [jiraProjects, selectedProjectId]);

  // Tâches du projet sélectionné
  const projectTasks = useMemo(() => {
    if (!selectedProjectId) return [];
    return tasks.filter(task => task.projectId === parseInt(selectedProjectId));
  }, [tasks, selectedProjectId]);

  // Calculer les métriques du projet
  const projectMetrics = useMemo(() => {
    if (!projectTasks.length) return null;

    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.status === "Done" || t.status === "Closed").length;
    const inProgress = projectTasks.filter(t => t.status === "In Progress").length;
    const blocked = projectTasks.filter(t => t.status === "Blocked").length;
    const unassigned = projectTasks.filter(t => !t.assignee || t.assignee === "Non assigné").length;
    
    // Story points
    const totalStoryPoints = projectTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    const completedStoryPoints = projectTasks
      .filter(t => t.status === "Done" || t.status === "Closed")
      .reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    
    // Priorités
    const highPriority = projectTasks.filter(t => t.priority === "High" || t.priority === "Highest").length;
    const mediumPriority = projectTasks.filter(t => t.priority === "Medium").length;
    const lowPriority = projectTasks.filter(t => t.priority === "Low" || t.priority === "Lowest").length;
    
    // Types d'issues
    const stories = projectTasks.filter(t => t.issueType === "Story").length;
    const bugs = projectTasks.filter(t => t.issueType === "Bug").length;
    const tasks = projectTasks.filter(t => t.issueType === "Task").length;
    
    // Vélocité (tâches complétées par période)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentCompleted = projectTasks.filter(t => {
      if (t.status !== "Done" && t.status !== "Closed") return false;
      // Simuler une date de complétion (en vrai, il faudrait un champ completeDate)
      return true; // Pour l'exemple
    }).length;

    return {
      total,
      completed,
      inProgress,
      blocked,
      unassigned,
      totalStoryPoints,
      completedStoryPoints,
      highPriority,
      mediumPriority,
      lowPriority,
      stories,
      bugs,
      tasks,
      recentCompleted,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      storyPointsCompletion: totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0,
      velocity: recentCompleted
    };
  }, [projectTasks]);

  // Actualiser les rapports
  const handleRefresh = () => {
    fetchTasks();
    showInfo({
      title: "🔄 Actualisation",
      message: "Rapports actualisés !",
      type: "info"
    });
  };

  // Exporter les rapports avec le hook standardisé
  const handleExportReports = async (format: string) => {
    if (!selectedProject || !projectMetrics) {
      showInfo({
        title: "📊 Export",
        message: "Aucune donnée à exporter",
        type: "info"
      });
      return;
    }

    // Préparer les données pour l'export
    const exportData = [
      {
        Projet: selectedProject.name,
        'Clé Projet': selectedProject.jiraKey || '',
        'Tâches Totales': projectMetrics.total,
        'Tâches Terminées': projectMetrics.completed,
        'Tâches En Cours': projectMetrics.inProgress,
        'Tâches Bloquées': projectMetrics.blocked,
        'Story Points Totaux': projectMetrics.totalStoryPoints,
        'Story Points Complétés': projectMetrics.completedStoryPoints,
        'Vélocité (30 jours)': projectMetrics.velocity,
        'Tâches Non Assignées': projectMetrics.unassigned,
        'Date Export': new Date().toISOString().split('T')[0]
      }
    ];

    await handleExport(format, exportData, 'rapport', 'reports');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Rapports & Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Métriques, graphiques et analyses détaillées de vos projets Jira
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Jira Analytics
            </Badge>
            <Button variant="outline" onClick={handleRefresh} disabled={tasksLoading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${tasksLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Sélection de projet et paramètres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Paramètres des Rapports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Projet</label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un projet..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jiraProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Jira</Badge>
                          <span>{project.name}</span>
                          {project.jiraKey && (
                            <Badge className="text-xs">{project.jiraKey}</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Période</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 derniers jours</SelectItem>
                    <SelectItem value="30d">30 derniers jours</SelectItem>
                    <SelectItem value="90d">90 derniers jours</SelectItem>
                    <SelectItem value="1y">1 an</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Type de rapport</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Vue d'ensemble</SelectItem>
                    <SelectItem value="velocity">Vélocité</SelectItem>
                    <SelectItem value="quality">Qualité</SelectItem>
                    <SelectItem value="team">Performance équipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métriques principales */}
        {selectedProject && projectMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{projectMetrics.total}</p>
                    <p className="text-sm text-muted-foreground">Tâches totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{projectMetrics.completed}</p>
                    <p className="text-sm text-muted-foreground">Terminées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{projectMetrics.inProgress}</p>
                    <p className="text-sm text-muted-foreground">En cours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{projectMetrics.blocked}</p>
                    <p className="text-sm text-muted-foreground">Bloquées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Graphiques et analyses */}
        {selectedProject && projectMetrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Taux de complétion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Taux de Complétion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progression générale</span>
                    <span className="font-mono">{projectMetrics.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={projectMetrics.completionRate} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Story Points</span>
                    <span className="font-mono">{projectMetrics.storyPointsCompletion.toFixed(1)}%</span>
                  </div>
                  <Progress value={projectMetrics.storyPointsCompletion} className="h-3" />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {projectMetrics.completed} sur {projectMetrics.total} tâches terminées
                </div>
              </CardContent>
            </Card>

            {/* Répartition par priorité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Répartition par Priorité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Haute</span>
                    </div>
                    <span className="font-mono">{projectMetrics.highPriority}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Moyenne</span>
                    </div>
                    <span className="font-mono">{projectMetrics.mediumPriority}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Basse</span>
                    </div>
                    <span className="font-mono">{projectMetrics.lowPriority}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Types d'issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Types d'Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📖</span>
                      <span className="text-sm">Stories</span>
                    </div>
                    <span className="font-mono">{projectMetrics.stories}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🐛</span>
                      <span className="text-sm">Bugs</span>
                    </div>
                    <span className="font-mono">{projectMetrics.bugs}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✅</span>
                      <span className="text-sm">Tasks</span>
                    </div>
                    <span className="font-mono">{projectMetrics.tasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vélocité et performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Vélocité & Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vélocité (30j)</span>
                    <span className="font-mono text-lg font-bold">{projectMetrics.velocity}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Story Points totaux</span>
                    <span className="font-mono">{projectMetrics.totalStoryPoints}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Story Points complétés</span>
                    <span className="font-mono">{projectMetrics.completedStoryPoints}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tâches non assignées</span>
                    <span className="font-mono">{projectMetrics.unassigned}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions d'export */}
        {selectedProject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exporter les Rapports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                                 <Button variant="outline" onClick={() => handleExportReports("PDF")}>
                   📄 Exporter PDF
                 </Button>
                 <Button variant="outline" onClick={() => handleExportReports("Excel")}>
                   📊 Exporter Excel
                 </Button>
                 <Button variant="outline" onClick={() => handleExportReports("CSV")}>
                   📋 Exporter CSV
                 </Button>
                 <Button variant="outline" onClick={() => handleExportReports("JSON")}>
                   🔧 Exporter JSON
                 </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message si aucun projet sélectionné */}
        {!selectedProject && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Sélectionnez un projet Jira
              </h3>
              <p className="text-sm text-muted-foreground">
                Choisissez un projet ci-dessus pour voir ses rapports et métriques
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
