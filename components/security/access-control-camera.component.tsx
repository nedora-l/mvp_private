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
  Camera, 
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
  Play,
  Pause,
  RotateCcw,
  HardDrive,
  Zap,
  Monitor,
  VideoIcon,
  Settings,
  MapPin,
  Calendar,
  Activity,
  Database,
  CloudDownload,
  Brain,
  Users,
  TrendingUp,
  Bell,
  Archive,
  Maximize
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// Mock data for cameras
const cameras = [
  {
    id: 1,
    name: "Entrée Principale",
    type: "Fixed IP Camera",
    location: "Rez-de-chaussée - Hall d'entrée",
    status: "online",
    recording: true,
    lastMaintenance: "2025-06-15",
    resolution: "1080p",
    ipAddress: "192.168.1.201",
    storageUsed: 85,
    aiEnabled: true,
    nightVision: true,
    motionDetection: true
  },
  {
    id: 2,
    name: "Parking Extérieur",
    type: "PTZ Camera",
    location: "Extérieur - Parking",
    status: "online",
    recording: true,
    lastMaintenance: "2025-06-20",
    resolution: "4K",
    ipAddress: "192.168.1.202",
    storageUsed: 92,
    aiEnabled: true,
    nightVision: true,
    motionDetection: true
  },
  {
    id: 3,
    name: "Laboratoire IT",
    type: "Dome Camera",
    location: "2ème étage - Laboratoire",
    status: "warning",
    recording: false,
    lastMaintenance: "2025-05-30",
    resolution: "1080p",
    ipAddress: "192.168.1.203",
    storageUsed: 45,
    aiEnabled: false,
    nightVision: false,
    motionDetection: true
  },
  {
    id: 4,
    name: "Salle Serveurs",
    type: "Fixed IP Camera",
    location: "Sous-sol - Salle technique",
    status: "online",
    recording: true,
    lastMaintenance: "2025-06-25",
    resolution: "1080p",
    ipAddress: "192.168.1.204",
    storageUsed: 78,
    aiEnabled: true,
    nightVision: true,
    motionDetection: true
  },
  {
    id: 5,
    name: "Couloir Étage 2",
    type: "Fixed IP Camera",
    location: "2ème étage - Couloir",
    status: "offline",
    recording: false,
    lastMaintenance: "2025-06-10",
    resolution: "720p",
    ipAddress: "192.168.1.205",
    storageUsed: 0,
    aiEnabled: false,
    nightVision: false,
    motionDetection: false
  }
];

// Mock data for live feeds
const liveFeeds = [
  {
    id: 1,
    camera: "Entrée Principale",
    status: "streaming",
    viewers: 2,
    quality: "1080p",
    fps: 30,
    bandwidth: "2.5 Mbps"
  },
  {
    id: 2,
    camera: "Parking Extérieur",
    status: "streaming",
    viewers: 1,
    quality: "4K",
    fps: 25,
    bandwidth: "8.2 Mbps"
  },
  {
    id: 3,
    camera: "Laboratoire IT",
    status: "offline",
    viewers: 0,
    quality: "N/A",
    fps: 0,
    bandwidth: "0 Mbps"
  },
  {
    id: 4,
    camera: "Salle Serveurs",
    status: "streaming",
    viewers: 3,
    quality: "1080p",
    fps: 30,
    bandwidth: "2.8 Mbps"
  }
];

// Mock data for AI insights
const aiInsights = [
  {
    id: 1,
    timestamp: "2025-07-09 09:15:32",
    camera: "Entrée Principale",
    type: "Person Detection",
    confidence: 98.5,
    description: "Personne détectée entrant dans le bâtiment",
    status: "normal",
    peopleCount: 1
  },
  {
    id: 2,
    timestamp: "2025-07-09 09:12:15",
    camera: "Parking Extérieur",
    type: "Vehicle Detection",
    confidence: 95.2,
    description: "Véhicule détecté dans le parking",
    status: "normal",
    vehicleType: "Car"
  },
  {
    id: 3,
    timestamp: "2025-07-09 08:45:22",
    camera: "Salle Serveurs",
    type: "Motion Detection",
    confidence: 87.8,
    description: "Mouvement détecté dans une zone sensible",
    status: "alert",
    alertLevel: "medium"
  },
  {
    id: 4,
    timestamp: "2025-07-09 08:30:45",
    camera: "Entrée Principale",
    type: "Face Recognition",
    confidence: 94.7,
    description: "Employé reconnu: Rachid Taryaoui",
    status: "normal",
    personName: "Rachid Taryaoui"
  },
  {
    id: 5,
    timestamp: "2025-07-09 08:15:12",
    camera: "Parking Extérieur",
    type: "Unusual Activity",
    confidence: 76.3,
    description: "Activité inhabituelle détectée",
    status: "warning",
    alertLevel: "low"
  }
];

