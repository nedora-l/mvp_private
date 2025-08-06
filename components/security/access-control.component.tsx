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
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Shield, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Filter
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// Mock data for access control
const accessRequests = [
  {
    id: 1,
    user: "Sarah Mamdouh",
    email: "sarah.mamdouh@da-tech.ma",
    department: "Marketing",
    requestedAccess: "Système Comptable",
    requestDate: "2025-06-30",
    status: "pending",
    priority: "medium",
    requestedBy: "Driss Lahrichi",
    justification: "Nouvelle embauche - besoin d'accès pour ses fonctions"
  },
  {
    id: 2,
    user: "DA Hamza Chaoui",
    email: "chaoui.hamza2@gmail.com",
    department: "IT",
    requestedAccess: "Serveurs de Production",
    requestDate: "2025-06-29",
    status: "approved",
    priority: "high",
    requestedBy: "Khalid Benlyazid",
    justification: "Maintenance urgente des serveurs"
  },
  {
    id: 3,
    user: "Abdessamad Azzouzi",
    email: "abdessamad.azzouzi@da-tech.ma",
    department: "Ressources Humaines",
    requestedAccess: "Base de données employés",
    requestDate: "2025-06-28",
    status: "rejected",
    priority: "low",
    requestedBy: "Abir Aboufiras",
    justification: "Accès non justifié pour le poste"
  }
];

const userRoles = [
  {
    id: 1,
    user: "Admin D&A Technologies",
    email: "cloudexpertise.ma@gmail.com",
    department: "Exécutif",
    roles: ["ROLE_ADMIN", "ADMIN", "ROLE_USER"],
    lastAccess: "2025-07-01 09:30",
    status: "active"
  },
  {
    id: 2,
    user: "Rachid Taryaoui",
    email: "rachid.taryaoui@da-tech.ma",
    department: "Security Admin",
    roles: ["ROLE_USER", "Security Admin"],
    lastAccess: "2025-07-01 08:45",
    status: "active"
  },
  {
    id: 3,
    user: "Driss Lahrichi",
    email: "driss.lahrichi@da-tech.ma",
    department: "Finances",
    roles: ["ROLE_ADMIN", "ROLE_USER", "FULLSTACK"],
    lastAccess: "2025-06-30 17:20",
    status: "active"
  },
  {
    id: 4,
    user: "Khalid Benlyazid",
    email: "khalid.benlyazid@da-tech.ma",
    department: "Marketing",
    roles: ["ROLE_ADMIN", "ROLE_USER", "Stagiaire Security"],
    lastAccess: "2025-06-30 16:45",
    status: "active"
  },
  {
    id: 5,
    user: "DA Houssam Miri",
    email: "houssam.miri@da-tech.ma",
    department: "IT",
    roles: ["ROLE_USER"],
    lastAccess: "2025-06-29 14:30",
    status: "active"
  },
  {
    id: 6,
    user: "Ahmed Reda Tamri",
    email: "ahmedredatamri@gmail.com",
    department: "Stagiaire",
    roles: ["ROLE_USER"],
    lastAccess: "2025-06-28 11:15",
    status: "inactive"
  }
];

const systemAccess = [
  {
    system: "ERP Financier",
    totalUsers: 25,
    activeUsers: 22,
    lastReview: "2025-06-15",
    nextReview: "2025-09-15",
    riskLevel: "low"
  },
  {
    system: "Serveurs de Production",
    totalUsers: 12,
    activeUsers: 10,
    lastReview: "2025-06-01",
    nextReview: "2025-09-01",
    riskLevel: "high"
  },
  {
    system: "Base de Données RH",
    totalUsers: 8,
    activeUsers: 7,
    lastReview: "2025-05-30",
    nextReview: "2025-08-30",
    riskLevel: "medium"
  },
  {
    system: "Système de Gestion de Projets",
    totalUsers: 45,
    activeUsers: 42,
    lastReview: "2025-06-10",
    nextReview: "2025-09-10",
    riskLevel: "low"
  },
  {
    system: "Système de Sécurité",
    totalUsers: 5,
    activeUsers: 4,
    lastReview: "2025-06-20",
    nextReview: "2025-09-20",
    riskLevel: "high"
  }
];

export default function AccessControlPageComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { t } = useI18n(dictionary);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: <Clock className="h-3 w-3" />, text: "En attente" },
      approved: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" />, text: "Approuvé" },
      rejected: { variant: "destructive" as const, icon: <XCircle className="h-3 w-3" />, text: "Rejeté" },
      active: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" />, text: "Actif" },
      inactive: { variant: "secondary" as const, icon: <XCircle className="h-3 w-3" />, text: "Inactif" }
    };
    
    const config = variants[status as keyof typeof variants];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const getRiskLevelBadge = (riskLevel: string) => {
    const variants = {
      low: { variant: "default" as const, text: "Faible", className: "bg-green-100 text-green-800" },
      medium: { variant: "secondary" as const, text: "Moyen", className: "bg-yellow-100 text-yellow-800" },
      high: { variant: "destructive" as const, text: "Élevé", className: "bg-red-100 text-red-800" }
    };
    
    const config = variants[riskLevel as keyof typeof variants];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Contrôle d'Accès & Gestion des Identités
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Demande
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Gestion centralisée des droits d'accès, des rôles utilisateurs et des revues périodiques d'accès
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes en Attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">350</div>
            <p className="text-xs text-muted-foreground">
              sur 365 comptes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Systèmes Critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              nécessitent une revue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              des accès conformes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Gestion des Accès</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
              <TabsTrigger value="requests" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Demandes d'Accès
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Utilisateurs & Rôles
              </TabsTrigger>
              <TabsTrigger value="systems" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Accès par Système
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-4">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email, ou système..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Requests Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Accès Demandé</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.user}</div>
                            <div className="text-sm text-gray-500">{request.email}</div>
                            <div className="text-xs text-gray-400">{request.department}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.requestedAccess}</div>
                            <div className="text-sm text-gray-500">Demandé par: {request.requestedBy}</div>
                          </div>
                        </TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            request.priority === 'high' ? 'destructive' : 
                            request.priority === 'medium' ? 'secondary' : 'outline'
                          }>
                            {request.priority === 'high' ? 'Haute' : 
                             request.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              {/* Users and Roles Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Rôles</TableHead>
                      <TableHead>Dernier Accès</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.user}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{user.lastAccess}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="systems" className="space-y-4">
              {/* Systems Access Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Système</TableHead>
                      <TableHead>Utilisateurs</TableHead>
                      <TableHead>Dernière Revue</TableHead>
                      <TableHead>Prochaine Revue</TableHead>
                      <TableHead>Niveau de Risque</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemAccess.map((system, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{system.system}</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{system.activeUsers}</span> / {system.totalUsers}
                            <div className="text-sm text-gray-500">actifs</div>
                          </div>
                        </TableCell>
                        <TableCell>{system.lastReview}</TableCell>
                        <TableCell>{system.nextReview}</TableCell>
                        <TableCell>{getRiskLevelBadge(system.riskLevel)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
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
