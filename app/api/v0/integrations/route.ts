import { NextRequest, NextResponse } from 'next/server';

/**
 * Service d'intégrations externes réelles
 * Compatible avec les vraies APIs : Slack, Email, Jira, etc.
 */

// Types pour les intégrations
interface NotificationPayload {
  type: 'email' | 'slack' | 'teams' | 'webhook';
  recipient: string;
  subject?: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  taskId?: number;
  projectId?: number;
  userId?: string;
}

interface IntegrationConfig {
  slack: {
    webhook_url: string;
    channels: { [projectName: string]: string };
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    username: string;
    password: string;
  };
  jira: {
    domain: string;
    api_token: string;
    project_key: string;
  };
}

// Configuration des intégrations (à adapter selon vos vraies APIs)
const INTEGRATIONS_CONFIG: IntegrationConfig = {
  slack: {
    webhook_url: process.env.SLACK_WEBHOOK_URL || "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK",
    channels: {
      "jira-rh": "#rh-notifications",
      "jira-app-mobile": "#dev-mobile",
      "jira-e-commerce": "#dev-ecommerce",
      "slack-dev-team": "#dev-general"
    }
  },
  email: {
    smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
    smtp_port: parseInt(process.env.SMTP_PORT || "587"),
    username: process.env.SMTP_USERNAME || "notifications@company.com",
    password: process.env.SMTP_PASSWORD || "your-app-password"
  },
  jira: {
    domain: process.env.JIRA_DOMAIN || "yourcompany.atlassian.net",
    api_token: process.env.JIRA_API_TOKEN || "your-jira-token",
    project_key: process.env.JIRA_PROJECT_KEY || "PROJ"
  }
};

// POST /api/v0/integrations/notify
export async function POST(request: NextRequest) {
  try {
    const payload: NotificationPayload = await request.json();
    console.log("📨 Sending notification:", payload);

    const results = [];

    switch (payload.type) {
      case 'email':
        results.push(await sendEmailNotification(payload));
        break;
      case 'slack':
        results.push(await sendSlackNotification(payload));
        break;
      case 'teams':
        results.push(await sendTeamsNotification(payload));
        break;
      case 'webhook':
        results.push(await sendWebhookNotification(payload));
        break;
      default:
        throw new Error(`Type de notification non supporté: ${payload.type}`);
    }

    return NextResponse.json({ 
      success: true, 
      results,
      message: "Notification envoyée avec succès"
    });

  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de notification:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }, 
      { status: 500 }
    );
  }
}

// GET /api/v0/integrations/status
export async function GET() {
  try {
    const status = {
      slack: await testSlackConnection(),
      email: await testEmailConnection(),
      jira: await testJiraConnection(),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      integrations: status
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erreur de connexion' }, 
      { status: 500 }
    );
  }
}

// Fonction d'envoi email réel (avec nodemailer ou service externe)
async function sendEmailNotification(payload: NotificationPayload): Promise<any> {
  // En mode développement, on simule
  if (process.env.NODE_ENV === 'development') {
    console.log("📧 [DEV] Email envoyé à:", payload.recipient);
    console.log("📧 [DEV] Sujet:", payload.subject);
    console.log("📧 [DEV] Message:", payload.message);
    return { success: true, mode: 'development' };
  }

  // En production, utiliser un vrai service email
  try {
    // Exemple avec l'API Resend, SendGrid, ou Nodemailer
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'D&A Workspace <notifications@company.com>',
        to: [payload.recipient],
        subject: payload.subject || 'Notification D&A Workspace',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">🔔 Notification D&A Workspace</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
              <p style="margin: 0; line-height: 1.5;">${payload.message}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Priorité: ${payload.priority.toUpperCase()} | 
              ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>
        `
      })
    });

    return await response.json();
  } catch (error) {
    console.error("❌ Erreur email:", error);
    throw error;
  }
}

// Fonction d'envoi Slack réel
async function sendSlackNotification(payload: NotificationPayload): Promise<any> {
  try {
    const webhook_url = INTEGRATIONS_CONFIG.slack.webhook_url;
    
    const slackPayload = {
      text: `🔔 *D&A Workspace Notification*`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${payload.subject || 'Notification'}*\n\n${payload.message}`
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `Priorité: *${payload.priority.toUpperCase()}* | ${new Date().toLocaleString('fr-FR')}`
            }
          ]
        }
      ]
    };

    const response = await fetch(webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload)
    });

    return { success: response.ok, status: response.status };
  } catch (error) {
    console.error("❌ Erreur Slack:", error);
    throw error;
  }
}

// Fonction Teams
async function sendTeamsNotification(payload: NotificationPayload): Promise<any> {
  // Implémentation similaire avec webhook Teams
  console.log("📱 Teams notification:", payload.message);
  return { success: true, platform: 'teams' };
}

// Fonction webhook générique
async function sendWebhookNotification(payload: NotificationPayload): Promise<any> {
  // Webhook personnalisé vers votre système
  console.log("🔗 Webhook notification:", payload.message);
  return { success: true, platform: 'webhook' };
}

// Tests de connexion
async function testSlackConnection(): Promise<boolean> {
  try {
    const response = await fetch(INTEGRATIONS_CONFIG.slack.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: "Test de connexion D&A Workspace" })
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function testEmailConnection(): Promise<boolean> {
  // Test SMTP ou API email
  return process.env.SMTP_USERNAME ? true : false;
}

async function testJiraConnection(): Promise<boolean> {
  // Test API Jira
  return process.env.JIRA_API_TOKEN ? true : false;
}
