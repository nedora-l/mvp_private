"use client";

import { useState } from "react";
import { useI18n } from '@/lib/i18n/use-i18n';
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Siren, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Eye, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Zap,
  Globe,
  Server,
  Mail,
  Download,
  Filter
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// Mock data for threat detection
const threatAlerts = [
  {
    id: 1,
    type: "malware",
    severity: "critical",
    source: "Endpoint Protection",
    target: "DESKTOP-001",
    description: "Malware détecté: Trojan.Generic.KD.45628934",
    timestamp: "2025-07-01 10:30:00",
    status: "active",
    actions: ["Quarantaine", "Analyse approfondie"]
  },
  {
    id: 2,
    type: "phishing",
    severity: "high",
    source: "Email Security",
    target: "marie.dubois@example.com",
    description: "Tentative de phishing détectée dans email reçu",
    timestamp: "2025-07-01 09:15:00",
    status: "blocked",
    actions: ["Email bloqué", "Utilisateur notifié"]
  },
  {
    id: 3,
    type: "intrusion",
    severity: "medium",
    source: "Network Monitor",
    target: "192.168.1.50",
    description: "Tentative d'accès non autorisé au serveur",
    timestamp: "2025-07-01 08:45:00",
    status: "investigating",
    actions: ["Analyse logs", "Renforcement firewall"]
  },
  {
    id: 4,
    type: "data_exfiltration",
    severity: "high",
    source: "DLP System",
    target: "Serveur-DB-01",
    description: "Tentative d'exfiltration de données sensibles",
    timestamp: "2025-06-30 23:20:00",
    status: "resolved",
    actions: ["Accès bloqué", "Audit complet"]
  }
];

const threatMetrics = {
  totalThreats: 45,
  activeThreats: 5,
  resolvedToday: 12,
  criticalAlerts: 2,
  threatLevel: "Medium",
  detectionRate: 98.5,
  averageResponseTime: "4.2min"
};

const threatTrends = [
  { category: "Malware", thisWeek: 15, lastWeek: 8, trend: "up" },
  { category: "Phishing", thisWeek: 22, lastWeek: 18, trend: "up" },
  { category: "Intrusion", thisWeek: 5, lastWeek: 12, trend: "down" },
  { category: "DDoS", thisWeek: 2, lastWeek: 4, trend: "down" },
  { category: "Data Breach", thisWeek: 1, lastWeek: 3, trend: "down" }
];

const systemHealth = [
  { system: "Antivirus/Anti-malware", status: "operational", uptime: "99.8%", lastUpdate: "2025-07-01 06:00" },
  { system: "Firewall", status: "operational", uptime: "100%", lastUpdate: "2025-06-30 22:00" },
  { system: "IDS/IPS", status: "warning", uptime: "97.2%", lastUpdate: "2025-07-01 08:30" },
  { system: "Email Security", status: "operational", uptime: "99.9%", lastUpdate: "2025-07-01 05:45" },
  { system: "Network Monitor", status: "operational", uptime: "99.5%", lastUpdate: "2025-07-01 07:15" }
];

