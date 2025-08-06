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
  Fingerprint, 
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
  Filter,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  DoorClosed,
  DoorOpen,
  User,
  Users,
  Activity,
  Bell,
  Settings,
  MapPin,
  Calendar,
  Zap
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// Mock data for biometric devices
const biometricDevices = [
  {
    id: 1,
    name: "Entrée Principale",
    type: "Fingerprint Scanner",
    location: "Rez-de-chaussée - Hall d'entrée",
    status: "online",
    batteryLevel: 85,
    lastSync: "2025-07-09 09:15",
    enrolledUsers: 45,
    dailyAccess: 156,
    model: "SecureTech ST-4000",
    ipAddress: "192.168.1.101"
  },
  {
    id: 2,
    name: "Laboratoire IT",
    type: "Face Recognition",
    location: "2ème étage - Laboratoire",
    status: "online",
    batteryLevel: 92,
    lastSync: "2025-07-09 09:12",
    enrolledUsers: 12,
    dailyAccess: 28,
    model: "FaceGuard FG-200",
    ipAddress: "192.168.1.102"
  },
  {
    id: 3,
    name: "Salle Serveurs",
    type: "Dual Biometric",
    location: "Sous-sol - Salle technique",
    status: "warning",
    batteryLevel: 23,
    lastSync: "2025-07-09 08:45",
    enrolledUsers: 8,
    dailyAccess: 12,
    model: "SecureTech ST-8000",
    ipAddress: "192.168.1.103"
  },
  {
    id: 4,
    name: "Bureau Direction",
    type: "Fingerprint Scanner",
    location: "3ème étage - Direction",
    status: "offline",
    batteryLevel: 0,
    lastSync: "2025-07-08 17:30",
    enrolledUsers: 5,
    dailyAccess: 8,
    model: "SecureTech ST-4000",
    ipAddress: "192.168.1.104"
  }
];

// Mock data for access logs
const accessLogs = [
  {
    id: 1,
    user: "Rachid Taryaoui",
    email: "rachid.taryaoui@da-tech.ma",
    device: "Entrée Principale",
    timestamp: "2025-07-09 09:15:32",
    status: "success",
    method: "Fingerprint",
    location: "Rez-de-chaussée - Hall d'entrée",
    confidence: 98.5
  },
  {
    id: 2,
    user: "Driss Lahrichi",
    email: "driss.lahrichi@da-tech.ma",
    device: "Laboratoire IT",
    timestamp: "2025-07-09 09:12:15",
    status: "success",
    method: "Face Recognition",
    location: "2ème étage - Laboratoire",
    confidence: 94.2
  },
  {
    id: 3,
    user: "Utilisateur Inconnu",
    email: "unknown@unknown.com",
    device: "Salle Serveurs",
    timestamp: "2025-07-09 08:45:22",
    status: "failed",
    method: "Fingerprint",
    location: "Sous-sol - Salle technique",
    confidence: 45.8
  },
  {
    id: 4,
    user: "Khalid Benlyazid",
    email: "khalid.benlyazid@da-tech.ma",
    device: "Entrée Principale",
    timestamp: "2025-07-09 08:30:45",
    status: "success",
    method: "Fingerprint",
    location: "Rez-de-chaussée - Hall d'entrée",
    confidence: 96.7
  },
  {
    id: 5,
    user: "DA Houssam Miri",
    email: "houssam.miri@da-tech.ma",
    device: "Laboratoire IT",
    timestamp: "2025-07-09 08:15:12",
    status: "success",
    method: "Face Recognition",
    location: "2ème étage - Laboratoire",
    confidence: 92.1
  }
];

// Mock data for enrolled users
const enrolledUsers = [
  {
    id: 1,
    user: "Admin D&A Technologies",
    email: "cloudexpertise.ma@gmail.com",
    department: "Exécutif",
    biometricTypes: ["Fingerprint", "Face Recognition"],
    enrollmentDate: "2025-01-15",
    lastUsed: "2025-07-09 09:00",
    status: "active",
    accessLevel: "full"
  },
  {
    id: 2,
    user: "Rachid Taryaoui",
    email: "rachid.taryaoui@da-tech.ma",
    department: "Security Admin",
    biometricTypes: ["Fingerprint", "Face Recognition"],
    enrollmentDate: "2025-01-20",
    lastUsed: "2025-07-09 09:15",
    status: "active",
    accessLevel: "admin"
  },
  {
    id: 3,
    user: "Driss Lahrichi",
    email: "driss.lahrichi@da-tech.ma",
    department: "Finances",
    biometricTypes: ["Fingerprint"],
    enrollmentDate: "2025-02-01",
    lastUsed: "2025-07-09 09:12",
    status: "active",
    accessLevel: "standard"
  },
  {
    id: 4,
    user: "Khalid Benlyazid",
    email: "khalid.benlyazid@da-tech.ma",
    department: "Marketing",
    biometricTypes: ["Fingerprint"],
    enrollmentDate: "2025-02-10",
    lastUsed: "2025-07-09 08:30",
    status: "active",
    accessLevel: "standard"
  },
  {
    id: 5,
    user: "DA Houssam Miri",
    email: "houssam.miri@da-tech.ma",
    department: "IT",
    biometricTypes: ["Face Recognition"],
    enrollmentDate: "2025-02-15",
    lastUsed: "2025-07-09 08:15",
    status: "active",
    accessLevel: "standard"
  }
];

