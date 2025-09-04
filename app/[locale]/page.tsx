export default function Home() {
  // ✅ NOUVEAU : Page d'accueil complètement indépendante
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🚀 Bienvenue à DA Workspace
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Plateforme de gestion de projets et de workflows
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card rounded-lg border">
              <h2 className="text-xl font-semibold mb-3">📋 Gestion de Projets</h2>
              <p className="text-muted-foreground mb-4">
                Gérez vos projets Jira avec une interface moderne et intuitive
              </p>
              <a 
                href="/fr/apps/projects"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Accéder aux Projets
              </a>
            </div>
            
            <div className="p-6 bg-card rounded-lg border">
              <h2 className="text-xl font-semibold mb-3">🚀 Workflows</h2>
              <p className="text-muted-foreground mb-4">
                Créez et gérez vos workflows métier avec Camunda
              </p>
              <a 
                href="/fr/apps/workflows"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Accéder aux Workflows
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>✅ Subtasks dynamiques activées</p>
            <p>✅ APIs Jira synchronisées</p>
            <p>✅ Interface utilisateur optimisée</p>
          </div>
        </div>
      </div>
    </div>
  );
}