"use client"

import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { Dictionary } from "@/locales/dictionary"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { hasStoredToken, UserProfile } from "@/lib/services"
import { getCurrentUser } from "@/lib/api/auth-api"
import { Switch } from "../ui/switch"
import { Laptop, Smartphone, Tablet } from "lucide-react"
import { Slider } from "../ui/slider"
import { useSettings } from "@/contexts/settings-context"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useI18n } from "@/lib/i18n/use-i18n";
       
export function SettingsPrivacy({ 
  dictionary, 
  locale 
}: { 
  dictionary: Dictionary
  locale: string 
}) {
  const { t } = useI18n(dictionary);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const { settings, updateSettings, updateNotificationSettings, updatePrivacySettings } = useSettings()

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
      const { name, value } = e.target
      setCurrentProfile((prev) => prev ? { ...prev, [name]: value } : null)
  }


  const handleSavePrivacy = () => {
    updatePrivacySettings(settings.privacy)
    //toast.success(t('privacy.saveSuccess') || "Privacy settings saved successfully")
  }

  return (
    <Card>
            <CardHeader>
              <CardTitle>{t('privacy.title') || "Privacy Settings"}</CardTitle>
              <CardDescription>{t('privacy.description') || "Manage your privacy and data settings"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('privacy.dataSharing.title') || "Data Sharing"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics-sharing">{t('privacy.dataSharing.analytics') || "Share analytics data"}</Label>
                      <Switch
                        id="analytics-sharing"
                        checked={settings.privacy.analyticsSharing}
                      
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="personalized-ads">{t('privacy.dataSharing.personalizedAds') || "Allow personalized ads"}</Label>
                      <Switch
                        id="personalized-ads"
                        checked={settings.privacy.personalizedAds}
                      
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('privacy.accountVisibility.title') || "Account Visibility"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={settings.privacy.visibility} >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="visibility-public" />
                        <Label htmlFor="visibility-public">{t('privacy.accountVisibility.public') || "Public"}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="visibility-private" />
                        <Label htmlFor="visibility-private">{t('privacy.accountVisibility.private') || "Private"}</Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('privacy.dataRetention.title') || "Data Retention"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={settings.privacy.dataRetention}
                    >
                      <SelectTrigger id="data-retention">
                        <SelectValue placeholder={t('privacy.dataRetention.placeholder') || "Select Data Retention Period"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6-months">{t('privacy.dataRetention.6months') || "6 Months"}</SelectItem>
                        <SelectItem value="1-year">{t('privacy.dataRetention.1year') || "1 Year"}</SelectItem>
                        <SelectItem value="2-years">{t('privacy.dataRetention.2years') || "2 Years"}</SelectItem>
                        <SelectItem value="indefinite">{t('privacy.dataRetention.indefinite') || "Indefinite"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('privacy.thirdPartyIntegrations.title') || "Third-Party Integrations"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t('privacy.thirdPartyIntegrations.connected') || "Connected: Google Analytics, Facebook Pixel"}</p>
                    <Button variant="outline">{t('privacy.thirdPartyIntegrations.manage') || "Manage Integrations"}</Button>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-between">
                <Button variant="outline">{t('privacy.downloadData') || "Download Your Data"}</Button>
                <Button variant="destructive">{t('privacy.deleteAccount') || "Delete My Account"}</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePrivacy}>{t('privacy.saveButton') || "Save Privacy Settings"}</Button>
            </CardFooter>
          </Card>
  )
}
