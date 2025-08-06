"use client";
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { JiraSyncManager, type JiraSyncStatus, getJiraErrorMessage, getJiraTaskUrl } from '@/lib/jira-sync';
import { toast } from 'sonner';

interface JiraIndicatorProps {
  compact?: boolean;
  showSyncButton?: boolean;
  className?: string;
}

export function JiraIndicator({ compact = false, showSyncButton = true, className = '' }: JiraIndicatorProps) {
  const [syncStatus, setSyncStatus] = useState<JiraSyncStatus>({
    isConnected: false,
    lastSync: null,
    taskCount: 0,
    source: 'local'
  });
  const [isLoading, setIsLoading] = useState(false);
  // Toast via sonner (imported above)

  const syncManager = JiraSyncManager.getInstance();

  // Charger le statut initial et démarrer auto-sync
  useEffect(() => {
    const loadInitialStatus = async () => {
      const status = await syncManager.checkConnection();
      setSyncStatus(status);
    };

    loadInitialStatus();

    // Démarrer auto-sync avec callback
    syncManager.startAutoSync((status) => {
      setSyncStatus(status);
    });

    // Nettoyer à la destruction
    return () => {
      syncManager.stopAutoSync();
    };
  }, []);

  // Synchronisation manuelle
  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      const newStatus = await syncManager.forcSync();
      setSyncStatus(newStatus);
      
      if (newStatus.isConnected) {
        toast({
          title: "✅ Synchronisation réussie",
          description: `${newStatus.taskCount} tâches Jira synchronisées`,
        });
      } else {
        toast({
          title: "⚠️ Jira indisponible",
          description: getJiraErrorMessage(newStatus.error || ''),
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erreur de synchronisation",
        description: getJiraErrorMessage(error instanceof Error ? error.message : ''),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Formater la dernière synchronisation
  const formatLastSync = (lastSync: Date | null): string => {
    if (!lastSync) return 'Jamais';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    return lastSync.toLocaleDateString('fr-FR');
  };

  // Obtenir l'icône de statut
  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (syncStatus.isConnected) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (syncStatus.error) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  // Obtenir la couleur du badge
  const getBadgeVariant = () => {
    if (syncStatus.isConnected && syncStatus.source === 'jira') return 'default';
    if (syncStatus.isConnected && syncStatus.source === 'hybrid') return 'secondary';
    return 'destructive';
  };

  // Obtenir le texte du badge
  const getBadgeText = () => {
    if (syncStatus.isConnected) {
      return syncStatus.source === 'hybrid' 
        ? `Jira Live (${syncStatus.taskCount})` 
        : `Jira (${syncStatus.taskCount})`;
    }
    return 'Jira Off';
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge variant={getBadgeVariant()}>
          {getStatusIcon()}
          <span className="ml-1">{getBadgeText()}</span>
        </Badge>
        {showSyncButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualSync}
            disabled={isLoading}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-3 bg-card rounded-lg border ${className}`}>
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div>
          <div className="flex items-center space-x-2">
            <Badge variant={getBadgeVariant()}>
              {getBadgeText()}
            </Badge>
            {syncStatus.source === 'hybrid' && (
              <Badge variant="outline" className="text-xs">
                + Mock
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Dernière sync: {formatLastSync(syncStatus.lastSync)}
            {syncStatus.error && (
              <span className="block text-red-500 text-xs">
                {getJiraErrorMessage(syncStatus.error)}
              </span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {syncStatus.isConnected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://abarouzabarouz.atlassian.net', '_blank')}
            className="h-8"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="ml-1 hidden sm:inline">Ouvrir Jira</span>
          </Button>
        )}
        {showSyncButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSync}
            disabled={isLoading}
            className="h-8"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        )}
      </div>
    </div>
  );
}

export default JiraIndicator;
