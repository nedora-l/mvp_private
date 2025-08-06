"use client";

import { useState, useEffect } from "react";
import { useI18n } from '@/lib/i18n/use-i18n';
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users2, Target, FileText, PlusCircle, RefreshCcw, Bot } from "lucide-react";
import { CompanyAnnouncements } from "@/components/intranet/company-announcements"
import { QuickLinks } from "@/components/intranet/quick-links"
import { UpcomingEvents } from "@/components/intranet/upcoming-events"
import { TeamActivity } from "@/components/intranet/team-activity"
import { RecentDocuments } from "@/components/intranet/recent-documents"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import GeminiLiveChat from "@/components/chat/GeminiLiveChat"
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import DashboardPageComponentAdminView from "./dashboard.page.component.admin";
import { useSettings } from "@/contexts/settings-context"
import { departments } from "@/lib/mock-data/common"
import { CurrentRoleBadgeComponent } from "../layout/current-role"
import { CurrentRoleBadgeSelectorComponent } from "../layout/role-selector"

export default function DashboardPageComponent({ dictionary, locale }: AppComponentDictionaryProps) {
  const { settings, isSettingsLoaded } = useSettings();
  const activeDepartment = settings.currentDepartment || "admin";
  const currentDept = departments.find((d) => d.id === activeDepartment) || departments[0];
  const DepartmentIcon = currentDept.icon

  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n(dictionary);
  const [initialized, setInitialized] = useState(false);
  const { data: session, status } = useSession();
  const currentUser = session?.user || null ;
  const [showChat, setShowChat] = useState(false);
  const isAdmin: boolean = (currentUser && (currentUser?.roles?.includes("ROLE_ADMIN") || currentUser?.roles?.includes("ADMIN") )) === true;

  const refreshAll = async () => {
    
  };

  if (!isSettingsLoaded) {
    return (
      <div className="flex-1 space-y-6 p-6 animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* if admin */}
      {isAdmin && (
      <div className="space-y-6 p-2">
        {/* Department Header with Badge and Selector */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 md:mb-0">
            <DepartmentIcon className={`h-6 w-6 ${currentDept.color}`} />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {getDepartmentTitle(activeDepartment)}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <CurrentRoleBadgeComponent dictionary={dictionary} locale={locale} />
            <CurrentRoleBadgeSelectorComponent dictionary={dictionary} locale={locale} />
          </div>
        </div>
        <p className="text-gray-600 flex items-center gap-2">
          <span>{getDepartmentGreeting(activeDepartment, dictionary, currentUser)}</span>
          <span className="text-gray-400">•</span>
          <span className={`text-sm px-2 py-1 rounded-full ${getDepartmentLabelStyle(activeDepartment)}`}>
            {getDepartmentLabel(activeDepartment)}
          </span>
        </p>
      </div>
      )}


      
      {/* Admin View Component */}
      {isAdmin && currentDept.id === "admin" && <DashboardPageComponentAdminView dictionary={dictionary} locale={locale} />}
      {isAdmin && currentDept.id === "ceo" && <DashboardPageComponentAdminView dictionary={dictionary} locale={locale} />}
      {isAdmin && currentDept.id !== "admin" && currentDept.id !== "ceo" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  { t('home.welcome') || "Bienvenue" } !
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <RefreshCcw className="h-4 w-4" />
                  <span className="sr-only">{ t('actions.refresh') || "Actualiser" } </span>
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="events" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 h-auto md:h-auto">
                <TabsTrigger value="events" className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  { t('home.upcomingEvents.title') || "Événements à venir" }
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  { t('home.companyAnnouncements.title') || "Annonces de l'entreprise" }
                </TabsTrigger>
                <TabsTrigger value="quick-links" className="flex items-center">
                  <Users2 className="mr-2 h-4 w-4" />
                  { t('teams.activity.title') || t('home.teamActivity.title') }
                </TabsTrigger>
                <TabsTrigger value="policies" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  { t('home.policies.title') || "Politiques" }
                </TabsTrigger>
                  </TabsList>
                  <TabsContent value="announcements">
                  <CompanyAnnouncements dictionary={dictionary} locale={locale} />
                  </TabsContent>
                  <TabsContent value="quick-links">
                <TeamActivity dictionary={dictionary} locale={locale} />
                  </TabsContent>
                  <TabsContent value="policies">
                  <RecentDocuments dictionary={dictionary} locale={locale} />
                  </TabsContent>
                  <TabsContent value="events">
                  <UpcomingEvents dictionary={dictionary} locale={locale} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <br/>
          </div>
          <div className="gap-6 lg:col-span-1 order-first sm:order-first lg:order-none">
            <QuickLinks dictionary={dictionary} locale={locale} />
          </div>
        </div>
      )}


      {!isAdmin && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  { t('home.welcome') || "Bienvenue" } !
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <RefreshCcw className="h-4 w-4" />
                  <span className="sr-only">{ t('actions.refresh') || "Actualiser" } </span>
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="events" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 h-auto md:h-auto">
                <TabsTrigger value="events" className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  { t('home.upcomingEvents.title') || "Événements à venir" }
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  { t('home.companyAnnouncements.title') || "Annonces de l'entreprise" }
                </TabsTrigger>
                <TabsTrigger value="quick-links" className="flex items-center">
                  <Users2 className="mr-2 h-4 w-4" />
                  { t('teams.activity.title') || t('home.teamActivity.title') }
                </TabsTrigger>
                <TabsTrigger value="policies" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  { t('home.policies.title') || "Politiques" }
                </TabsTrigger>
                  </TabsList>
                  <TabsContent value="announcements">
                  <CompanyAnnouncements dictionary={dictionary} locale={locale} />
                  </TabsContent>
                  <TabsContent value="quick-links">
                <TeamActivity dictionary={dictionary} locale={locale} />
                  </TabsContent>
                  <TabsContent value="policies">
                  <RecentDocuments dictionary={dictionary} locale={locale} />
                  </TabsContent>
                  <TabsContent value="events">
                  <UpcomingEvents dictionary={dictionary} locale={locale} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <br/>
          </div>
          <div className="gap-6 lg:col-span-1 order-first sm:order-first lg:order-none">
            <QuickLinks dictionary={dictionary} locale={locale} />
          </div>
        </div>

      )}


      {/* Fixed FAB for Chat */}
      <Button variant="secondary"
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Chat Component - Conditionally Rendered */}
      {showChat && (
        <div className="fixed bottom-0 right-6 z-40">
          <GeminiLiveChat />
        </div>
      )}
      <MobileBottomNav dictionary={dictionary} />
    </div>
  )
}

