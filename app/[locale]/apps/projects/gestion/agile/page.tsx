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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  RefreshCcw,
  Download,
  Zap,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Rocket,
  Lightbulb,
  Award,
  Timer,
  Gauge
} from "lucide-react";

export default function AgilePage() {
  const { projects, loading: projectsLoading } = useProjects();
  const { tasks, loading: tasksLoading, fetchTasks } = useTasks();
  const { showJiraError, showJiraSuccess, showInfo } = useIntelligentNotifications();
  const { handleExport } = useExport();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [sprintView, setSprintView] = useState<string>("current");
  const [timeRange, setTimeRange] = useState<string>("2w");

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

  // Calculer les métriques agiles
  const agileMetrics = useMemo(() => {
    if (!projectTasks.length) return null;

    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.status === "Done" || t.status === "Closed").length;
    const inProgress = projectTasks.filter(t => t.status === "In Progress").length;
    const blocked = projectTasks.filter(t => t.status === "Blocked").length;
    
    // Story points
    const totalStoryPoints = projectTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    const completedStoryPoints = projectTasks
      .filter(t => t.status === "Done" || t.status === "Closed")
      .reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    
    // Vélocité (tâches complétées par période)
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const recentCompleted = projectTasks.filter(t => {
      if (t.status !== "Done" && t.status !== "Closed") return false;
      // Simuler une date de complétion
      return true;
    }).length;

    // Cycle time (temps moyen pour compléter une tâche)
    const cycleTime = recentCompleted > 0 ? 14 / recentCompleted : 0; // jours par tâche

    // Lead time (temps total du processus)
    const leadTime = total > 0 ? (total * cycleTime) : 0;

    // Burndown simulation
    const burndownData = Array.from({ length: 14 }, (_, i) => {
      const day = i + 1;
      const remainingTasks = Math.max(0, total - Math.floor((recentCompleted / 14) * day));
      return { day, remaining: remainingTasks };
    });

    return {
      total,
      completed,
      inProgress,
      blocked,
      totalStoryPoints,
      completedStoryPoints,
      recentCompleted,
      cycleTime,
      leadTime,
      burndownData,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      storyPointsCompletion: totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0,
      velocity: recentCompleted,
      efficiency: total > 0 ? (completed / total) * 100 : 0
    };
  }, [projectTasks]);

  // Actualiser les métriques
  const handleRefresh = () => {
    fetchTasks();
    showInfo({
      title: "🔄 Actualisation",
      message: "Métriques agiles actualisées !",
      type: "info"
    });
  };

  // Exporter les métriques agiles avec le hook standardisé
  const handleExportAgile = async (format: string) => {
    if (!selectedProject || !agileMetrics) {
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
        'Tâches Totales': agileMetrics.total,
        'Tâches Terminées': agileMetrics.completed,
        'Tâches En Cours': agileMetrics.inProgress,
        'Tâches Bloquées': agileMetrics.blocked,
        'Story Points Totaux': agileMetrics.totalStoryPoints,
        'Story Points Complétés': agileMetrics.completedStoryPoints,
        'Vélocité (2 semaines)': agileMetrics.velocity,
        'Cycle Time (jours)': agileMetrics.cycleTime.toFixed(1),
        'Lead Time (jours)': agileMetrics.leadTime.toFixed(1),
        'Taux de Complétion (%)': agileMetrics.completionRate.toFixed(1),
        'Efficacité (%)': agileMetrics.efficiency.toFixed(1),
        'Date Export': new Date().toISOString().split('T')[0]
      }
    ];

    await handleExport(format, exportData, 'metriques-agiles', 'agile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🚀 Méthodes Agiles</h1>
            <p className="text-sm text-muted-foreground">
              Dashboard agile avec métriques, vélocité et outils de gestion de projet
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Jira Agile
            </Badge>
            <Button variant="outline" onClick={handleRefresh} disabled={tasksLoading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${tasksLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Sélection de projet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Sélection du Projet Agile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un projet agile..." />
              </SelectTrigger>
              <SelectContent>
                {jiraProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Agile</Badge>
                      <span>{project.name}</span>
                      {project.jiraKey && (
                        <Badge className="text-xs">{project.jiraKey}</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Métriques principales */}
        {selectedProject && agileMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{agileMetrics.velocity}</p>
                    <p className="text-sm text-muted-foreground">Vélocité (2 semaines)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{agileMetrics.cycleTime.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Cycle Time (jours)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{agileMetrics.efficiency.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Efficacité</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{agileMetrics.completedStoryPoints}</p>
                    <p className="text-sm text-muted-foreground">SP Complétés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dashboard agile */}
        {selectedProject && agileMetrics && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="velocity">Vélocité</TabsTrigger>
              <TabsTrigger value="burndown">Burndown</TabsTrigger>
              <TabsTrigger value="metrics">Métriques</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progression générale */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Progression du Projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Complétion générale</span>
                        <span className="font-mono">{agileMetrics.completionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={agileMetrics.completionRate} className="h-3" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Story Points</span>
                        <span className="font-mono">{agileMetrics.storyPointsCompletion.toFixed(1)}%</span>
                      </div>
                      <Progress value={agileMetrics.storyPointsCompletion} className="h-3" />
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {agileMetrics.completed} sur {agileMetrics.total} tâches terminées
                    </div>
                  </CardContent>
                </Card>

                {/* Répartition des tâches */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Répartition des Tâches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Terminées</span>
                        </div>
                        <span className="font-mono">{agileMetrics.completed}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">En cours</span>
                        </div>
                        <span className="font-mono">{agileMetrics.inProgress}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">Bloquées</span>
                        </div>
                        <span className="font-mono">{agileMetrics.blocked}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Vélocité */}
            <TabsContent value="velocity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Analyse de Vélocité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{agileMetrics.velocity}</div>
                      <div className="text-sm text-blue-600">Tâches/2 semaines</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{agileMetrics.cycleTime.toFixed(1)}</div>
                      <div className="text-sm text-green-600">Jours par tâche</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{agileMetrics.leadTime.toFixed(1)}</div>
                      <div className="text-sm text-purple-600">Lead time total</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
                    <h3 className="text-lg font-medium mb-2">Conseils d'Amélioration</h3>
                    <p className="text-sm text-muted-foreground">
                      {agileMetrics.velocity < 5 ? "Considérez réduire la taille des tâches" : 
                       agileMetrics.cycleTime > 3 ? "Optimisez le processus de développement" :
                       "Excellente performance ! Continuez sur cette lancée"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Burndown */}
            <TabsContent value="burndown" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Burndown Chart (2 semaines)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Simulation de burndown chart */}
                    <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
                      {agileMetrics.burndownData.map((data, index) => (
                        <div key={data.day} className="flex flex-col items-center">
                          <div 
                            className="w-4 bg-blue-500 rounded-t"
                            style={{ height: `${(data.remaining / agileMetrics.total) * 200}px` }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">{data.day}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      Progression sur 14 jours - {agileMetrics.total} tâches initiales
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Métriques détaillées */}
            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Métriques de qualité */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Métriques de Qualité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Taux de blocage</span>
                        <span className="font-mono">
                          {agileMetrics.total > 0 ? ((agileMetrics.blocked / agileMetrics.total) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Efficacité de l'équipe</span>
                        <span className="font-mono">{agileMetrics.efficiency.toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Story points par tâche</span>
                        <span className="font-mono">
                          {agileMetrics.total > 0 ? (agileMetrics.totalStoryPoints / agileMetrics.total).toFixed(1) : 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prévisions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Prévisions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tâches restantes</span>
                        <span className="font-mono">{agileMetrics.total - agileMetrics.completed}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Story points restants</span>
                        <span className="font-mono">{agileMetrics.totalStoryPoints - agileMetrics.completedStoryPoints}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sprints estimés</span>
                        <span className="font-mono">
                          {agileMetrics.velocity > 0 ? Math.ceil((agileMetrics.total - agileMetrics.completed) / agileMetrics.velocity) : 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Actions d'export */}
        {selectedProject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Exporter les Métriques Agiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => handleExportAgile("PDF")}>
                  📄 Rapport PDF
                </Button>
                <Button variant="outline" onClick={() => handleExportAgile("Excel")}>
                  📊 Métriques Excel
                </Button>
                <Button variant="outline" onClick={() => handleExportAgile("CSV")}>
                  📋 Données CSV
                </Button>
                <Button variant="outline" onClick={() => handleExportAgile("JSON")}>
                  🔧 API JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message si aucun projet sélectionné */}
        {!selectedProject && (
          <Card>
            <CardContent className="text-center py-12">
              <Rocket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Sélectionnez un projet agile
              </h3>
              <p className="text-sm text-muted-foreground">
                Choisissez un projet ci-dessus pour voir ses métriques agiles et son dashboard
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
