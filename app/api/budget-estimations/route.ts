import { NextRequest, NextResponse } from 'next/server';

/**
 * API pour les estimations budgétaires de projets
 * Calcul automatique basé sur les tâches, story points et vélocité
 */

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

// Configuration par défaut
const DEFAULT_CONFIG = {
  hourlyRate: 75, // €/heure par défaut
  hoursPerStoryPoint: 4, // Heures par story point
  currency: 'EUR' as 'MAD' | 'EUR' | 'USD',
  exchangeRates: {
    MAD: 1,     // Dirham marocain (base)
    EUR: 10.8,  // 1 EUR = ~10.8 MAD
    USD: 10.1   // 1 USD = ~10.1 MAD
  },
  riskFactors: {
    low: 1.1,    // +10%
    medium: 1.25, // +25% 
    high: 1.5    // +50%
  }
};

// GET /api/budget-estimations - Récupère les estimations pour tous les projets ou un projet spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    
    console.log("🔄 Calcul des estimations budgétaires...");

    // Récupération des projets
    const projectsResponse = await fetch(`${request.nextUrl.origin}/api/mcp/projects`);
    const projectsData = await projectsResponse.json();
    const projects = projectsData.projects || [];

    // Récupération des tâches
    const tasksResponse = await fetch(`${request.nextUrl.origin}/api/mcp/tasks`);
    const tasksData = await tasksResponse.json();
    const tasks = tasksData.tasks || [];

    // Si un projet spécifique est demandé
    if (projectId) {
      const project = projects.find((p: any) => p.id === projectId);
      if (!project) {
        return NextResponse.json({
          success: false,
          error: 'Projet non trouvé'
        }, { status: 404 });
      }

      const estimation = calculateProjectEstimation(project, tasks);
      return NextResponse.json({
        success: true,
        estimation,
        source: 'calculated'
      });
    }

    // Calcul pour tous les projets
    const estimations: BudgetEstimation[] = projects.map((project: any) => {
      return calculateProjectEstimation(project, tasks);
    });

    // Tri par coût décroissant
    estimations.sort((a: BudgetEstimation, b: BudgetEstimation) => b.adjustedCost - a.adjustedCost);

    return NextResponse.json({
      success: true,
      estimations,
      totalProjects: estimations.length,
      totalBudget: estimations.reduce((sum: number, est: BudgetEstimation) => sum + est.adjustedCost, 0),
      source: 'calculated'
    });

  } catch (error) {
    console.error("❌ Erreur calcul estimations:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de calcul'
    }, { status: 500 });
  }
}

// POST /api/budget-estimations - Met à jour la configuration d'estimation
export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    console.log("🔄 Mise à jour configuration budget:", config);

    // Validation de la configuration
    if (config.hourlyRate && (config.hourlyRate < 10 || config.hourlyRate > 1000)) {
      return NextResponse.json({
        success: false,
        error: 'Taux horaire invalide (10-1000€)'
      }, { status: 400 });
    }

    // Ici on pourrait sauvegarder la config en base
    // Pour l'instant on retourne juste la config mise à jour
    
    return NextResponse.json({
      success: true,
      config: {
        ...DEFAULT_CONFIG,
        ...config
      }
    });

  } catch (error) {
    console.error("❌ Erreur mise à jour config:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de mise à jour'
    }, { status: 500 });
  }
}

// Fonction de calcul d'estimation pour un projet
function calculateProjectEstimation(project: any, allTasks: any[]): BudgetEstimation {
  // Filtrer les tâches du projet
  const projectTasks = allTasks.filter(task => 
    task.projectId === parseInt(project.id) || task.projectId === project.id
  );

  // Calculs de base
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter(task => 
    task.status === 'Terminé' || task.status === 'Done'
  ).length;

  // Story points (simulés si pas de champ spécifique)
  const totalStoryPoints = projectTasks.reduce((sum, task) => {
    // Estimation basée sur la priorité
    const priorityPoints = {
      'Faible': 1,
      'Moyenne': 3,
      'Élevée': 5,
      'Critique': 8
    };
    return sum + (priorityPoints[task.priority as keyof typeof priorityPoints] || 3);
  }, 0);

  const completedStoryPoints = projectTasks
    .filter(task => task.status === 'Terminé' || task.status === 'Done')
    .reduce((sum, task) => {
      const priorityPoints = {
        'Faible': 1,
        'Moyenne': 3,
        'Élevée': 5,
        'Critique': 8
      };
      return sum + (priorityPoints[task.priority as keyof typeof priorityPoints] || 3);
    }, 0);

  // Calculs budgétaires
  const estimatedHours = totalStoryPoints * DEFAULT_CONFIG.hoursPerStoryPoint;
  const totalCost = estimatedHours * DEFAULT_CONFIG.hourlyRate;
  const remainingStoryPoints = totalStoryPoints - completedStoryPoints;
  const remainingCost = remainingStoryPoints * DEFAULT_CONFIG.hoursPerStoryPoint * DEFAULT_CONFIG.hourlyRate;

  // Vélocité (pourcentage de completion)
  const velocity = totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0;

  // Facteur de risque basé sur la vélocité et le nombre de tâches
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  if (velocity > 70 && totalTasks < 10) riskLevel = 'low';
  else if (velocity < 30 || totalTasks > 20) riskLevel = 'high';

  const riskFactor = DEFAULT_CONFIG.riskFactors[riskLevel];
  const adjustedCost = totalCost * riskFactor;

  // Estimation de date de completion
  const averageTasksPerWeek = completedTasks > 0 ? completedTasks : 1;
  const remainingTasks = totalTasks - completedTasks;
  const weeksToComplete = Math.ceil(remainingTasks / averageTasksPerWeek);
  const estimatedCompletionDate = new Date(Date.now() + weeksToComplete * 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  return {
    projectId: project.id,
    projectName: project.name,
    totalTasks,
    totalStoryPoints,
    completedStoryPoints,
    estimatedHours,
    hourlyRate: DEFAULT_CONFIG.hourlyRate,
    currency: DEFAULT_CONFIG.currency,
    totalCost: Math.round(totalCost),
    remainingCost: Math.round(remainingCost),
    velocity: Math.round(velocity),
    estimatedCompletionDate,
    riskFactor,
    adjustedCost: Math.round(adjustedCost)
  };
}
