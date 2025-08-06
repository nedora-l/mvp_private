"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Dictionary } from "@/locales/dictionary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Database, 
  Mail, 
  Shield, 
  Bell,
  Palette,
  Globe,
  Server,
  Key,
  Monitor
} from "lucide-react"

interface AdminSettingsProps {
  dictionary: Dictionary
  locale: string
}

export function AdminSettingsComponent({ dictionary, locale }: AdminSettingsProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic system configuration and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input id="systemName" defaultValue="DAWS Admin Portal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemUrl">System URL</Label>
                  <Input id="systemUrl" defaultValue="https://daws.company.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systemDescription">System Description</Label>
                <Textarea 
                  id="systemDescription" 
                  defaultValue="Enterprise administration portal for managing users, workflows, and system objects."
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Input id="timezone" defaultValue="UTC+00:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input id="dateFormat" defaultValue="YYYY-MM-DD" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="maintenanceMode" />
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <Badge variant="outline">Currently Disabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Authentication, authorization, and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="480" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="twoFactorAuth" defaultChecked />
                  <Label htmlFor="twoFactorAuth">Require Two-Factor Authentication</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="passwordComplexity" defaultChecked />
                  <Label htmlFor="passwordComplexity">Enforce Password Complexity</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="loginLogging" defaultChecked />
                  <Label htmlFor="loginLogging">Log All Login Attempts</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="ipWhitelist" />
                  <Label htmlFor="ipWhitelist">Enable IP Whitelist</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedIps">Allowed IP Addresses (one per line)</Label>
                <Textarea 
                  id="allowedIps" 
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpServer">SMTP Server</Label>
                  <Input id="smtpServer" defaultValue="smtp.company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" type="number" defaultValue="587" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input id="smtpUsername" defaultValue="notifications@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email Address</Label>
                  <Input id="fromEmail" defaultValue="noreply@company.com" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="userRegistration" defaultChecked />
                    <Label htmlFor="userRegistration">User Registration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="workflowFailures" defaultChecked />
                    <Label htmlFor="workflowFailures">Workflow Failures</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="systemAlerts" defaultChecked />
                    <Label htmlFor="systemAlerts">System Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="securityNotifications" defaultChecked />
                    <Label htmlFor="securityNotifications">Security Notifications</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmails">Admin Email Recipients (comma separated)</Label>
                <Input id="adminEmails" defaultValue="admin@company.com, security@company.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Settings
              </CardTitle>
              <CardDescription>
                Database configuration and maintenance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dbHost">Database Host</Label>
                  <Input id="dbHost" defaultValue="db.company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbPort">Database Port</Label>
                  <Input id="dbPort" type="number" defaultValue="5432" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dbName">Database Name</Label>
                  <Input id="dbName" defaultValue="daws_production" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxConnections">Max Connections</Label>
                  <Input id="maxConnections" type="number" defaultValue="100" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Backup Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="autoBackup" defaultChecked />
                    <Label htmlFor="autoBackup">Automatic Daily Backups</Label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="backupTime">Backup Time</Label>
                      <Input id="backupTime" type="time" defaultValue="02:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retentionDays">Retention (days)</Label>
                      <Input id="retentionDays" type="number" defaultValue="30" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Test Connection</Button>
                <Button variant="outline">Run Backup Now</Button>
                <Button variant="outline">Optimize Database</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                External Integrations
              </CardTitle>
              <CardDescription>
                Configure connections to external services and APIs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">OAuth Providers</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="googleClientId">Google Client ID</Label>
                    <Input id="googleClientId" defaultValue="••••••••••••••••" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="googleClientSecret">Google Client Secret</Label>
                    <Input id="googleClientSecret" defaultValue="••••••••••••••••" type="password" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">API Keys</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="stripeKey">Stripe API Key</Label>
                    <Input id="stripeKey" defaultValue="sk_••••••••••••••••" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twilioSid">Twilio Account SID</Label>
                    <Input id="twilioSid" defaultValue="AC••••••••••••••••" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="awsAccessKey">AWS Access Key</Label>
                    <Input id="awsAccessKey" defaultValue="AKIA••••••••••••••••" type="password" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Webhook URLs</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="slackWebhook">Slack Webhook</Label>
                    <Input id="slackWebhook" defaultValue="https://hooks.slack.com/services/..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discordWebhook">Discord Webhook</Label>
                    <Input id="discordWebhook" placeholder="https://discord.com/api/webhooks/..." />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Branding
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the admin portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input id="primaryColor" type="color" defaultValue="#0066cc" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input id="secondaryColor" type="color" defaultValue="#6c757d" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input id="logoUrl" defaultValue="/logo/company-logo.svg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input id="faviconUrl" defaultValue="/favicon.ico" />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Theme Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="darkModeDefault" />
                    <Label htmlFor="darkModeDefault">Default to Dark Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="allowThemeToggle" defaultChecked />
                    <Label htmlFor="allowThemeToggle">Allow Theme Toggle</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS</Label>
                <Textarea 
                  id="customCSS" 
                  placeholder="/* Add custom CSS styles here */"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Actions */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
