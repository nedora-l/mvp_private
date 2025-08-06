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
import { Progress } from "@/components/ui/progress";
import { 
  Lock, 
  Search, 
  Plus, 
  Eye, 
  EyeOff,
  Copy,
  Edit3,
  Trash2,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  Key,
  Globe,
  Smartphone,
  Server,
  Download,
  Upload
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// Mock data for password manager
const savedPasswords = [
  {
    id: 1,
    site: "Office 365",
    url: "https://portal.office.com",
    username: "marie.dubois@example.com",
    password: "Sup3rS3cur3P@ssw0rd!",
    category: "work",
    strength: "strong",
    lastUsed: "2025-07-01",
    created: "2025-01-15",
    notes: "Compte principal Office 365"
  },
  {
    id: 2,
    site: "GitHub Enterprise",
    url: "https://github.company.com",
    username: "m.dubois",
    password: "D3v3l0p3r@2025!",
    category: "work",
    strength: "strong",
    lastUsed: "2025-06-30",
    created: "2025-02-01",
    notes: "Compte développeur"
  },
  {
    id: 3,
    site: "VPN Corporate",
    url: "vpn.company.com",
    username: "marie.dubois",
    password: "V3ryS3cur3VPN!",
    category: "infrastructure",
    strength: "strong",
    lastUsed: "2025-07-01",
    created: "2025-01-10",
    notes: "Accès VPN principal"
  },
  {
    id: 4,
    site: "Admin Panel",
    url: "https://admin.company.com",
    username: "admin_marie",
    password: "weakpass123",
    category: "admin",
    strength: "weak",
    lastUsed: "2025-06-25",
    created: "2024-12-01",
    notes: "URGENT: Mot de passe à changer"
  },
  {
    id: 5,
    site: "Database Server",
    url: "db.internal.com:5432",
    username: "db_admin",
    password: "M0d3r@t3P@ss",
    category: "infrastructure",
    strength: "medium",
    lastUsed: "2025-06-28",
    created: "2025-03-01",
    notes: "Accès base de données production"
  }
];

const passwordStats = {
  totalPasswords: 156,
  strongPasswords: 124,
  weakPasswords: 18,
  duplicatePasswords: 14,
  reusedPasswords: 23,
  averageStrength: 85
};

const securityChecks = [
  {
    category: "Mots de passe faibles",
    count: 18,
    severity: "high",
    description: "Mots de passe ne respectant pas la politique de sécurité"
  },
  {
    category: "Mots de passe dupliqués",
    count: 14,
    severity: "medium",
    description: "Même mot de passe utilisé sur plusieurs sites"
  },
  {
    category: "Mots de passe anciens",
    count: 31,
    severity: "medium",
    description: "Mots de passe non changés depuis plus de 90 jours"
  },
  {
    category: "Sites compromis",
    count: 3,
    severity: "critical",
    description: "Sites ayant subi une violation de données récente"
  }
];

export default function PasswordManagerPageComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { t } = useI18n(dictionary);
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [strengthFilter, setStrengthFilter] = useState("all");
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});

  const getStrengthBadge = (strength: string) => {
    const variants = {
      strong: { variant: "default" as const, text: "Fort", className: "bg-green-100 text-green-800" },
      medium: { variant: "secondary" as const, text: "Moyen", className: "bg-yellow-100 text-yellow-800" },
      weak: { variant: "destructive" as const, text: "Faible", className: "bg-red-100 text-red-800" }
    };
    
    const config = variants[strength as keyof typeof variants];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

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

  const getCategoryIcon = (category: string) => {
    const icons = {
      work: <Smartphone className="h-4 w-4 text-blue-500" />,
      infrastructure: <Server className="h-4 w-4 text-purple-500" />,
      admin: <Shield className="h-4 w-4 text-red-500" />,
      personal: <Globe className="h-4 w-4 text-green-500" />
    };
    
    return icons[category as keyof typeof icons] || <Globe className="h-4 w-4 text-gray-500" />;
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You would typically show a toast notification here
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Gestionnaire de Mots de Passe
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importer
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Mot de Passe
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Gestion sécurisée des mots de passe et surveillance de la sécurité des comptes
        </p>
      </div>

      {/* Security Overview */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Score de Sécurité Global</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{passwordStats.averageStrength}%</span>
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={passwordStats.averageStrength} className="mb-4" />
          <div className="grid gap-4 md:grid-cols-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{passwordStats.strongPasswords}</div>
              <p className="text-sm text-gray-600">Mots de passe forts</p>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">{passwordStats.weakPasswords}</div>
              <p className="text-sm text-gray-600">Mots de passe faibles</p>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{passwordStats.duplicatePasswords}</div>
              <p className="text-sm text-gray-600">Mots de passe dupliqués</p>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{passwordStats.totalPasswords}</div>
              <p className="text-sm text-gray-600">Total des mots de passe</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Coffre-fort des Mots de Passe</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="passwords" className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
              <TabsTrigger value="passwords" className="flex items-center">
                <Key className="mr-2 h-4 w-4" />
                Mots de Passe
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Audit Sécurité
              </TabsTrigger>
              <TabsTrigger value="generator" className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Générateur
              </TabsTrigger>
            </TabsList>

            <TabsContent value="passwords" className="space-y-4">
              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par site, nom d'utilisateur..."
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
                    <SelectItem value="work">Travail</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                    <SelectItem value="personal">Personnel</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={strengthFilter} onValueChange={setStrengthFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Force" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes forces</SelectItem>
                    <SelectItem value="strong">Fort</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="weak">Faible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Passwords Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site / Service</TableHead>
                      <TableHead>Identifiants</TableHead>
                      <TableHead>Mot de Passe</TableHead>
                      <TableHead>Force</TableHead>
                      <TableHead>Dernière Utilisation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedPasswords.map((password) => (
                      <TableRow key={password.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(password.category)}
                            <div>
                              <div className="font-medium">{password.site}</div>
                              <div className="text-sm text-gray-500">{password.url}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm">{password.username}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {showPasswords[password.id] ? password.password : '••••••••••••'}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePasswordVisibility(password.id)}
                            >
                              {showPasswords[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(password.password)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{getStrengthBadge(password.strength)}</TableCell>
                        <TableCell className="text-sm">{password.lastUsed}</TableCell>
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

            <TabsContent value="security" className="space-y-4">
              <div className="grid gap-4">
                <h4 className="font-medium text-lg">Audit de Sécurité des Mots de Passe</h4>
                {securityChecks.map((check, index) => (
                  <Card key={index} className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          <CardTitle className="text-base">{check.category}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(check.severity)}
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {check.count}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600">{check.description}</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Corriger maintenant
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="generator" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Générateur de Mots de Passe</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Longueur du mot de passe</label>
                      <Input type="number" defaultValue="16" min="8" max="128" className="mt-1" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Options</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Lettres majuscules (A-Z)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Lettres minuscules (a-z)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Chiffres (0-9)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Symboles (!@#$%^&*)</span>
                        </label>
                      </div>
                    </div>
                    <Button className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Générer un Nouveau Mot de Passe
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mot de Passe Généré</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <code className="font-mono text-lg break-all">
                        {generatePassword()}
                      </code>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Force du mot de passe</span>
                        <Badge className="bg-green-100 text-green-800">Très Fort</Badge>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Copy className="mr-2 h-4 w-4" />
                        Copier
                      </Button>
                      <Button className="flex-1">
                        <Plus className="mr-2 h-4 w-4" />
                        Sauvegarder
                      </Button>
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