// Mock data for storage management
const storageData = [
  {
    id: 1,
    camera: "Entrée Principale",
    dailyUsage: 12.5,
    weeklyUsage: 87.5,
    monthlyUsage: 350,
    retentionDays: 30,
    compressionRatio: 85,
    lastBackup: "2025-07-08 23:30"
  },
  {
    id: 2,
    camera: "Parking Extérieur",
    dailyUsage: 28.2,
    weeklyUsage: 197.4,
    monthlyUsage: 845,
    retentionDays: 60,
    compressionRatio: 78,
    lastBackup: "2025-07-08 23:45"
  },
  {
    id: 3,
    camera: "Laboratoire IT",
    dailyUsage: 0,
    weeklyUsage: 15.3,
    monthlyUsage: 89.7,
    retentionDays: 30,
    compressionRatio: 90,
    lastBackup: "2025-07-07 23:30"
  },
  {
    id: 4,
    camera: "Salle Serveurs",
    dailyUsage: 15.8,
    weeklyUsage: 110.6,
    monthlyUsage: 473,
    retentionDays: 90,
    compressionRatio: 82,
    lastBackup: "2025-07-08 23:15"
  }
];

export default function AccessControlCameraComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { t } = useI18n(dictionary);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cameraFilter, setCameraFilter] = useState("all");
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      online: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" />, text: "En ligne" },
      offline: { variant: "destructive" as const, icon: <XCircle className="h-3 w-3" />, text: "Hors ligne" },
      warning: { variant: "secondary" as const, icon: <AlertTriangle className="h-3 w-3" />, text: "Alerte" },
      streaming: { variant: "default" as const, icon: <Play className="h-3 w-3" />, text: "Diffusion" },
      normal: { variant: "default" as const, icon: <CheckCircle className="h-3 w-3" />, text: "Normal" },
      alert: { variant: "destructive" as const, icon: <AlertTriangle className="h-3 w-3" />, text: "Alerte" }
    };
    
    const config = variants[status as keyof typeof variants];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  const getRecordingBadge = (recording: boolean) => {
    return (
      <Badge variant={recording ? "default" : "secondary"} className="flex items-center gap-1">
        {recording ? <VideoIcon className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        {recording ? "Enregistrement" : "Arrêté"}
      </Badge>
    );
  };

  const getAlertLevelBadge = (level: string) => {
    const variants = {
      low: { variant: "outline" as const, text: "Faible", className: "bg-yellow-100 text-yellow-800" },
      medium: { variant: "secondary" as const, text: "Moyen", className: "bg-orange-100 text-orange-800" },
      high: { variant: "destructive" as const, text: "Élevé", className: "bg-red-100 text-red-800" }
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
            <Camera className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Contrôle d'Accès Caméras
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Caméra
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Surveillance vidéo et gestion des caméras de sécurité avec analyse IA pour D&A Technologies
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caméras Actives</CardTitle>
            <Camera className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4/5</div>
            <p className="text-xs text-muted-foreground">
              1 caméra hors ligne
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enregistrements</CardTitle>
            <VideoIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/5</div>
            <p className="text-xs text-muted-foreground">
              caméras en enregistrement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stockage Utilisé</CardTitle>
            <HardDrive className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2TB</div>
            <p className="text-xs text-muted-foreground">
              sur 5TB disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes IA</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              dans les 24 dernières heures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Gestion des Caméras</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cameras" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
              <TabsTrigger value="cameras" className="flex items-center">
                <Camera className="mr-2 h-4 w-4" />
                Caméras
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center">
                <Monitor className="mr-2 h-4 w-4" />
                Live
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center">
                <HardDrive className="mr-2 h-4 w-4" />
                Stockage
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center">
                <Brain className="mr-2 h-4 w-4" />
                IA Insights
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analyses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cameras" className="space-y-4">
              {/* Cameras Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Caméra</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Enregistrement</TableHead>
                      <TableHead>Résolution</TableHead>
                      <TableHead>Fonctionnalités</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cameras.map((camera) => (
                      <TableRow key={camera.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{camera.name}</div>
                            <div className="text-sm text-gray-500">{camera.ipAddress}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{camera.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{camera.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(camera.status)}</TableCell>
                        <TableCell>{getRecordingBadge(camera.recording)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{camera.resolution}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {camera.aiEnabled && (
                              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800">
                                <Brain className="h-3 w-3 mr-1" />
                                IA
                              </Badge>
                            )}
                            {camera.nightVision && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                Vision nocturne
                              </Badge>
                            )}
                            {camera.motionDetection && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                Détection
                              </Badge>
                            )}
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

            <TabsContent value="live" className="space-y-4">
              {/* Live Feeds Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveFeeds.map((feed) => (
                  <Card key={feed.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{feed.camera}</CardTitle>
                        {getStatusBadge(feed.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Simulated Video Feed */}
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                        {feed.status === "streaming" ? (
                          <div className="text-white text-center">
                            <Camera className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Flux vidéo en direct</p>
                            <p className="text-xs opacity-75">{feed.quality} • {feed.fps} fps</p>
                          </div>
                        ) : (
                          <div className="text-gray-500 text-center">
                            <XCircle className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm">Hors ligne</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-gray-500">Spectateurs: {feed.viewers}</p>
                          <p className="text-gray-500">Bande passante: {feed.bandwidth}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Maximize className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="storage" className="space-y-4">
              {/* Storage Management Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Caméra</TableHead>
                      <TableHead>Utilisation Quotidienne</TableHead>
                      <TableHead>Utilisation Hebdomadaire</TableHead>
                      <TableHead>Utilisation Mensuelle</TableHead>
                      <TableHead>Rétention</TableHead>
                      <TableHead>Compression</TableHead>
                      <TableHead>Dernière Sauvegarde</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storageData.map((storage) => (
                      <TableRow key={storage.id}>
                        <TableCell className="font-medium">{storage.camera}</TableCell>
                        <TableCell>{storage.dailyUsage} GB</TableCell>
                        <TableCell>{storage.weeklyUsage} GB</TableCell>
                        <TableCell>{storage.monthlyUsage} GB</TableCell>
                        <TableCell>
                          <Badge variant="outline">{storage.retentionDays} jours</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${storage.compressionRatio}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{storage.compressionRatio}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CloudDownload className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{storage.lastBackup}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <CloudDownload className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              {/* AI Insights Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horodatage</TableHead>
                      <TableHead>Caméra</TableHead>
                      <TableHead>Type de Détection</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Confiance</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiInsights.map((insight) => (
                      <TableRow key={insight.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{insight.timestamp}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Camera className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{insight.camera}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{insight.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-64 truncate">{insight.description}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${insight.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{insight.confidence}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {insight.status === "alert" ? (
                            <div className="flex items-center gap-2">
                              {getStatusBadge(insight.status)}
                              {insight.alertLevel && getAlertLevelBadge(insight.alertLevel)}
                            </div>
                          ) : (
                            getStatusBadge(insight.status)
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <VideoIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {/* Analytics Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Détection de Mouvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">45</div>
                    <p className="text-sm text-gray-500">détections aujourd'hui</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between">
                        <span>Entrée Principale</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parking</span>
                        <span className="font-medium">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salle Serveurs</span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reconnaissance Faciale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">28</div>
                    <p className="text-sm text-gray-500">personnes reconnues</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between">
                        <span>Employés</span>
                        <span className="font-medium">25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visiteurs</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inconnus</span>
                        <span className="font-medium">1</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Détection de Véhicules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">12</div>
                    <p className="text-sm text-gray-500">véhicules détectés</p>
                    <div className="mt-4 text-sm">
                      <div className="flex justify-between">
                        <span>Voitures</span>
                        <span className="font-medium">10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Camions</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Motos</span>
                        <span className="font-medium">0</span>
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
