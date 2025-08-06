"use client";

import { useState } from "react";
import { useI18n } from '@/lib/i18n/use-i18n';
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  FileText, 
  Activity, 
  TrendingUp,
  RefreshCcw,
  Bot,
  Lock,
  Siren,
  ScanSearch,
  ClipboardList,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import GeminiLiveChat from "@/components/chat/GeminiLiveChat";

// Mock data for security metrics
const securityMetrics = {
  accessControl: {
    activeUsers: 350,
    totalRoles: 50,
    pendingRequests: 10,
    lastReview: "2025-06-15"
  },
  threats: {
    activeThreats: 5,
    resolvedToday: 12,
    criticalAlerts: 2,
    threatLevel: "Medium"
  },
  vulnerabilities: {
    critical: 15,
    high: 30,
    medium: 45,
    low: 120,
    patchedThisWeek: 5
  },
  compliance: {
    overall: 85,
    iso27001: 88,
    gdpr: 92,
    soc2: 78
  },
  incidents: {
    openIncidents: 3,
    resolvedThisMonth: 24,
    avgResolutionTime: "4.2h",
    lastIncident: "2025-06-28"
  }
};

const recentActivity = [
  { id: 1, type: "access", message: "Nouvel accès accordé à Marie Dubois (Finance)", time: "Il y a 5 min", severity: "info" },
  { id: 2, type: "threat", message: "Tentative de phishing détectée et bloquée", time: "Il y a 15 min", severity: "warning" },
  { id: 3, type: "policy", message: "Politique de mots de passe mise à jour", time: "Il y a 1h", severity: "success" },
  { id: 4, type: "vulnerability", message: "Vulnérabilité critique corrigée sur serveur-web-01", time: "Il y a 2h", severity: "success" },
  { id: 5, type: "audit", message: "Audit de sécurité programmé pour demain", time: "Il y a 3h", severity: "info" }
];

const upcomingTasks = [
  { id: 1, task: "Revue des accès trimestrielle", due: "2025-07-05", priority: "high" },
  { id: 2, task: "Formation sécurité équipe Marketing", due: "2025-07-08", priority: "medium" },
  { id: 3, task: "Audit interne ISO 27001", due: "2025-07-15", priority: "high" },
  { id: 4, task: "Mise à jour politique BYOD", due: "2025-07-20", priority: "low" }
];

export default function SecurityDashboardComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { t } = useI18n(dictionary);
  const { data: session } = useSession();
  const currentUser = session?.user || null;
  const [showChat, setShowChat] = useState(false);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Eye className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline"
    } as const;
    
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-4 p-2">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 md:mb-0">
            <Shield className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Tableau de Bord Sécurité
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-red-700 border-red-200">
              Responsable Sécurité SI
            </Badge>
            <Button variant="ghost" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-gray-600 flex items-center gap-2">
          <span>Bonjour 👋 {currentUser?.name || "RSSI"}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm px-2 py-1 rounded-full bg-red-100 text-red-700">
            Gestion de la sécurité de l'information
          </span>
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contrôle d'Accès</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.accessControl.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              utilisateurs actifs, {securityMetrics.accessControl.pendingRequests} demandes en attente
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menaces Actives</CardTitle>
            <Siren className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.threats.activeThreats}</div>
            <p className="text-xs text-muted-foreground">
              {securityMetrics.threats.resolvedToday} résolues aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnérabilités</CardTitle>
            <ScanSearch className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.vulnerabilities.critical}</div>
            <p className="text-xs text-muted-foreground">
              critiques, {securityMetrics.vulnerabilities.patchedThisWeek} corrigées cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.compliance.overall}%</div>
            <p className="text-xs text-muted-foreground">
              conformité globale (ISO 27001, GDPR)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                Vue d'ensemble Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="activity" className="space-y-4">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-auto">
                  <TabsTrigger value="activity" className="flex items-center">
                    <Activity className="mr-2 h-4 w-4" />
                    Activité Récente
                  </TabsTrigger>
                  <TabsTrigger value="threats" className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Menaces
                  </TabsTrigger>
                  <TabsTrigger value="compliance" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Conformité
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                        {getSeverityIcon(activity.severity)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="threats" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Niveau de Menace Actuel</h4>
                        <Badge variant="secondary">{securityMetrics.threats.threatLevel}</Badge>
                      </div>
                      <Progress value={60} className="mb-2" />
                      <p className="text-sm text-gray-600">
                        {securityMetrics.threats.criticalAlerts} alertes critiques nécessitent une attention immédiate
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Actions Recommandées</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Vérifier les logs des systèmes critiques</li>
                        <li>• Mettre à jour les signatures antivirus</li>
                        <li>• Sensibiliser les équipes au phishing</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">ISO 27001</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={securityMetrics.compliance.iso27001} className="w-20" />
                          <span className="text-sm">{securityMetrics.compliance.iso27001}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">GDPR</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={securityMetrics.compliance.gdpr} className="w-20" />
                          <span className="text-sm">{securityMetrics.compliance.gdpr}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">SOC 2</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={securityMetrics.compliance.soc2} className="w-20" />
                          <span className="text-sm">{securityMetrics.compliance.soc2}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="mr-2 h-4 w-4" />
                Gestion des Accès
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="mr-2 h-4 w-4" />
                Signaler un Incident
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Politiques Sécurité
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="mr-2 h-4 w-4" />
                Logs d'Audit
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tâches à Venir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                    <p className="text-xs text-gray-500">Échéance: {task.due}</p>
                  </div>
                  <div className="ml-2">
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed FAB for Chat */}
      <Button 
        variant="secondary"
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Chat Component - Conditionally Rendered */}
      {showChat && (
        <div className="fixed bottom-0 right-6 z-40">
          <GeminiLiveChat />
        </div>
      )}
      
      <MobileBottomNav dictionary={dictionary} />
    </div>
  );
}
