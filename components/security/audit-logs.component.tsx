"use client";

import { useState } from "react";
import { useI18n } from '@/lib/i18n/use-i18n';
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Shield,
  Lock,
  Unlock,
  Settings,
  FileText
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// Mock data for audit logs
const auditLogs = [
  {
    id: 1,
    timestamp: "2025-07-01 10:30:15",
    user: "admin@example.com",
    action: "user_login",
    category: "authentication",
    severity: "info",
    sourceIp: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    resource: "Admin Panel",
    details: "Connexion administrateur réussie",
    status: "success"
  },
  {
    id: 2,
    timestamp: "2025-07-01 10:25:42",
    user: "marie.dubois@example.com",
    action: "access_granted",
    category: "access_control",
    severity: "info",
    sourceIp: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    resource: "Financial Database",
    details: "Accès accordé au système comptable",
    status: "success"
  },
  {
    id: 3,
    timestamp: "2025-07-01 10:20:08",
    user: "unknown",
    action: "failed_login",
    category: "authentication",
    severity: "warning",
    sourceIp: "203.0.113.45",
    userAgent: "curl/7.68.0",
    resource: "Admin Panel",
    details: "Tentative de connexion échouée - utilisateur inexistant",
    status: "failed"
  },
  {
    id: 4,
    timestamp: "2025-07-01 10:15:33",
    user: "system",
    action: "policy_update",
    category: "configuration",
    severity: "info",
    sourceIp: "127.0.0.1",
    userAgent: "Internal System",
    resource: "Security Policy",
    details: "Mise à jour de la politique de mot de passe",
    status: "success"
  },
  {
    id: 5,
    timestamp: "2025-07-01 10:10:18",
    user: "pierre.martin@example.com",
    action: "sensitive_data_access",
    category: "data_access",
    severity: "high",
    sourceIp: "192.168.1.75",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    resource: "HR Database",
    details: "Accès aux données personnelles des employés",
    status: "success"
  },
  {
    id: 6,
    timestamp: "2025-07-01 09:55:27",
    user: "automated_scanner",
    action: "vulnerability_scan",
    category: "security_scan",
    severity: "info",
    sourceIp: "192.168.1.200",
    userAgent: "Security Scanner v2.1",
    resource: "Web Servers",
    details: "Scan de vulnérabilités automatique complété",
    status: "success"
  }
];

const logCategories = [
  { id: "authentication", name: "Authentification", count: 156, icon: <Lock className="h-4 w-4" /> },
  { id: "access_control", name: "Contrôle d'Accès", count: 89, icon: <Shield className="h-4 w-4" /> },
  { id: "data_access", name: "Accès aux Données", count: 234, icon: <FileText className="h-4 w-4" /> },
  { id: "configuration", name: "Configuration", count: 45, icon: <Settings className="h-4 w-4" /> },
  { id: "security_scan", name: "Scans de Sécurité", count: 67, icon: <Activity className="h-4 w-4" /> },
  { id: "system", name: "Système", count: 123, icon: <Server className="h-4 w-4" /> }
];

const auditStats = {
  totalEvents: 2847,
  todaysEvents: 156,
  securityAlerts: 23,
  failedLogins: 12,
  dataAccess: 89,
  systemChanges: 34
};

