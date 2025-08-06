"use client"

import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { Dictionary } from "@/locales/dictionary"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { hasStoredToken, UserProfile } from "@/lib/services"
import { getCurrentUser } from "@/lib/api/auth-api"
import { useSettings } from "@/contexts/settings-context"
import { useI18n } from "@/lib/i18n/use-i18n"

       
export function SettingsNotifications({ 
  dictionary, 
  locale 
}: { 
  dictionary: Dictionary
  locale: string 
}) {


  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const { settings, updateSettings, updateNotificationSettings, updatePrivacySettings } = useSettings()
  const { t } = useI18n(dictionary);

  // Check if user is authenticated
  useEffect(() => {
    setIsAuthenticated(hasStoredToken());
  }, []);
  
  const fetchCurrentProfile = async () => {
    if (!isAuthenticated) {
      setError("Authentication required. Please log in to view the directory.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching current profile from API...");
      const results = await getCurrentUser() ;
      console.log("results ",results);
      if (results) {
        setCurrentProfile(results);
      } else {
        setError("No profile data found");
      }
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      if (err.message.includes("401")) {
        setError("Authentication failed. Please log in again to view the directory.");
      } else {
        setError(err.message || "Failed to fetch employee data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!isAuthenticated) {
      setError("Authentication required. Please log in to view the directory.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log("Saving current profile to API...");
      
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      if (err.message.includes("401")) {
        setError("Authentication failed. Please log in again to view the directory.");
      } else {
        setError(err.message || "Failed to fetch employee data");
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchCurrentProfile();
  }, [isAuthenticated]);



  const handleFormChange = (e :React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      console.log("name", name);
      console.log("value", value);
      //setCurrentProfile((prev) => prev ? { ...prev, [name]: value } : null)
  }

  const handleFormEvent = (event: React.FormEventHandler<HTMLButtonElement>) =>   {
      console.log("event", event);
      //setCurrentProfile((prev) => prev ? { ...prev, [name]: value } : null)
  }

  const handleSaveNotifications = () => {
    updateNotificationSettings(settings.notifications)
   // toast.success("Notification settings saved successfully")
  }

  return (
     <Card>
        <CardHeader>
          <CardTitle>{t('settings.notifications.title') || "Notification Settings"}</CardTitle>
          <CardDescription>{t('settings.notifications.description') || "Manage how you receive notifications"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('settings.notifications.channels.label') || "Notification Channels"}</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email-notifications" checked={settings.notifications.email} onCheckedChange={(checked) => updateSettings({ notifications: { ...settings.notifications, email: !!checked } })} />
                  <Label htmlFor="email-notifications">{t('settings.notifications.channels.email') || "Email Notifications"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="push-notifications" checked={settings.notifications.push} onCheckedChange={(checked) => updateSettings({ notifications: { ...settings.notifications, push: !!checked } })} />
                  <Label htmlFor="push-notifications">{t('settings.notifications.channels.push') || "Push Notifications"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms-notifications" checked={settings.notifications.sms} onCheckedChange={(checked) => updateSettings({ notifications: { ...settings.notifications, sms: !!checked } })} />
                  <Label htmlFor="sms-notifications">{t('settings.notifications.channels.sms') || "SMS Notifications"}</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.notifications.types.label') || "Notification Types"}</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="new-features" checked={settings.notifications.newFeatures} onCheckedChange={(checked) => updateSettings({ notifications: { ...settings.notifications, newFeatures: !!checked } })} />
                  <Label htmlFor="new-features">{t('settings.notifications.types.newFeatures') || "New Features and Updates"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="marketing" checked={settings.notifications.marketing} onCheckedChange={(checked) => updateSettings({ notifications: { ...settings.notifications, marketing: !!checked } })} />
                  <Label htmlFor="marketing">{t('settings.notifications.types.marketing') || "Marketing and Promotions"}</Label>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-frequency">{t('settings.notifications.frequency.label') || "Notification Frequency"}</Label>
            <Select
              value={settings.notifications.frequency}
              onValueChange={(value) => updateSettings({ notifications: { ...settings.notifications, frequency: value as "real-time" | "daily" | "weekly" } })}
            >
              <SelectTrigger id="notification-frequency">
                <SelectValue placeholder={t('settings.notifications.frequency.placeholder') || "Select frequency"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real-time">{t('settings.notifications.frequency.realTime') || "Real-time"}</SelectItem>
                <SelectItem value="daily">{t('settings.notifications.frequency.dailyDigest') || "Daily Digest"}</SelectItem>
                <SelectItem value="weekly">{t('settings.notifications.frequency.weeklySummary') || "Weekly Summary"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiet-hours-start">{t('settings.notifications.quietHours.label') || "Quiet Hours"}</Label>
            <div className="flex items-center space-x-2">
              <Input id="quiet-hours-start" type="time" value={settings.notifications.quietHoursStart} onChange={(e) => updateSettings({ notifications: { ...settings.notifications, quietHoursStart: e.target.value } })} />
              <Input id="quiet-hours-end" type="time" value={settings.notifications.quietHoursEnd} onChange={(e) => updateSettings({ notifications: { ...settings.notifications, quietHoursEnd: e.target.value } })} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNotifications}>{t('settings.notifications.saveButton') || "Save Notification Settings"}</Button>
        </CardFooter>
      </Card>
  )
}
