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
import { useI18n } from "@/lib/i18n/use-i18n";

       
export function SettingsSecurity({ 
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
    <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('security.title') || "Security Settings"}</CardTitle>
                <CardDescription>{t('security.description') || "Manage your account's security settings"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t('security.currentPassword') || "Current Password"}</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('security.newPassword') || "New Password"}</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('security.confirmNewPassword') || "Confirm New Password"}</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="two-factor" />
                  <Label htmlFor="two-factor">{t('security.enableTwoFactor') || "Enable Two-Factor Authentication"}</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button>{t('security.saveButton') || "Save Security Settings"}</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('security.loginHistory.title') || "Login History"}</CardTitle>
                <CardDescription>{t('security.loginHistory.description') || "Recent login activities on your account"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { date: "2023-07-20", time: "14:30 UTC", ip: "192.168.1.1", location: "New York, USA" },
                  { date: "2023-07-19", time: "09:15 UTC", ip: "10.0.0.1", location: "London, UK" },
                  { date: "2023-07-18", time: "22:45 UTC", ip: "172.16.0.1", location: "Tokyo, Japan" },
                ].map((login, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>
                      {login.date} {login.time}
                    </span>
                    <span>{login.ip}</span>
                    <span>{login.location}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('security.activeSessions.title') || "Active Sessions"}</CardTitle>
                <CardDescription>{t('security.activeSessions.description') || "Currently active sessions on your account"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { device: t('security.activeSessions.laptop') || "Laptop", browser: "Chrome", os: "Windows 10", icon: Laptop },
                  { device: t('security.activeSessions.smartphone') || "Smartphone", browser: "Safari", os: "iOS 15", icon: Smartphone },
                  { device: t('security.activeSessions.tablet') || "Tablet", browser: "Firefox", os: "Android 12", icon: Tablet },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <session.icon className="mr-2 h-4 w-4" />
                      {session.device}
                    </span>
                    <span>{session.browser}</span>
                    <span>{session.os}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline">{t('security.activeSessions.logOutAll') || "Log Out All Other Sessions"}</Button>
              </CardFooter>
            </Card>
          </div>
  )
}
