"use client";
import { useState } from "react";

// Types pour les notifications
interface NotificationOptions {
  type: 'email' | 'slack' | 'teams' | 'webhook';
  recipient: string;
  subject?: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  taskId?: number;
  projectId?: number;
  userId?: string;
}

interface IntegrationStatus {
  slack: boolean;
  email: boolean;
  jira: boolean;
  timestamp: string;
}

export function useNotifications() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<IntegrationStatus | null>(null);

  // Envoyer une notification
  const sendNotification = async (options: NotificationOptions): Promise<boolean> => {
    setLoading(true);
    try {
      console.log("📨 Envoi notification:", options);
      
      // ✅ Utiliser l'API MCP pour les notifications (à implémenter)
      console.log("ℹ️ Notifications temporairement désactivées (API MCP en développement)");
      
      // Simuler le succès pour maintenir la compatibilité
      return true;
    } catch (error) {
      console.error("❌ Erreur notification:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Tester les connexions
  const checkIntegrationsStatus = async (): Promise<IntegrationStatus | null> => {
    try {
      // ✅ Désactivé temporairement - API MCP à implémenter
      console.log("ℹ️ Status intégrations temporairement désactivé (API MCP en développement)");
      
      const mockStatus: IntegrationStatus = {
        slack: false,
        email: false,
        jira: true, // Jira est connecté via MCP
        timestamp: new Date().toISOString()
      };
      
      setStatus(mockStatus);
      return mockStatus;
    } catch (error) {
      console.error("❌ Erreur status intégrations:", error);
      return null;
    }
  };

  // Notifications prédéfinies pour les tâches
  const notifyTaskCreated = async (task: any, project: any, assignee?: any) => {
    const notifications = [];

    // Email à l'assigné
    if (assignee?.email) {
      notifications.push(sendNotification({
        type: 'email',
        recipient: assignee.email,
        subject: `🆕 Nouvelle tâche assignée: ${task.title}`,
        message: `
          <h3>Nouvelle tâche assignée dans ${project.name}</h3>
          <p><strong>Titre:</strong> ${task.title}</p>
          <p><strong>Description:</strong> ${task.description || 'Aucune description'}</p>
          <p><strong>Priorité:</strong> ${task.priority}</p>
          <p><strong>Date d'échéance:</strong> ${task.dueDate || 'Non définie'}</p>
          <p>Connectez-vous à D&A Workspace pour plus de détails.</p>
        `,
        priority: task.priority === 'Critique' ? 'critical' : 
                 task.priority === 'Élevée' ? 'high' : 'medium',
        taskId: task.id,
        projectId: project.id
      }));
    }

    // Slack pour les projets connectés
    if (project.type === 'Slack' || project.type === 'Jira') {
      notifications.push(sendNotification({
        type: 'slack',
        recipient: `#${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        subject: `🆕 Nouvelle tâche: ${task.title}`,
        message: `
*Nouvelle tâche créée*
📝 *Titre:* ${task.title}
👤 *Assigné à:* ${assignee?.name || 'Non assigné'}
⚡ *Priorité:* ${task.priority}
📅 *Échéance:* ${task.dueDate || 'Non définie'}
🎯 *Projet:* ${project.name}
        `,
        priority: 'medium',
        taskId: task.id,
        projectId: project.id
      }));
    }

    return Promise.all(notifications);
  };

  const notifyTaskUpdated = async (task: any, project: any, changes: string[], assignee?: any) => {
    const notifications = [];

    // Email à l'assigné
    if (assignee?.email) {
      notifications.push(sendNotification({
        type: 'email',
        recipient: assignee.email,
        subject: `🔄 Tâche mise à jour: ${task.title}`,
        message: `
          <h3>Tâche mise à jour dans ${project.name}</h3>
          <p><strong>Titre:</strong> ${task.title}</p>
          <p><strong>Modifications:</strong> ${changes.join(', ')}</p>
          <p><strong>Nouveau statut:</strong> ${task.status}</p>
          <p><strong>Priorité:</strong> ${task.priority}</p>
          <p>Connectez-vous à D&A Workspace pour voir les détails.</p>
        `,
        priority: 'medium',
        taskId: task.id,
        projectId: project.id
      }));
    }

    return Promise.all(notifications);
  };

  const notifyTaskCompleted = async (task: any, project: any, assignee?: any) => {
    const notifications = [];

    // Email de félicitations
    if (assignee?.email) {
      notifications.push(sendNotification({
        type: 'email',
        recipient: assignee.email,
        subject: `🎉 Tâche terminée: ${task.title}`,
        message: `
          <h3>🎉 Félicitations ! Tâche terminée</h3>
          <p><strong>Titre:</strong> ${task.title}</p>
          <p><strong>Projet:</strong> ${project.name}</p>
          <p><strong>Terminée le:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          <p>Excellent travail ! 🚀</p>
        `,
        priority: 'low',
        taskId: task.id,
        projectId: project.id
      }));
    }

    // Slack célébration
    if (project.type === 'Slack') {
      notifications.push(sendNotification({
        type: 'slack',
        recipient: `#${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        message: `
🎉 *Tâche terminée !*
✅ *${task.title}*
👏 Félicitations à *${assignee?.name || 'l\'équipe'}* !
🎯 Projet: ${project.name}
        `,
        priority: 'low',
        taskId: task.id,
        projectId: project.id
      }));
    }

    return Promise.all(notifications);
  };

  const notifyOverdueTasks = async (overdueTasks: any[], project: any) => {
    // Notification des tâches en retard (à automatiser avec un cron job)
    for (const task of overdueTasks) {
      await sendNotification({
        type: 'email',
        recipient: task.assignee?.email || 'manager@company.com',
        subject: `⚠️ Tâche en retard: ${task.title}`,
        message: `
          <h3>⚠️ Attention: Tâche en retard</h3>
          <p><strong>Titre:</strong> ${task.title}</p>
          <p><strong>Date d'échéance:</strong> ${task.dueDate}</p>
          <p><strong>Retard de:</strong> ${Math.ceil((Date.now() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24))} jours</p>
          <p>Merci de traiter cette tâche en priorité.</p>
        `,
        priority: 'high',
        taskId: task.id,
        projectId: project.id
      });
    }
  };

  return {
    loading,
    status,
    sendNotification,
    checkIntegrationsStatus,
    // Notifications prédéfinies
    notifyTaskCreated,
    notifyTaskUpdated, 
    notifyTaskCompleted,
    notifyOverdueTasks
  };
}
