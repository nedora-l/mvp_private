/**
 * Hook pour les notifications intelligentes
 * Intègre la gestion d'erreurs améliorée avec le système toast existant
 * 
 * @version 1.0.0
 * @author DA Workspace
 */

import { toast } from "sonner";
import { useCallback } from "react";

export interface NotificationData {
  title: string;
  message: string;
  solution?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ErrorNotificationData {
  title: string;
  message: string;
  solution: string;
  error: string;
  source: string;
  retryable?: boolean;
}

export const useIntelligentNotifications = () => {
  
  /**
   * Notification de succès intelligente
   */
  const showSuccess = useCallback((data: NotificationData) => {
    toast.success(data.title, {
      description: data.message,
      duration: data.duration || 4000,
      action: data.action ? {
        label: data.action.label,
        onClick: data.action.onClick
      } : undefined
    });
  }, []);

  /**
   * Notification d'erreur intelligente avec solution
   */
  const showError = useCallback((data: ErrorNotificationData) => {
    const description = data.solution 
      ? `${data.message}\n\n💡 Solution: ${data.solution}`
      : data.message;

    toast.error(data.title, {
      description,
      duration: 8000, // Plus long pour les erreurs
      action: data.retryable ? {
        label: "🔄 Réessayer",
        onClick: () => {
          // Logique de retry à implémenter selon le contexte
          toast.info("Fonctionnalité de retry en cours de développement");
        }
      } : undefined
    });
  }, []);

  /**
   * Notification d'avertissement intelligente
   */
  const showWarning = useCallback((data: NotificationData) => {
    toast.warning(data.title, {
      description: data.message,
      duration: data.duration || 6000,
      action: data.action
    });
  }, []);

  /**
   * Notification d'information intelligente
   */
  const showInfo = useCallback((data: NotificationData) => {
    toast.info(data.title, {
      description: data.message,
      duration: data.duration || 5000,
      action: data.action
    });
  }, []);

  /**
   * Notification intelligente basée sur le type
   */
  const showNotification = useCallback((data: NotificationData) => {
    switch (data.type) {
      case 'success':
        showSuccess(data);
        break;
      case 'error':
        showError({
          title: data.title,
          message: data.message,
          solution: data.solution || "Aucune solution disponible",
          error: data.message,
          source: "notification"
        });
        break;
      case 'warning':
        showWarning(data);
        break;
      case 'info':
        showInfo(data);
        break;
      default:
        showInfo(data);
    }
  }, [showSuccess, showError, showWarning, showInfo]);

  /**
   * Notification d'erreur Jira intelligente
   * Utilise le format d'erreur standardisé des APIs v1
   */
  const showJiraError = useCallback((errorData: any) => {
    if (errorData?.type === "ERROR" && errorData?.source === 'jira-error') {
      showError({
        title: "🚨 Erreur Jira",
        message: errorData.message || "Une erreur s'est produite avec Jira",
        solution: errorData.solution || "Vérifiez votre configuration Jira",
        error: errorData.error || "Erreur inconnue",
        source: errorData.source || "jira"
      });
    } else {
      // Fallback pour les erreurs non formatées
      showError({
        title: "❌ Erreur",
        message: "Une erreur inattendue s'est produite",
        solution: "Vérifiez la console pour plus de détails",
        error: errorData?.message || "Erreur inconnue",
        source: "unknown"
      });
    }
  }, [showError]);

  /**
   * Notification de succès Jira
   */
  const showJiraSuccess = useCallback((successData: any) => {
    showSuccess({
      title: "✅ Succès Jira",
      message: successData.message || "Opération Jira réussie",
      type: 'success'
    });
  }, [showSuccess]);

  /**
   * Notification de validation
   */
  const showValidationError = useCallback((field: string, message: string) => {
    showError({
      title: "⚠️ Validation requise",
      message: `${field}: ${message}`,
      solution: "Veuillez corriger les champs marqués et réessayer",
      error: `Validation failed: ${field}`,
      source: "validation"
    });
  }, [showError]);

  /**
   * Notification de chargement
   */
  const showLoading = useCallback((message: string) => {
    toast.loading(message, {
      duration: Infinity // Jusqu'à ce qu'on l'arrête
    });
  }, []);

  /**
   * Arrêter le chargement
   */
  const dismissLoading = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
    showJiraError,
    showJiraSuccess,
    showValidationError,
    showLoading,
    dismissLoading
  };
};