// Mock data for access points
const accessPoints = [
  {
    id: 1,
    name: "Entrée Principale",
    location: "Rez-de-chaussée - Hall d'entrée",
    type: "Main Entry",
    status: "active",
    schedule: "24/7",
    restrictionLevel: "standard",
    connectedDevices: 1,
    dailyAccess: 156,
    monthlyAccess: 3420
  },
  {
    id: 2,
    name: "Laboratoire IT",
    location: "2ème étage - Laboratoire",
    type: "Restricted Area",
    status: "active",
    schedule: "08:00-18:00",
    restrictionLevel: "high",
    connectedDevices: 1,
    dailyAccess: 28,
    monthlyAccess: 650
  },
  {
    id: 3,
    name: "Salle Serveurs",
    location: "Sous-sol - Salle technique",
    type: "Critical Area",
    status: "maintenance",
    schedule: "24/7",
    restrictionLevel: "critical",
    connectedDevices: 1,
    dailyAccess: 12,
    monthlyAccess: 180
  },
  {
    id: 4,
    name: "Bureau Direction",
    location: "3ème étage - Direction",
    type: "Executive Area",
    status: "offline",
    schedule: "08:00-20:00",
    restrictionLevel: "high",
    connectedDevices: 1,
    dailyAccess: 8,
    monthlyAccess: 120
  }
];

export default function AccessControlBiometricComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { t } = useI18n(dictionary);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    const variants = {
      success: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" />, text: "Réussi" },
      failed: { variant: "destructive" as const, icon: <XCircle className="h-3 w-3" />, text: "Échec" },
      online: { variant: "default" as const, icon: <Wifi className="h-3 w-3" />, text: "En ligne" },
      offline: { variant: "destructive" as const, icon: <WifiOff className="h-3 w-3" />, text: "Hors ligne" },
      warning: { variant: "secondary" as const, icon: <AlertTriangle className="h-3 w-3" />, text: "Alerte" },
      active: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" />, text: "Actif" },
      maintenance: { variant: "secondary" as const, icon: <Settings className="h-3 w-3" />, text: "Maintenance" }
    };
    
    const config = variants[status as keyof typeof variants];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const getBatteryIcon = (level: number) => {
    if (level <= 20) return <BatteryLow className="h-4 w-4 text-red-500" />;
    return <Battery className="h-4 w-4 text-green-500" />;
  };

  const getAccessLevelBadge = (level: string) => {
    const variants = {
      full: { variant: "default" as const, text: "Complet", className: "bg-green-100 text-green-800" },
      admin: { variant: "secondary" as const, text: "Admin", className: "bg-blue-100 text-blue-800" },
      standard: { variant: "outline" as const, text: "Standard", className: "bg-gray-100 text-gray-800" }
    };
    
    const config = variants[level as keyof typeof variants];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getRestrictionLevelBadge = (level: string) => {
    const variants = {
      standard: { variant: "outline" as const, text: "Standard", className: "bg-gray-100 text-gray-800" },
      high: { variant: "secondary" as const, text: "Élevé", className: "bg-yellow-100 text-yellow-800" },
      critical: { variant: "destructive" as const, text: "Critique", className: "bg-red-100 text-red-800" }
    };
    
    const config = variants[level as keyof typeof variants];
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
            <Fingerprint className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Contrôle d'Accès Biométrique
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Utilisateur
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Rapport
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Surveillance et gestion des systèmes d'accès biométrique pour la sécurité des bureaux D&A Technologies
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appareils Actifs</CardTitle>
            <Fingerprint className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/4</div>
            <p className="text-xs text-muted-foreground">
              1 appareil en maintenance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Inscrits</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +2 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accès Aujourd'hui</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">204</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport à hier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentatives Échouées</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              dans les 24 dernières heures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Gestion Biométrique</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="devices" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="devices" className="flex items-center">
                <Fingerprint className="mr-2 h-4 w-4" />
                Appareils
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center">
                <Activity className="mr-2 h-4 w-4" />
                Journaux d'Accès
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="access-points" className="flex items-center">
                <DoorClosed className="mr-2 h-4 w-4" />
                Points d'Accès
              </TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="space-y-4">
              {/* Devices Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Appareil</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Batterie</TableHead>
                      <TableHead>Utilisateurs</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {biometricDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-sm text-gray-500">{device.model}</div>
                            <div className="text-xs text-gray-400">{device.ipAddress}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{device.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{device.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(device.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getBatteryIcon(device.batteryLevel)}
                            <span className="text-sm">{device.batteryLevel}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{device.enrolledUsers} inscrits</div>
                            <div className="text-gray-500">{device.dailyAccess} accès/jour</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom d'utilisateur..."
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
                    <SelectItem value="success">Réussi</SelectItem>
                    <SelectItem value="failed">Échec</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrer par appareil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les appareils</SelectItem>
                    <SelectItem value="entrance">Entrée Principale</SelectItem>
                    <SelectItem value="lab">Laboratoire IT</SelectItem>
                    <SelectItem value="server">Salle Serveurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Access Logs Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Appareil</TableHead>
                      <TableHead>Horodatage</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Confiance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.user}</div>
                            <div className="text-sm text-gray-500">{log.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.device}</div>
                            <div className="text-sm text-gray-500">{log.location}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{log.timestamp}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.method}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {log.confidence}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
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
              {/* Enrolled Users Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Types Biométriques</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Dernier Accès</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledUsers.map((user) => (
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
                            {user.biometricTypes.map((type, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{user.enrollmentDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{user.lastUsed}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getAccessLevelBadge(user.accessLevel)}</TableCell>
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

            <TabsContent value="access-points" className="space-y-4">
              {/* Access Points Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Point d'Accès</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Horaires</TableHead>
                      <TableHead>Restriction</TableHead>
                      <TableHead>Accès</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessPoints.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DoorOpen className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{point.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{point.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{point.type}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(point.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{point.schedule}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getRestrictionLevelBadge(point.restrictionLevel)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{point.dailyAccess}/jour</div>
                            <div className="text-gray-500">{point.monthlyAccess}/mois</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
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
