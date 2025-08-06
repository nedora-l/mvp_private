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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Shield, 
  Bell, 
  Users, 
  FileText, 
  Clock, 
  Lock,
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw
} from "lucide-react";
import { useSession } from "next-auth/react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

// Mock data for security settings
const securityPolicies = {
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90,
    preventReuse: 12
  },
  accountLockout: {
    maxAttempts: 5,
    lockoutDuration: 30,
    resetTime: 60
  },
  sessionManagement: {
    maxSessionTime: 480,
    idleTimeout: 60,
    concurrentSessions: 3
  },
  notifications: {
    failedLogin: true,
    successfulLogin: false,
    passwordExpiry: true,
    suspiciousActivity: true,
    systemChanges: true
  }
};

const complianceSettings = {
  iso27001: {
    enabled: true,
    lastAudit: "2025-03-15",
    nextAudit: "2025-09-15",
    compliance: 88
  },
  gdpr: {
    enabled: true,
    dataRetention: 730,
    consentTracking: true,
    compliance: 92
  },
  logging: {
    auditLevel: "detailed",
    retention: 365,
    encryption: true,
    backup: true
  }
};

export default function SecuritySettingsPageComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { t } = useI18n(dictionary);
  const { data: session } = useSession();
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    // Save logic here
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset logic here
    setHasChanges(false);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-red-600" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Paramètres de Sécurité
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          Configuration des politiques de sécurité et paramètres de conformité
        </p>
        {hasChanges && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">Vous avez des modifications non sauvegardées</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Configuration de Sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 h-auto">
              <TabsTrigger value="password" className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                Mots de Passe
              </TabsTrigger>
              <TabsTrigger value="access" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Contrôle d'Accès
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Conformité
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Politique des Mots de Passe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Longueur minimale</label>
                      <Input 
                        type="number" 
                        defaultValue={securityPolicies.passwordPolicy.minLength}
                        min="8" 
                        max="128"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Âge maximum (jours)</label>
                      <Input 
                        type="number" 
                        defaultValue={securityPolicies.passwordPolicy.maxAge}
                        min="30" 
                        max="365"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Exigences de complexité</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Lettres majuscules requises</label>
                        <Switch 
                          defaultChecked={securityPolicies.passwordPolicy.requireUppercase}
                          onCheckedChange={() => setHasChanges(true)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Lettres minuscules requises</label>
                        <Switch 
                          defaultChecked={securityPolicies.passwordPolicy.requireLowercase}
                          onCheckedChange={() => setHasChanges(true)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Chiffres requis</label>
                        <Switch 
                          defaultChecked={securityPolicies.passwordPolicy.requireNumbers}
                          onCheckedChange={() => setHasChanges(true)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Caractères spéciaux requis</label>
                        <Switch 
                          defaultChecked={securityPolicies.passwordPolicy.requireSpecialChars}
                          onCheckedChange={() => setHasChanges(true)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Historique des mots de passe</label>
                    <Input 
                      type="number" 
                      defaultValue={securityPolicies.passwordPolicy.preventReuse}
                      min="0" 
                      max="24"
                      onChange={() => setHasChanges(true)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nombre de mots de passe précédents à retenir pour éviter la réutilisation
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verrouillage de Compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">Tentatives max</label>
                      <Input 
                        type="number" 
                        defaultValue={securityPolicies.accountLockout.maxAttempts}
                        min="3" 
                        max="10"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Durée verrouillage (min)</label>
                      <Input 
                        type="number" 
                        defaultValue={securityPolicies.accountLockout.lockoutDuration}
                        min="5" 
                        max="1440"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Réinitialisation (min)</label>
                      <Input 
                        type="number" 
                        defaultValue={securityPolicies.accountLockout.resetTime}
                        min="15" 
                        max="1440"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gestion des Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">Durée max session (min)</label>
                      <Input 
                        type="number" 
                        defaultValue={securityPolicies.sessionManagement.maxSessionTime}
                        min="60" 
                        max="1440"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Timeout inactivité (min)</label>
                      <Input 
                        type="number" 
                        defaultValue={securityPolicies.sessionManagement.idleTimeout}
                        min="5" 
                        max="120"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sessions simultanées</label>
                      <Input 
                        type="number" 
                        defaultValue={securityPolicies.sessionManagement.concurrentSessions}
                        min="1" 
                        max="10"
                        onChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contrôles d'Accès</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Authentification à deux facteurs obligatoire</label>
                        <p className="text-xs text-gray-500">Forcer l'utilisation de la 2FA pour tous les utilisateurs</p>
                      </div>
                      <Switch 
                        defaultChecked={true}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Restriction par géolocalisation</label>
                        <p className="text-xs text-gray-500">Bloquer les connexions depuis des pays non autorisés</p>
                      </div>
                      <Switch 
                        defaultChecked={false}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Vérification d'appareil</label>
                        <p className="text-xs text-gray-500">Demander une vérification pour les nouveaux appareils</p>
                      </div>
                      <Switch 
                        defaultChecked={true}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Alertes de Sécurité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Échecs de connexion</label>
                      <Switch 
                        defaultChecked={securityPolicies.notifications.failedLogin}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Connexions réussies</label>
                      <Switch 
                        defaultChecked={securityPolicies.notifications.successfulLogin}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Expiration des mots de passe</label>
                      <Switch 
                        defaultChecked={securityPolicies.notifications.passwordExpiry}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Activité suspecte</label>
                      <Switch 
                        defaultChecked={securityPolicies.notifications.suspiciousActivity}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Changements système</label>
                      <Switch 
                        defaultChecked={securityPolicies.notifications.systemChanges}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuration des Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email des administrateurs</label>
                    <Textarea 
                      placeholder="admin@example.com, security@example.com"
                      className="mt-1"
                      onChange={() => setHasChanges(true)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Séparez les adresses par des virgules
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Niveau de priorité minimum</label>
                    <Select onValueChange={() => setHasChanges(true)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="warning">Attention</SelectItem>
                        <SelectItem value="high">Élevé</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Standards de Conformité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">ISO 27001</h4>
                          <Badge className="bg-green-100 text-green-800">Actif</Badge>
                        </div>
                        <Switch 
                          defaultChecked={complianceSettings.iso27001.enabled}
                          onCheckedChange={() => setHasChanges(true)}
                        />
                      </div>
                      <div className="grid gap-2 md:grid-cols-3 text-sm">
                        <div>
                          <span className="text-gray-600">Dernier audit:</span>
                          <div>{complianceSettings.iso27001.lastAudit}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Prochain audit:</span>
                          <div>{complianceSettings.iso27001.nextAudit}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Conformité:</span>
                          <div>{complianceSettings.iso27001.compliance}%</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">GDPR</h4>
                          <Badge className="bg-green-100 text-green-800">Actif</Badge>
                        </div>
                        <Switch 
                          defaultChecked={complianceSettings.gdpr.enabled}
                          onCheckedChange={() => setHasChanges(true)}
                        />
                      </div>
                      <div className="grid gap-2 md:grid-cols-3 text-sm">
                        <div>
                          <span className="text-gray-600">Rétention des données:</span>
                          <div>{complianceSettings.gdpr.dataRetention} jours</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Suivi du consentement:</span>
                          <div>{complianceSettings.gdpr.consentTracking ? 'Activé' : 'Désactivé'}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Conformité:</span>
                          <div>{complianceSettings.gdpr.compliance}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Journalisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Niveau de détail des logs</label>
                    <Select defaultValue={complianceSettings.logging.auditLevel} onValueChange={() => setHasChanges(true)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="detailed">Détaillé</SelectItem>
                        <SelectItem value="verbose">Verbeux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rétention des logs (jours)</label>
                    <Input 
                      type="number" 
                      defaultValue={complianceSettings.logging.retention}
                      min="30" 
                      max="2555"
                      onChange={() => setHasChanges(true)}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Chiffrement des logs</label>
                      <Switch 
                        defaultChecked={complianceSettings.logging.encryption}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Sauvegarde automatique</label>
                      <Switch 
                        defaultChecked={complianceSettings.logging.backup}
                        onCheckedChange={() => setHasChanges(true)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <MobileBottomNav dictionary={dictionary} />
    </div>
  );
}
