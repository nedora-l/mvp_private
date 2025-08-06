/**
 * Utilitaires pour la synchronisation Jira
 * Gestion des erreurs, fallbacks et synchronisation périodique
 */

export interface JiraSyncStatus {
  isConnected: boolean;
  lastSync: Date | null;
  taskCount: number;
  source: 'jira' | 'local' | 'hybrid';
  error?: string;
}

export class JiraSyncManager {
  private static instance: JiraSyncManager;
  private syncStatus: JiraSyncStatus = {
    isConnected: false,
    lastSync: null,
    taskCount: 0,
    source: 'local'
  };
  private syncInterval: NodeJS.Timeout | null = null;

  static getInstance(): JiraSyncManager {
    if (!this.instance) {
      this.instance = new JiraSyncManager();
    }
    return this.instance;
  }

  /**
   * Démarrer la synchronisation automatique (toutes les 5 minutes)
   */
  startAutoSync(onSyncComplete?: (status: JiraSyncStatus) => void) {
    this.stopAutoSync(); // Arrêter l'ancien timer s'il existe
    
    this.syncInterval = setInterval(async () => {
      try {
        const status = await this.checkConnection();
        onSyncComplete?.(status);
      } catch (error) {
        console.warn('🔄 Auto-sync failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    console.log('🔄 Auto-sync Jira activé (5 min)');
  }

  /**
   * Arrêter la synchronisation automatique
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('🔄 Auto-sync Jira désactivé');
    }
  }

  /**
   * Vérifier la connexion Jira et mettre à jour le statut
   */
  async checkConnection(): Promise<JiraSyncStatus> {
    try {
      const response = await fetch('/api/mcp/tasks');
      const data = await response.json();
      
      if (data.success && data.source === 'jira') {
        this.syncStatus = {
          isConnected: true,
          lastSync: new Date(),
          taskCount: data.jiraTasks || 0,
          source: data.mockTasks > 0 ? 'hybrid' : 'jira'
        };
      } else {
        this.syncStatus = {
          isConnected: false,
          lastSync: this.syncStatus.lastSync,
          taskCount: data.tasks?.length || 0,
          source: 'local',
          error: data.error || 'Jira non disponible'
        };
      }
    } catch (error) {
      this.syncStatus = {
        isConnected: false,
        lastSync: this.syncStatus.lastSync,
        taskCount: 0,
        source: 'local',
        error: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }

    return this.syncStatus;
  }

  /**
   * Obtenir le statut actuel
   */
  getStatus(): JiraSyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Forcer une synchronisation manuelle
   */
  async forcSync(): Promise<JiraSyncStatus> {
    console.log('🔄 Synchronisation manuelle Jira...');
    return await this.checkConnection();
  }
}

/**
 * Hook pour les messages d'erreur utilisateur-friendly
 */
export const getJiraErrorMessage = (error: string): string => {
  if (error.includes('401') || error.includes('Unauthorized')) {
    return 'Authentification Jira échouée. Vérifiez vos credentials.';
  }
  if (error.includes('403') || error.includes('Forbidden')) {
    return 'Permissions insuffisantes pour cette action Jira.';
  }
  if (error.includes('404') || error.includes('Not Found')) {
    return 'Tâche ou projet Jira non trouvé.';
  }
  if (error.includes('network') || error.includes('fetch')) {
    return 'Problème de connexion à Jira. Utilisation des données locales.';
  }
  if (error.includes('timeout')) {
    return 'Timeout Jira. Réessayez dans quelques instants.';
  }
  return 'Erreur Jira temporaire. Fallback sur données locales.';
};

/**
 * Détecter si une tâche est compatible Jira
 */
export const isJiraCompatibleTask = (task: any): boolean => {
  return !!(task.jiraKey || task.jiraId || isJiraProject(task.projectId));
};

/**
 * Détecter si un projet est Jira
 */
export const isJiraProject = (projectId: number): boolean => {
  // IDs des projets Jira selon notre configuration
  return projectId === 100 || projectId === 101; // SSP, ECS
};

/**
 * Formater les informations de tâche Jira pour l'UI
 */
export const formatJiraTaskInfo = (task: any): string => {
  if (!task.jiraKey) return '';
  
  const parts = [];
  if (task.jiraKey) parts.push(`🔗 ${task.jiraKey}`);
  if (task.jiraId) parts.push(`ID: ${task.jiraId}`);
  
  return parts.join(' • ');
};

/**
 * Générer un lien direct vers Jira
 */
export const getJiraTaskUrl = (jiraKey: string): string => {
  const domain = process.env.NEXT_PUBLIC_JIRA_DOMAIN || 'abarouzabarouz.atlassian.net';
  return `https://${domain}/browse/${jiraKey}`;
};
