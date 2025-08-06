"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Euro, 
  TrendingUp, 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCcw,
  DollarSign,
  Target,
  PieChart,
  BarChart3,
  Calculator
} from "lucide-react";
import { toast } from "sonner";

interface BudgetEstimation {
  projectId: string;
  projectName: string;
  totalTasks: number;
  totalStoryPoints: number;
  completedStoryPoints: number;
  estimatedHours: number;
  hourlyRate: number;
  currency: 'MAD' | 'EUR' | 'USD';
  totalCost: number;
  remainingCost: number;
  velocity: number;
  estimatedCompletionDate: string;
  riskFactor: number;
  adjustedCost: number;
}

export default function BudgetPage() {
  const [estimations, setEstimations] = useState<BudgetEstimation[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [config, setConfig] = useState({
    hourlyRate: 75,
    hoursPerStoryPoint: 4,
    currency: 'EUR' as 'MAD' | 'EUR' | 'USD'
  });

  // Charger les estimations
  const fetchEstimations = async () => {
    setLoading(true);
    try {
      console.log("🔄 Récupération des estimations budgétaires...");
      
      const response = await fetch('/api/budget-estimations');
      const data = await response.json();
      
      if (data.success) {
        setEstimations(data.estimations || []);
        setTotalBudget(data.totalBudget || 0);
        console.log(`✅ ${data.estimations?.length || 0} estimations récupérées`);
      } else {
        throw new Error(data.error || 'Erreur lors de la récupération');
      }
    } catch (error) {
      console.error("❌ Erreur fetchEstimations:", error);
      toast.error("Erreur lors de la récupération des estimations");
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour la configuration
  const updateConfig = async () => {
    try {
      const response = await fetch('/api/budget-estimations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowConfigModal(false);
        toast.success("Configuration mise à jour !");
        // Recharger les estimations avec la nouvelle config
        setTimeout(() => fetchEstimations(), 500);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  useEffect(() => {
    fetchEstimations();
  }, []);

  const getRiskColor = (riskFactor: number) => {
    if (riskFactor <= 1.15) return "text-green-600 bg-green-100";
    if (riskFactor <= 1.35) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getRiskIcon = (riskFactor: number) => {
    if (riskFactor <= 1.15) return <CheckCircle className="h-4 w-4" />;
    if (riskFactor <= 1.35) return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const formatCurrency = (amount: number, currency: 'MAD' | 'EUR' | 'USD' = config.currency) => {
    const currencyConfig = {
      MAD: { code: 'MAD', symbol: 'DH', locale: 'ar-MA' },
      EUR: { code: 'EUR', symbol: '€', locale: 'fr-FR' },
      USD: { code: 'USD', symbol: '$', locale: 'en-US' }
    };

    const currencyInfo = currencyConfig[currency];
    
    try {
      return new Intl.NumberFormat(currencyInfo.locale, {
        style: 'currency',
        currency: currencyInfo.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      // Fallback si la locale n'est pas supportée
      return `${amount.toLocaleString()} ${currencyInfo.symbol}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estimations Budgétaires</h1>
            <p className="text-sm text-muted-foreground">
              Calculs automatiques basés sur les tâches, story points et vélocité
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configuration des Estimations</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyRate">Taux horaire</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={config.hourlyRate}
                        onChange={(e) => setConfig({...config, hourlyRate: parseInt(e.target.value)})}
                        min="10"
                        max="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Devise</Label>
                      <select
                        id="currency"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={config.currency}
                        onChange={(e) => setConfig({...config, currency: e.target.value as 'MAD' | 'EUR' | 'USD'})}
                      >
                        <option value="MAD">🇲🇦 Dirham Marocain (MAD)</option>
                        <option value="EUR">🇪🇺 Euro (EUR)</option>
                        <option value="USD">🇺🇸 Dollar US (USD)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="hoursPerPoint">Heures par Story Point</Label>
                    <Input
                      id="hoursPerPoint"
                      type="number"
                      value={config.hoursPerStoryPoint}
                      onChange={(e) => setConfig({...config, hoursPerStoryPoint: parseInt(e.target.value)})}
                      min="1"
                      max="16"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                      Annuler
                    </Button>
                    <Button onClick={updateConfig}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Appliquer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button onClick={fetchEstimations} disabled={loading}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Total Projets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimations.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Euro className="h-4 w-4" />
                Budget Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalBudget, config.currency)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {config.currency} - {config.hourlyRate}/h
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Vélocité Moyenne
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estimations.length > 0 
                  ? Math.round(estimations.reduce((sum, est) => sum + est.velocity, 0) / estimations.length)
                  : 0}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Taux Horaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {config.hourlyRate} {config.currency}/h
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des estimations */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Estimations par Projet</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : estimations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <DollarSign className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Aucune estimation disponible</h3>
                <p className="text-sm text-muted-foreground">
                  Les estimations sont calculées automatiquement à partir de vos projets et tâches
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {estimations.map((estimation) => (
                <Card key={estimation.projectId} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{estimation.projectName}</CardTitle>
                      <Badge className={getRiskColor(estimation.riskFactor)}>
                        {getRiskIcon(estimation.riskFactor)}
                        <span className="ml-1">
                          Risque {estimation.riskFactor <= 1.15 ? 'Faible' : 
                                estimation.riskFactor <= 1.35 ? 'Moyen' : 'Élevé'}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Métriques principales */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Coût Estimé</div>
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(estimation.totalCost, estimation.currency)}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Coût Ajusté</div>
                        <div className="text-xl font-bold text-purple-600">
                          {formatCurrency(estimation.adjustedCost, estimation.currency)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progression */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-mono">{estimation.velocity}%</span>
                      </div>
                      <Progress value={estimation.velocity} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {estimation.completedStoryPoints}/{estimation.totalStoryPoints} story points terminés
                      </div>
                    </div>
                    
                    {/* Détails */}
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-sm font-medium">{estimation.totalTasks}</div>
                        <div className="text-xs text-muted-foreground">Tâches</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{estimation.estimatedHours}h</div>
                        <div className="text-xs text-muted-foreground">Estimé</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium flex items-center justify-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(estimation.estimatedCompletionDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Fin estimée</div>
                      </div>
                    </div>
                    
                    {/* Coût restant */}
                    {estimation.remainingCost > 0 && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-orange-800">
                            Coût restant estimé
                          </span>
                          <span className="font-bold text-orange-600">
                            {formatCurrency(estimation.remainingCost, estimation.currency)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer avec informations */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Target className="h-6 w-6 text-blue-600 mt-1" />
              <div className="space-y-2">
                <h3 className="font-medium text-blue-900">Comment sont calculées les estimations ?</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>Story Points :</strong> Basés sur la priorité des tâches (Faible: 1pt, Moyenne: 3pts, Élevée: 5pts, Critique: 8pts)</p>
                  <p>• <strong>Coût :</strong> Story Points × Heures par point × Taux horaire</p>
                  <p>• <strong>Risque :</strong> Ajustement selon la vélocité et le nombre de tâches (+10% à +50%)</p>
                  <p>• <strong>Date de fin :</strong> Basée sur la vélocité actuelle du projet</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
