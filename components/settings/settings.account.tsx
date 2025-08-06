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
import { useI18n } from "@/lib/i18n/use-i18n";

       
export function SettingsAccount({ 
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

  const { t } = useI18n(dictionary);


  const handleFormChange = (e :React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setCurrentProfile((prev) => prev ? { ...prev, [name]: value } : null)
  }


  return (
    <Card>
        <CardHeader>
          <CardTitle>{t('settings.account.title') || "Account Settings"}</CardTitle>
          <CardDescription>{t('settings.account.description') || "Manage your account information"}</CardDescription>
        </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="first-name">Firstname</Label>
          <Input
            id="first-name"
            value={currentProfile?.firstName || ""}
            onChange={handleFormChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            value={currentProfile?.lastName || ""}
            onChange={handleFormChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={currentProfile?.email || ""}
            onChange={handleFormChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={currentProfile?.phone || ""}
            onChange={handleFormChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={currentProfile?.timeZone || ""} onValueChange={(value) => setCurrentProfile((prev) => prev ? { ...prev, timeZone: value } : null)}>
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select Timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc-12">International Date Line West (UTC-12)</SelectItem>
              <SelectItem value="utc-11">Samoa Standard Time (UTC-11)</SelectItem>
              <SelectItem value="utc-10">Hawaii-Aleutian Standard Time (UTC-10)</SelectItem>
              <SelectItem value="utc-9">Alaska Standard Time (UTC-9)</SelectItem>
              <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
              <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
              <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
              <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
              <SelectItem value="utc-4">Atlantic Time (UTC-4)</SelectItem>
              <SelectItem value="utc-3">Argentina Standard Time (UTC-3)</SelectItem>
              <SelectItem value="utc-2">South Georgia Time (UTC-2)</SelectItem>
              <SelectItem value="utc-1">Azores Time (UTC-1)</SelectItem>
              <SelectItem value="utc+0">Greenwich Mean Time (UTC+0)</SelectItem>
              <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
              <SelectItem value="utc+2">Eastern European Time (UTC+2)</SelectItem>
              <SelectItem value="utc+3">Moscow Time (UTC+3)</SelectItem>
              <SelectItem value="utc+4">Gulf Standard Time (UTC+4)</SelectItem>
              <SelectItem value="utc+5">Pakistan Standard Time (UTC+5)</SelectItem>
              <SelectItem value="utc+5.5">Indian Standard Time (UTC+5:30)</SelectItem>
              <SelectItem value="utc+6">Bangladesh Standard Time (UTC+6)</SelectItem>
              <SelectItem value="utc+7">Indochina Time (UTC+7)</SelectItem>
              <SelectItem value="utc+8">China Standard Time (UTC+8)</SelectItem>
              <SelectItem value="utc+9">Japan Standard Time (UTC+9)</SelectItem>
              <SelectItem value="utc+10">Australian Eastern Standard Time (UTC+10)</SelectItem>
              <SelectItem value="utc+11">Solomon Islands Time (UTC+11)</SelectItem>
              <SelectItem value="utc+12">New Zealand Standard Time (UTC+12)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveProfile} disabled={isLoading}>Save Account Settings</Button>
      </CardFooter>
    </Card>
  )
}
