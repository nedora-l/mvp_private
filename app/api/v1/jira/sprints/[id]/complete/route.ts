import { NextRequest, NextResponse } from 'next/server';

// Configuration Jira - Pattern établi dans l'architecture v1
const JIRA_CONFIG = {
  domain: process.env.JIRA_DOMAIN || "abarouzabarouz.atlassian.net",
  email: process.env.JIRA_EMAIL || "abarouzabarouz@gmail.com",
  token: process.env.JIRA_API_TOKEN || "",
};

// Headers pour authentification Jira
const getJiraHeaders = () => {
  const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

/**
 * API v1 - Terminer un sprint Jira
 * POST /api/v1/jira/sprints/[id]/complete
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🏁 [v1] Finalisation de sprint Jira...");
    
    const { id } = await params;
    
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ [v1] Token Jira manquant - Configuration requise");
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    // Terminer le sprint sur Jira
    const jiraUrl = `https://${JIRA_CONFIG.domain}/rest/agile/1.0/sprint/${id}`;
    const response = await fetch(jiraUrl, {
      method: 'POST',
      headers: getJiraHeaders(),
      body: JSON.stringify({
        state: 'closed',
        endDate: new Date().toISOString().split('T')[0],
        completeDate: new Date().toISOString().split('T')[0]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ [v1] Sprint ${id} terminé avec succès`);

    return NextResponse.json({
      status: 200,
      message: "Sprint terminé avec succès",
      data: { 
        sprintId: id, 
        state: 'closed',
        completed: new Date().toISOString()
      },
      type: "RECORD_UPDATED",
      source: 'jira'
    });

  } catch (error) {
    console.error("❌ [v1] Erreur lors de la finalisation du sprint:", error);
    
    return NextResponse.json({
      status: 500,
      message: "Erreur lors de la finalisation du sprint",
      data: null,
      type: "ERROR",
      source: 'sprint-complete-error',
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