// Helper functions for readability
export function getDepartmentTitle(dept: string) {
  switch (dept) {
    case "admin": return "Tableau de Bord Admin";
    case "ceo": return "Tableau de Bord Exécutif";
    case "finance": return "Tableau de Bord Financier";
    case "operations": return "Tableau de Bord Opérationnel";
    case "hr": return "Tableau de Bord RH";
    case "sales": return "Tableau de Bord Commercial";
    case "tech": return "Tableau de Bord Technique";
    case "marketing": return "Tableau de Bord Marketing";
    default: return "Tableau de Bord Management";
  }
}

export function getDepartmentGreeting(dept: string, dictionary: any, user: any) {
  const name = user?.name || user?.email || "User";
  const hello = `Hi 👋 ${name}`;
  switch (dept) {
    case "ceo": return `${hello} • CEO`;
    case "admin": return `${hello} •  Admin`;
    case "finance": return `${hello}  •  Équipe Finance`;
    case "operations": return `${hello}  •  Équipe Opérations`;
    case "hr": return `${hello}  •  Équipe RH`;
    case "sales": return `${hello}  •  Équipe Commerciale`;
    case "tech": return `${hello}  •  Équipe Technique`;
    case "marketing": return `${hello}  •  Équipe Marketing`;
    default: return `${hello}  •  Équipe Management`;
  }
}

export function getDepartmentLabelStyle(dept: string) {
  switch (dept) {
    case "admin": return "bg-red-100 text-red-700";
    case "ceo": return "bg-amber-100 text-amber-700";
    case "finance": return "bg-green-100 text-green-700";
    case "operations": return "bg-blue-100 text-blue-700";
    case "hr": return "bg-purple-100 text-purple-700";
    case "sales": return "bg-orange-100 text-orange-700";
    case "tech": return "bg-cyan-100 text-cyan-700";
    case "marketing": return "bg-pink-100 text-pink-700";
    default: return "bg-indigo-100 text-indigo-700";
  }
}

export function getDepartmentLabel(dept: string) {
  switch (dept) {
    case "admin": return "Administration & Support";
    case "ceo": return "Vue d'ensemble stratégique";
    case "finance": return "Gestion financière";
    case "operations": return "Pilotage opérationnel";
    case "hr": return "Gestion des talents";
    case "sales": return "Performance commerciale";
    case "tech": return "Infrastructure & développement";
    case "marketing": return "Marketing digital & communication";
    default: return "Stratégie & leadership";
  }
}