export default function AuditLogsPageComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { t } = useI18n(dictionary);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: { variant: "destructive" as const, text: "Critique", className: "bg-red-600 text-white" },
      high: { variant: "destructive" as const, text: "Élevé", className: "bg-orange-500 text-white" },
      warning: { variant: "secondary" as const, text: "Attention", className: "bg-yellow-500 text-white" },
      info: { variant: "outline" as const, text: "Info", className: "bg-blue-100 text-blue-800" }
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
      success: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" />, text: "Succès", className: "bg-green-100 text-green-800" },
      failed: { variant: "destructive" as const, icon: <XCircle className="h-3 w-3" />, text: "Échec" },
      pending: { variant: "secondary" as const, icon: <Clock className="h-3 w-3" />, text: "En attente" }
    };
    
    const config = variants[status as keyof typeof variants];
    return (
      <Badge variant={config.variant} className={`flex items-center gap-1  `}>
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const getActionIcon = (action: string) => {
    const icons = {
      user_login: <User className="h-4 w-4 text-blue-500" />,
      user_logout: <User className="h-4 w-4 text-gray-500" />,
      access_granted: <Unlock className="h-4 w-4 text-green-500" />,
      access_denied: <Lock className="h-4 w-4 text-red-500" />,
      failed_login: <XCircle className="h-4 w-4 text-red-500" />,
      policy_update: <Settings className="h-4 w-4 text-blue-500" />,
      sensitive_data_access: <FileText className="h-4 w-4 text-orange-500" />,
      vulnerability_scan: <Activity className="h-4 w-4 text-purple-500" />
    };
    
    return icons[action as keyof typeof icons] || <Activity className="h-4 w-4 text-gray-500" />;
  };

  const formatAction = (action: string) => {
    const actionNames = {
      user_login: "Connexion utilisateur",
      user_logout: "Déconnexion utilisateur",
      access_granted: "Accès accordé",
      access_denied: "Accès refusé",
      failed_login: "Échec de connexion",
      policy_update: "Mise à jour politique",
      sensitive_data_access: "Accès données sensibles",
      vulnerability_scan: "Scan de vulnérabilités"
    };
    
    return actionNames[action as keyof typeof actionNames] || action;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Journalisation et Logs d'Audit
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter Logs
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtres Avancés
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Suivi complet des activités système et des événements de sécurité
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">événements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.todaysEvents}</div>
            <p className="text-xs text-muted-foreground">nouveaux événements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.securityAlerts}</div>
            <p className="text-xs text-muted-foreground">alertes sécurité</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Échecs</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.failedLogins}</div>
            <p className="text-xs text-muted-foreground">connexions échouées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accès Données</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.dataAccess}</div>
            <p className="text-xs text-muted-foreground">accès sensibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Changements</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditStats.systemChanges}</div>
            <p className="text-xs text-muted-foreground">modifications système</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Logs d'Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logs" className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
              <TabsTrigger value="logs" className="flex items-center">
                <ClipboardList className="mr-2 h-4 w-4" />
                Logs d'Événements
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center">
                <Activity className="mr-2 h-4 w-4" />
                Par Catégorie
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="space-y-4">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par utilisateur, action, ou IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="authentication">Authentification</SelectItem>
                    <SelectItem value="access_control">Contrôle d'Accès</SelectItem>
                    <SelectItem value="data_access">Accès aux Données</SelectItem>
                    <SelectItem value="configuration">Configuration</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sévérité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes sévérités</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                    <SelectItem value="high">Élevé</SelectItem>
                    <SelectItem value="warning">Attention</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Audit Logs Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horodatage</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Ressource</TableHead>
                      <TableHead>Sévérité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.user}</div>
                            <div className="text-sm text-gray-500 font-mono">{log.sourceIp}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span>{formatAction(log.action)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.resource}</div>
                            <div className="text-sm text-gray-500">{log.details}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
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

            <TabsContent value="categories" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {logCategories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                      </div>
                      <Badge variant="outline">{category.count}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{category.count}</div>
                      <p className="text-xs text-muted-foreground">événements aujourd'hui</p>
                      <Button variant="ghost" size="sm" className="mt-2 w-full">
                        Voir les détails
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Activité par Heure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">08:00-12:00</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                          </div>
                          <span className="text-sm font-medium">240</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">12:00-16:00</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                          </div>
                          <span className="text-sm font-medium">320</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">16:00-20:00</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                          </div>
                          <span className="text-sm font-medium">160</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">20:00-00:00</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
                          </div>
                          <span className="text-sm font-medium">80</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Utilisateurs Actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">admin@example.com</span>
                        <span className="text-sm font-medium">45 actions</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">marie.dubois@example.com</span>
                        <span className="text-sm font-medium">32 actions</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">pierre.martin@example.com</span>
                        <span className="text-sm font-medium">28 actions</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">system</span>
                        <span className="text-sm font-medium">156 actions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <MobileBottomNav dictionary={dictionary} />
    </div>
  );
}
