"use client";
import {
  Home,
  MessageSquare,
  Calendar,
  Users,
  FolderOpen,
  BookOpen,
  FileText,
  UserCheck,
  Building,
  Settings,
  HelpCircle,
  ChevronLeft,
  BarChart3,
  Sun,
  Bell,
  Grid3X3,
  TrendingUp,
  TrendingDown,
  Coffee,
  Phone,
  Monitor,
  DollarSign,
  Crown,
  Shield,
  X,
  Bot,
  Megaphone,
  Users2,
  Star,
  ArrowUp,
  ArrowDown,
  Play,
  ImageIcon,
  Video,
  FileTextIcon,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Briefcase,
  BarChart,
  Eye,
  Calculator,
  ShieldCheck,
  List,
  MegaphoneIcon,
  Search,
  Filter,
  Edit,
  Clock,
  Award,
  GraduationCap,
  Zap,
  TrendingUpIcon,
  UserPlus,
  Download,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react";
import { useI18n } from '@/lib/i18n/use-i18n';
import { AppComponentDictionaryProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyAnnouncements } from "@/components/intranet/company-announcements"
import { QuickLinks } from "@/components/intranet/quick-links"
import { UpcomingEvents } from "@/components/intranet/upcoming-events"
import { TeamActivity } from "@/components/intranet/team-activity"
import { RecentDocuments } from "@/components/intranet/recent-documents"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import GeminiLiveChat from "@/components/chat/GeminiLiveChat"
import { useSession } from "next-auth/react";
import { monthlyData } from "@/lib/mock-data/common";
import { Button } from "@/components/ui/button";


export default function DashboardWelcomeComponentAdmin({ dictionary, locale }: AppComponentDictionaryProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showChat, setShowChat] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n(dictionary);
  const [initialized, setInitialized] = useState(false);
  const { data: session, status } = useSession();
  const currentUser = session?.user || null ;
  
  const refreshAll = async () => {
    
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* CEO Pattern Background */}
      <div className="absolute top-0 right-0 opacity-10">
        <Crown className="h-32 w-32" />
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold mb-2">
            Vue d'Ensemble Stratégique - {monthlyData.currentMonth}
          </h2>
          <p className="text-blue-100 text-sm">
            Données consolidées pour la prise de décision exécutive
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Revenue */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-blue-100">Chiffre d'Affaires</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-xs text-green-400">+12%</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-3">
            {(monthlyData.billing.totalRevenue / 1000000).toFixed(1)}M MAD
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-blue-200">Objectif: 2.8M MAD</span>
              <span className="text-green-400">+50k MAD</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((monthlyData.billing.totalRevenue / 2800000) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Project Margin */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-blue-100">Marge Moyenne</div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-400" />
              <span className="text-xs text-red-400">-3%</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-3">
            {monthlyData.productivity.averageProjectMargin}%
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-blue-200">Objectif: 35%</span>
              <span className="text-red-400">-3pts</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(monthlyData.productivity.averageProjectMargin / 35) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Utilization Rate */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-blue-100">Taux d'Utilisation</div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-orange-400">-7pts</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-3">{monthlyData.resources.currentUtilization}%</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-blue-200">Objectif: 85%</span>
              <span className="text-orange-400">-7pts</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(monthlyData.resources.currentUtilization / 85) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-blue-100">Satisfaction Client</div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-xs text-green-400">+0.2</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-3">{monthlyData.productivity.clientSatisfaction}/5</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-blue-200">Objectif: 4.5/5</span>
              <span className="text-green-400">+0.1</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-3 h-3 rounded-sm ${
                    star <= Math.floor(monthlyData.productivity.clientSatisfaction)
                      ? "bg-green-400"
                      : star <= monthlyData.productivity.clientSatisfaction
                        ? "bg-green-400 opacity-60"
                        : "bg-white/20"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