export default function ThreatDetectionPageComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { t } = useI18n(dictionary);
  const { data: session } = useSession();
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: { variant: "destructive" as const, text: "Critique", className: "bg-red-600 text-white" },
      high: { variant: "destructive" as const, text: "Élevé", className: "bg-orange-500 text-white" },
      medium: { variant: "secondary" as const, text: "Moyen", className: "bg-yellow-500 text-white" },
      low: { variant: "outline" as const, text: "Faible", className: "bg-green-100 text-green-800" }
    };
    
    const config = variants[severity as keyof typeof variants];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "destructive" as const, icon: <Siren className="h-3 w-3" />, text: "Actif" },
      blocked: { variant: "secondary" as const, icon: <Shield className="h-3 w-3" />, text: "Bloqué" },
      investigating: { variant: "secondary" as const, icon: <Eye className="h-3 w-3" />, text: "Enquête" },
      resolved: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" />, text: "Résolu" }
    };
    
    const config = variants[status as keyof typeof variants];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const getSystemStatusBadge = (status: string) => {
    const variants = {
      operational: { variant: "default" as const, text: "Opérationnel", className: "bg-green-100 text-green-800" },
      warning: { variant: "secondary" as const, text: "Attention", className: "bg-yellow-100 text-yellow-800" },
      error: { variant: "destructive" as const, text: "Erreur", className: "bg-red-100 text-red-800" }
    };
    
    const config = variants[status as keyof typeof variants];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getThreatIcon = (type: string) => {
    const icons = {
      malware: <Zap className="h-4 w-4 text-red-500" />,
      phishing: <Mail className="h-4 w-4 text-orange-500" />,
      intrusion: <Server className="h-4 w-4 text-blue-500" />,
      data_exfiltration: <Globe className="h-4 w-4 text-purple-500" />
    };
    
    return icons[type as keyof typeof icons] || <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Siren className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Détection et Gestion des Menaces
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Rapport
            </Button>
            <Button>
              <Target className="mr-2 h-4 w-4" />
              Nouvelle Alerte
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Surveillance en temps réel des menaces de sécurité et gestion des incidents
        </p>
      </div>

      {/* Threat Level Indicator */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Niveau de Menace Actuel</CardTitle>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {threatMetrics.threatLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{threatMetrics.activeThreats}</div>
              <p className="text-sm text-gray-600">Menaces Actives</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{threatMetrics.detectionRate}%</div>
              <p className="text-sm text-gray-600">Taux de Détection</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{threatMetrics.averageResponseTime}</div>
              <p className="text-sm text-gray-600">Temps de Réponse Moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Menaces</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threatMetrics.totalThreats}</div>
            <p className="text-xs text-muted-foreground">
              ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Critiques</CardTitle>
            <Siren className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threatMetrics.criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">
              nécessitent une action immédiate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolues Aujourd'hui</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threatMetrics.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              +8 depuis hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systèmes Surveillés</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              tous opérationnels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Surveillance des Menaces</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="alerts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
              <TabsTrigger value="alerts" className="flex items-center">
                <Siren className="mr-2 h-4 w-4" />
                Alertes Actives
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Tendances
              </TabsTrigger>
              <TabsTrigger value="systems" className="flex items-center">
                <Server className="mr-2 h-4 w-4" />
                État des Systèmes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              {/* Alerts Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type & Description</TableHead>
                      <TableHead>Cible</TableHead>
                      <TableHead>Sévérité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Horodatage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {threatAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            {getThreatIcon(alert.type)}
                            <div>
                              <div className="font-medium">{alert.description}</div>
                              <div className="text-sm text-gray-500">Source: {alert.source}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{alert.target}</TableCell>
                        <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                        <TableCell>{getStatusBadge(alert.status)}</TableCell>
                        <TableCell className="text-sm">{alert.timestamp}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid gap-4">
                <h4 className="font-medium">Évolution des Menaces (7 derniers jours)</h4>
                {threatTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{trend.category}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        Cette semaine: <span className="font-medium">{trend.thisWeek}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Semaine dernière: <span className="font-medium">{trend.lastWeek}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {trend.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                        )}
                        <span className={`text-sm ${trend.trend === "up" ? "text-red-500" : "text-green-500"}`}>
                          {Math.abs(trend.thisWeek - trend.lastWeek)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="systems" className="space-y-4">
              {/* System Health Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Système de Sécurité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Disponibilité</TableHead>
                      <TableHead>Dernière MAJ</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemHealth.map((system, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{system.system}</TableCell>
                        <TableCell>{getSystemStatusBadge(system.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={parseFloat(system.uptime)} className="w-20" />
                            <span className="text-sm">{system.uptime}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{system.lastUpdate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <MobileBottomNav dictionary={dictionary} />
    </div>
  );
}
