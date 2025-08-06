"use client"

import React, { useState, useMemo } from 'react';
import { ProjectDto } from '@/lib/services/client/projects';
import { ProjectFinancialSummaryDto } from '@/lib/interfaces/apis/atimeus';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Calendar, Users } from "lucide-react";
 
import { useI18n } from '@/lib/i18n/use-i18n';
import { Dictionary } from '@/locales/dictionary';
import { atimeusApiClient } from '@/lib/services/server/atimeus';

interface ProjectAtimeusIndicatorsCardProps {
  previewProject: ProjectDto;
  externalProjectId?: string | null;
  dictionary: Dictionary;
  isLoading?: boolean;
}

// Utility functions for formatting and calculations
const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const getValueColor = (value: number, isInverted: boolean = false): string => {
  const isPositive = value > 0;
  if (isInverted) {
    return isPositive ? 'text-red-600' : 'text-green-600';
  }
  return isPositive ? 'text-green-600' : 'text-red-600';
};

const getTrendIcon = (value: number) => {
  return value > 0 ? 
    <TrendingUp className="h-4 w-4 text-green-600" /> : 
    <TrendingDown className="h-4 w-4 text-red-600" />;
};

export const ProjectAtimeusIndicatorsCard: React.FC<ProjectAtimeusIndicatorsCardProps> = ({ 
  dictionary, 
  previewProject, 
  externalProjectId,
  isLoading = false 
}) => {
  const { t } = useI18n(dictionary);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const [externalProject, setExternalProject] = useState<ProjectFinancialSummaryDto | null>( null);

  // Memoized calculations
  const calculations = useMemo(() => {
    if (!externalProject) return null;

    const marginRate = externalProject.revenuesYtd.current > 0 
      ? (externalProject.marginYtd.current / externalProject.revenuesYtd.current) * 100 
      : 0;

    const invoicingRate = externalProject.provisionsAmount > 0 
      ? externalProject.provisionsInvoicedPercentage 
      : 0;

    const tasksEfficiency = externalProject.tasksTotalEstimate > 0 
      ? (externalProject.tasksTotalConsumption / externalProject.tasksTotalEstimate) * 100 
      : 0;

    return {
      marginRate,
      invoicingRate,
      tasksEfficiency,
    };
  }, [externalProject]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };


  const getProjectDetails = async () => {
    if (!externalProjectId) {
      setError(t('projects.atimeus.indicators.no_data'));
      return;
    }

    try {
      setLoading(true);
      const projectData = await atimeusApiClient.getProjectIndicators(externalProjectId);
      setLoading(false);
      setExternalProject(projectData);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch project indicators:", err);
      setLoading(false);
      setError(err.message || t('projects.atimeus.indicators.fetch_error'));
    }
  }

 
  React.useEffect(() => {
    if ( externalProjectId) {
      getProjectDetails();
    }
  }, [externalProjectId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('projects.atimeus.indicators.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!externalProject) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            {t('projects.atimeus.indicators.no_data')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('projects.atimeus.indicators.no_data_description')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Error: {error}
            </span>
            <Button variant="outline" size="sm" onClick={() => setError(null)}>
              {t('common.actions.dismiss')}
            </Button>
          </div>
        </div>
      )}
      {/* Project Refresh Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={getProjectDetails} 
          disabled={loading}
        >
          Actualiser
        </Button>
      </div>

      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {externalProject.name}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant={externalProject.dealIsActive ? "default" : "secondary"}>
                  {externalProject.dealIsActive ? t('projects.status.active') : t('projects.status.inactive')}
                </Badge>
                <Badge variant="outline">{externalProject.currency}</Badge>
                {externalProject.hasAnomalies && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {externalProject.warningAnomaliesCount + externalProject.infoAnomaliesCount} anomalies
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{externalProject.company}</p>
              <p>{externalProject.division}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('overview')}
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('projects.atimeus.sections.overview')}
            </span>
            <span className="text-sm">
              {expandedSections.has('overview') ? '−' : '+'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('overview') && (
          <CardContent className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.metrics.revenue_ytd')}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(externalProject.revenuesYtd.current, externalProject.currency)}
                  </span>
                  {getTrendIcon(externalProject.revenuesYtd.current)}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.metrics.costs_ytd')}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-red-600">
                    {formatCurrency(externalProject.costsYtd.current, externalProject.currency)}
                  </span>
                  {getTrendIcon(-externalProject.costsYtd.current)}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.metrics.margin_ytd')}</Label>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getValueColor(externalProject.marginYtd.current)}`}>
                    {formatCurrency(externalProject.marginYtd.current, externalProject.currency)}
                  </span>
                  {getTrendIcon(externalProject.marginYtd.current)}
                </div>
                {calculations && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t('projects.atimeus.metrics.margin_rate')}</span>
                      <span>{formatPercentage(calculations.marginRate)}</span>
                    </div>
                    <Progress value={Math.abs(calculations.marginRate)} className="h-2" />
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Additional Financial Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t('projects.atimeus.metrics.valuation_amount')}</Label>
                <p className="font-medium">{formatCurrency(externalProject.valuationAmount, externalProject.currency)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t('projects.atimeus.metrics.valuation_cost')}</Label>
                <p className="font-medium">{formatCurrency(externalProject.valuationCost, externalProject.currency)}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t('projects.atimeus.metrics.forecast_margin')}</Label>
                <p className={`font-medium ${getValueColor(externalProject.forecastMarginAmount)}`}>
                  {formatCurrency(externalProject.forecastMarginAmount, externalProject.currency)}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">{t('projects.atimeus.metrics.current_year')}</Label>
                <p className="font-medium">{externalProject.currentYear}</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tasks Metrics */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('tasks')}
          >
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('projects.atimeus.sections.tasks')}
            </span>
            <span className="text-sm">
              {expandedSections.has('tasks') ? '−' : '+'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('tasks') && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.tasks.total_price')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.tasksTotalPrice, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.tasks.estimated_tjm')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.tasksEstimatedTJM, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.tasks.valued_tjm')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.tasksValuedTJM, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.tasks.total_consumption')}</Label>
                <p className="text-lg font-semibold">{formatNumber(externalProject.tasksTotalConsumption)}</p>
                {calculations && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t('projects.atimeus.tasks.efficiency')}</span>
                      <span>{formatPercentage(calculations.tasksEfficiency)}</span>
                    </div>
                    <Progress value={Math.min(calculations.tasksEfficiency, 100)} className="h-2" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.tasks.total_remaining')}</Label>
                <p className="text-lg font-semibold">{formatNumber(externalProject.tasksTotalRemaining)}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.tasks.tasks_margin')}</Label>
                <p className={`text-lg font-semibold ${getValueColor(externalProject.tasksMarginAmount)}`}>
                  {formatCurrency(externalProject.tasksMarginAmount, externalProject.currency)}
                </p>
              </div>
            </div>

            {externalProject.hasExceptionalTasks && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    {t('projects.atimeus.tasks.exceptional_tasks')}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Trading Metrics */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('trading')}
          >
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('projects.atimeus.sections.trading')}
            </span>
            <span className="text-sm">
              {expandedSections.has('trading') ? '−' : '+'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('trading') && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.trading.sold_price')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.tradingSoldPrice, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.trading.valuation_amount')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.tradingValuationAmount, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.trading.margin_amount')}</Label>
                <p className={`text-lg font-semibold ${getValueColor(externalProject.tradingMarginAmount)}`}>
                  {formatCurrency(externalProject.tradingMarginAmount, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.trading.forecast_amount')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.tradingForecastValuationAmount, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.trading.forecast_margin')}</Label>
                <p className={`text-lg font-semibold ${getValueColor(externalProject.tradingForecastMarginAmount)}`}>
                  {formatCurrency(externalProject.tradingForecastMarginAmount, externalProject.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Expenses Metrics */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('expenses')}
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('projects.atimeus.sections.expenses')}
            </span>
            <span className="text-sm">
              {expandedSections.has('expenses') ? '−' : '+'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('expenses') && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.expenses.valuation_amount')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.expensesValuationAmount, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.expenses.margin_amount')}</Label>
                <p className={`text-lg font-semibold ${getValueColor(externalProject.expensesMarginAmount)}`}>
                  {formatCurrency(externalProject.expensesMarginAmount, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.expenses.margin_rate')}</Label>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getValueColor(externalProject.expensesMarginRate)}`}>
                    {formatPercentage(externalProject.expensesMarginRate)}
                  </p>
                  <Progress value={Math.abs(externalProject.expensesMarginRate)} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.expenses.rebillable_amount')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.expensesRebillableAmount, externalProject.currency)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('projects.atimeus.expenses.to_valuate')}</Label>
                <p className="text-lg font-semibold">
                  {formatCurrency(externalProject.expensesToValuateAmount, externalProject.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Invoicing & Contracts */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('invoicing')}
          >
            <span className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('projects.atimeus.sections.invoicing')}
            </span>
            <span className="text-sm">
              {expandedSections.has('invoicing') ? '−' : '+'}
            </span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('invoicing') && (
          <CardContent className="space-y-6">
            {/* Invoicing Section */}
            <div className="space-y-4">
              <h4 className="font-medium">{t('projects.atimeus.invoicing.title')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('projects.atimeus.invoicing.invoiced_amount')}</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(externalProject.invoicesInvoicedAmount, externalProject.currency)}
                  </p>
                  {calculations && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t('projects.atimeus.invoicing.invoiced_rate')}</span>
                        <span>{formatPercentage(calculations.invoicingRate)}</span>
                      </div>
                      <Progress value={calculations.invoicingRate} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('projects.atimeus.invoicing.paid_amount')}</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(externalProject.invoicesPaidAmount, externalProject.currency)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('projects.atimeus.invoicing.provisions_amount')}</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(externalProject.provisionsAmount, externalProject.currency)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contracts Section */}
            <div className="space-y-4">
              <h4 className="font-medium">{t('projects.atimeus.contracts.title')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('projects.atimeus.contracts.total_amount')}</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(externalProject.contractsAmount, externalProject.currency)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('projects.atimeus.contracts.active_contracts')}</Label>
                  <p className="text-lg font-semibold">{externalProject.contractsActiveContractsCount}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{t('projects.atimeus.contracts.subcontractor_amount')}</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(externalProject.subcontractorContractsAmount, externalProject.currency)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Project Management Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('projects.atimeus.sections.management')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('projects.atimeus.management.project_managers')}</Label>
              <div className="space-y-1">
                {externalProject.projectManagers.map((manager, index) => (
                  <Badge key={index} variant="secondary">{manager}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('projects.atimeus.management.customer')}</Label>
              <p className="font-medium">{externalProject.customer}</p>
              {externalProject.finalCustomer !== externalProject.customer && (
                <p className="text-muted-foreground">
                  {t('projects.atimeus.management.final_customer')}: {externalProject.finalCustomer}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('projects.atimeus.management.activity')}</Label>
              <p className="font-medium">{externalProject.activity} ({externalProject.activityCode})</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('projects.atimeus.management.deal')}</Label>
              <div className="flex items-center gap-2">
                <p className="font-medium">{externalProject.deal}</p>
                <Badge variant={externalProject.dealIsActive ? "default" : "secondary"}>
                  {externalProject.dealIsActive ? t('projects.status.active') : t('projects.status.inactive')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('projects.atimeus.management.status')}</Label>
              <p className="font-medium">{externalProject.projectStatus}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('projects.atimeus.management.last_update')}</Label>
              <p className="text-muted-foreground">
                {new Date(externalProject.updateDate).toLocaleDateString()} 
                {externalProject.updateAuthor && ` - ${externalProject.updateAuthor}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
