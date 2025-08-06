"use client";
import {
  Calendar,
  Users,
  FolderOpen,
  Building,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Sparkles,
} from "lucide-react"
import { useI18n } from '@/lib/i18n/use-i18n';
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { monthlyData } from "@/lib/mock-data/common";
import DashboardWelcomeComponentAdmin from "./components/dashboard.card.overview";
import { BillingTable } from "./components/BillingTable";
import { ProjectsTable } from "./components/ProjectsTable";
import { ResourcesTable } from "./components/ResourcesTable";
import { PartnershipsTable } from "./components/PartnershipsTable";


export default function DashboardPageComponentAdminView({ dictionary, locale }: AppComponentDictionaryProps) {
  
  const { t } = useI18n(dictionary);
  const { data: session, status } = useSession();
  const currentUser = session?.user || null ;
  
  const refreshAll = async () => {
    
  };
  
  return (
    <div className="flex-1 space-y-6">
      {/* Welcome Section */}
      <DashboardWelcomeComponentAdmin locale={locale} dictionary={dictionary} />

      {/* Detailed Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BillingTable />
        <ProjectsTable />
        <ResourcesTable />
        <PartnershipsTable />
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex gap-6 overflow-x-auto">
            <Button
              variant="ghost"
              className="text-blue-600 border-b-2 border-blue-600 rounded-none whitespace-nowrap"
            >
              Événements à venir
            </Button>
            <Button variant="ghost" className="text-gray-600 whitespace-nowrap">
              Annonces
            </Button>
            <Button variant="ghost" className="text-gray-600 whitespace-nowrap">
              Activité récente
            </Button>
            <Button variant="ghost" className="text-gray-600 whitespace-nowrap">
              Rapports
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Événements à venir
            </h3>
            <Button variant="outline" size="sm">
              View Calendar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Réunion générale</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>15 juillet 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>10h00 - 11h30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Salle de conférence principale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>45 participants</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Atelier de team building</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>20 juillet 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>14h00 - 17h00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Centre d'innovation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>28 participants</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Planification de lancement de produit
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>25 juillet 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏰</span>
                    <span>9h00 - 12h00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Salle de stratégie B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>12 participants</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

