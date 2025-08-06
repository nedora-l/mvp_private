"use client"

import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { Dictionary } from "@/locales/dictionary"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" 
import { Slider } from "@/components/ui/slider"
import { hasStoredToken, UserProfile } from "@/lib/services"
import { getCurrentUser } from "@/lib/api/auth-api"
import { useI18n } from "@/lib/i18n/use-i18n"

       
export function SettingsPreferences({ 
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
      const { name, value } = e.target
      setCurrentProfile((prev) => prev ? { ...prev, [name]: value } : null)
  }


  return (
    <Card>
            <CardHeader>
              <CardTitle>{t('settings.preferences.title') || "Preferences"}</CardTitle>
              <CardDescription>{t('settings.preferences.description') || "Customize your dashboard experience"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('settings.preferences.language.label') || "Language"}</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t('settings.preferences.language.placeholder') || "Select language"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t('settings.preferences.language.en') || "English"}</SelectItem>
                      <SelectItem value="fr">{t('settings.preferences.language.fr') || "French"}</SelectItem>
                      <SelectItem value="ar">{t('settings.preferences.language.ar') || "Arabic"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('settings.preferences.currency.label') || "Currency"}</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder={t('settings.preferences.currency.placeholder') || "Select currency"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">{t('settings.preferences.currency.usd') || "USD"}</SelectItem>
                      <SelectItem value="eur">{t('settings.preferences.currency.eur') || "EUR"}</SelectItem>
                      <SelectItem value="mad">{t('settings.preferences.currency.mad') || "MAD"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">{t('settings.preferences.dateFormat.label') || "Date Format"}</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder={t('settings.preferences.dateFormat.placeholder') || "Select date format"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">{t('settings.preferences.dateFormat.mmddyyyy') || "MM/DD/YYYY"}</SelectItem>
                      <SelectItem value="dd-mm-yyyy">{t('settings.preferences.dateFormat.ddmmyyyy') || "DD/MM/YYYY"}</SelectItem>
                      <SelectItem value="yyyy-mm-dd">{t('settings.preferences.dateFormat.yyyymmdd') || "YYYY/MM/DD"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font-size">{t('settings.preferences.fontSize.label') || "Font Size"}</Label>
                  <Slider defaultValue={[16]} max={24} min={12} step={1} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.preferences.theme.label') || "Theme"}</Label>
                <RadioGroup defaultValue="system">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">{t('settings.preferences.theme.light') || "Light"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">{t('settings.preferences.theme.dark') || "Dark"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">{t('settings.preferences.theme.system') || "System"}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>{t('settings.preferences.dashboardLayout.label') || "Dashboard Layout"}</Label>
                <RadioGroup defaultValue="default">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="layout-default" />
                    <Label htmlFor="layout-default">{t('settings.preferences.dashboardLayout.default') || "Default"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="layout-compact" />
                    <Label htmlFor="layout-compact">{t('settings.preferences.dashboardLayout.compact') || "Compact"}</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button>{t('settings.preferences.saveButton') || "Save Preferences"}</Button>
            </CardFooter>
          </Card>
  )
}
