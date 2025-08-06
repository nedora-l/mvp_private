import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  CreditCard,
  PieChart as PieChartIconLucide,
  ArrowRightLeft,
  ArrowLeftRight,
  Download,
  BookCopy,
  Landmark,
  Target,
  Settings,
  FileText,
  Users,
  Briefcase,
  Receipt,
  BarChart3,
  Link as LinkIcon,
  ChevronRight,
  AlertTriangle,
  Info as InfoIcon,
  XCircle,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"

// Helper component for metric cards
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  subtext?: string;
  icon: React.ElementType; // Changed from icon: Icon to icon: React.ElementType
}

function MetricCard({ title, value, change, subtext, icon: IconComponent }: MetricCardProps) { // Changed icon to IconComponent
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconComponent className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && <p className={`text-xs ${change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{change}</p>}
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  )
}

// Helper component for Alert items
interface AlertItemProps {
    type: "info" | "warning" | "error" | "success";
    message: string;
    actionHref?: string;
}
function AlertItem({ type, message, actionHref }: AlertItemProps) {
    const IconComponent = type === "warning" ? AlertTriangle :
                 type === "info" ? InfoIcon :
                 type === "error" ? XCircle : CheckCircle2;
    const colors = {
        warning: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
        info: "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        error: "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        success: "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    }

    return (
        <div className={`p-3 border-l-4 ${colors[type]} rounded-r-md flex items-center justify-between`}>
            <div className="flex items-center">
                <IconComponent className={`h-5 w-5 mr-3`} />
                <p className="text-sm">{message}</p>
            </div>
            {actionHref && (
                <Link href={actionHref} passHref>
                    <Button variant="ghost" size="sm" className="text-xs">
                        Voir <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                </Link>
            )}
        </div>
    )
}


export default function ComptaPage({ params: { locale } }: BasePageProps ) {
  const basePath = `/${locale}/apps/compta`;

  // Mock data - replace with actual data fetching
  const overviewStats = {
    totalRevenue: "1,250,345.67 MAD",
    revenueChange: "+15.2%",
    totalExpenses: "750,123.45 MAD",
    expensesChange: "+8.1%",
    netProfit: "500,222.22 MAD",
    netProfitChange: "+22.5%",
    accountsPayable: "125,678.90 MAD",
    pendingPayablesCount: 3,
    accountsReceivable: "210,450.75 MAD",
    pendingReceivablesCount: 5,
  };

  const quickAccessLinks = [
    { href: `${basePath}/chart-of-accounts`, label: "Plan Comptable", icon: BookCopy, description: "Consulter et gérer le plan des comptes." },
    { href: `${basePath}/invoices`, label: "Factures Ventes", icon: FileText, description: "Créer et suivre les factures clients." },
    { href: `${basePath}/payables`, label: "Factures Achats", icon: Briefcase, description: "Gérer les factures fournisseurs." },
    { href: `${basePath}/receivables`, label: "Suivi Clients", icon: Users, description: "Suivre les paiements et relances." },
    { href: `${basePath}/banking`, label: "Banque & Caisse", icon: Landmark, description: "Gérer les transactions et rapprochements." },
    { href: `${basePath}/expenses`, label: "Notes de Frais", icon: Receipt, description: "Soumettre et approuver les dépenses." },
    { href: `${basePath}/reports`, label: "Rapports Financiers", icon: PieChartIconLucide, description: "Générer les états financiers." },
    { href: `${basePath}/budgeting`, label: "Budgétisation", icon: Target, description: "Planifier et suivre les budgets." },
    { href: `${basePath}/settings`, label: "Paramètres Compta", icon: Settings, description: "Configurer les options comptables." },
  ];

  const recentActivityMock = [
      { type: "Facture Client", desc: "Facture FC-2025-0078 envoyée à Tech Solutions", amount: "+ 2,500.00 MAD", time: "Il y a 15min", icon: FileText, color: "green" },
      { type: "Paiement Fournisseur", desc: "Paiement pour facture FF-2025-015 à Web Services Inc.", amount: "- 850.00 MAD", time: "Il y a 1h", icon: Briefcase, color: "red" },
      { type: "Note de Frais", desc: "Dépense \'Déjeuner Client X\' par A. Dupont approuvée", amount: "- 180.50 MAD", time: "Il y a 3h", icon: Receipt, color: "red" },
      { type: "Encaissement", desc: "Paiement reçu pour facture FC-2025-0075 de Digital Corp", amount: "+ 1,200.00 MAD", time: "Hier", icon: DollarSign, color: "green" },
      { type: "Nouvelle Dépense", desc: "Note de frais \'Transport\' soumise par B. Karia", amount: "- 75.00 MAD", time: "Hier", icon: CreditCard, color: "red" },
  ];


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Tableau de Bord Comptabilité
        </h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Exporter Vue d\'Ensemble
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard title="Revenus Totals (Mois)" value={overviewStats.totalRevenue} change={overviewStats.revenueChange} icon={DollarSign} />
        <MetricCard title="Dépenses Totales (Mois)" value={overviewStats.totalExpenses} change={overviewStats.expensesChange} icon={CreditCard} />
        <MetricCard title="Bénéfice Net (Mois)" value={overviewStats.netProfit} change={overviewStats.netProfitChange} icon={PieChartIconLucide} />
        <MetricCard title="Factures Achats en Attente" value={overviewStats.accountsPayable} subtext={`${overviewStats.pendingPayablesCount} factures`} icon={ArrowRightLeft} />
        <MetricCard title="Factures Ventes en Attente" value={overviewStats.accountsReceivable} subtext={`${overviewStats.pendingReceivablesCount} factures`} icon={ArrowLeftRight} />
      </div>

      {/* Quick Access Navigation */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Accès Rapide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickAccessLinks.map((link) => (
            <Link href={link.href} key={link.href} passHref>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col justify-between group">
                <CardHeader className="pb-3">
                  <link.icon className="h-7 w-7 mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle className="text-md font-semibold">{link.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                </CardContent>
                 <CardFooter className="p-3 pt-0">
                    <Button variant="ghost" size="sm" className="text-xs w-full justify-start p-0 h-auto">
                        Accéder <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      <Tabs defaultValue="visualizations" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
          <TabsTrigger value="visualizations">Visualisations Clés</TabsTrigger>
          <TabsTrigger value="recentActivity">Activité Récente</TabsTrigger>
          <TabsTrigger value="alerts">Alertes & Tâches</TabsTrigger>
        </TabsList>

        <TabsContent value="visualizations">
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Evolution du Flux de Trésorerie (Annuel)</CardTitle>
                <CardDescription>Comparaison des entrées et sorties mensuelles.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center bg-muted/20 dark:bg-muted/50 rounded-md">
                {/* Placeholder for Cash Flow Chart - Replace with actual chart component */}
                <div className="text-center">
                    <BarChart3 className="h-20 w-20 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-muted-foreground">Graphique de flux de trésorerie à venir.</p>
                    <p className="text-xs text-muted-foreground/70">Intégration Recharts prochainement.</p>
                </div>
              </CardContent>
            </Card>
            {/* Add more chart cards here, e.g., Profit/Loss, Expense Breakdown */}
          </div>
        </TabsContent>

        <TabsContent value="recentActivity">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Derniers Mouvements Enregistrés</CardTitle>
              <CardDescription>Factures créées, paiements reçus/effectués, dépenses soumises.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivityMock.map((activity, i) => {
                  const ActivityIcon = activity.icon;
                  const iconColorClass = activity.color === "green" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
                  const bgColorClass = activity.color === "green" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30";

                  return (
                    <div key={i} className="flex items-center p-3 hover:bg-muted/30 dark:hover:bg-muted/20 rounded-md transition-colors">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${bgColorClass}`}>
                        <ActivityIcon className={`h-5 w-5 ${iconColorClass}`} />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium leading-none">{activity.type}</p>
                        <p className="text-xs text-muted-foreground max-w-md truncate">{activity.desc}</p>
                      </div>
                      <div className="ml-auto text-right flex-shrink-0">
                          <p className={`text-sm font-semibold ${iconColorClass}`}>{activity.amount}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
                <Button variant="outline" className="w-full mt-4">
                    Voir toute l\'activité <LinkIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Alertes et Tâches Prioritaires</CardTitle>
                    <CardDescription>Actions nécessitant votre attention.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-3">
                        <AlertItem type="warning" message="Facture Vente FC-2025-0065 en retard de 5 jours." actionHref={`${basePath}/receivables/REC-00X`} />
                        <AlertItem type="info" message="Budget Marketing T3 est à 85% d\'utilisation." actionHref={`${basePath}/budgeting/BUDGET-001`} />
                        <AlertItem type="error" message="Échec de la dernière tentative de synchronisation bancaire." actionHref={`${basePath}/banking`} />
                        <AlertItem type="success" message="Rapport de TVA pour Mai 2025 généré et prêt pour consultation." actionHref={`${basePath}/reports`} />
                        <AlertItem type="warning" message="Note de frais NDF-078 en attente d\'approbation depuis 3 jours." actionHref={`${basePath}/expenses`} />
                         <Button variant="outline" className="w-full mt-4">
                            Voir toutes les alertes <LinkIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
