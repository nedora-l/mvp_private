import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Calendar,
  FileText,
  Award,
  Clock,
  DollarSign,
  Clipboard,
  Download,
  ChevronRight,
} from "lucide-react"

import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component"

export default function HRPage({ params }: BasePageProps ) {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">HR Portal</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center">
            <Award className="mr-2 h-4 w-4" />
            Avantages
          </TabsTrigger>
          <TabsTrigger value="timeoff" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Congés
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Formulaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solde de Congés</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 jours</div>
                <p className="text-xs text-muted-foreground">Vacances: 10 jours, Maladie: 5 jours</p>
                <Button variant="link" className="px-0 text-xs mt-2">
                  Demander un congé
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prochain Congé</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 Juillet 2023</div>
                <p className="text-xs text-muted-foreground">Approuvé</p>
                <Button variant="link" className="px-0 text-xs mt-2">
                  Voir les talons de paie
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inscription aux Avantages</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Actif</div>
                <p className="text-xs text-muted-foreground">Prochaine inscription: 1-15 Nov</p>
                <Button variant="link" className="px-0 text-xs mt-2">
                  Consulter les avantages
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bilan de Performance</CardTitle>
                <Clipboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 Août 2023</div>
                <p className="text-xs text-muted-foreground">Bilan de mi-année</p>
                <Button variant="link" className="px-0 text-xs mt-2">
                  Préparer l'auto-évaluation
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Prochains Congés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Vacances d'été", dates: "24-28 Juillet 2023", status: "Approuvé", days: 5 },
                    { name: "Journée Personnelle", dates: "15 Août 2023", status: "En attente", days: 1 },
                  ].map((timeOff, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{timeOff.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{timeOff.dates}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            timeOff.status === "Approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {timeOff.status === "Approved" ? "Approuvé" : "En attente"}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {timeOff.days} {timeOff.days === 1 ? "jour" : "jours"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Voir Tous les Congés
                </Button>
              </CardContent>
            </Card>

            <Card >
              <CardHeader>
                <CardTitle>Annonces RH</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Ouverture Prochaine des Inscriptions",
                      date: "10 Juillet 2023",
                      content:
                        "L'inscription annuelle aux avantages sociaux débutera le 1er novembre. Des séances d'information auront lieu tout au long du mois d'octobre.",
                    },
                    {
                      title: "Nouvelle Politique de Congé Parental",
                      date: "28 Juin 2023",
                      content:
                        "Nous sommes heureux d'annoncer notre politique de congé parental améliorée, offrant 16 semaines de congé payé à tous les nouveaux parents.",
                    },
                    {
                      title: "Horaires d'été",
                      date: "15 Juin 2023",
                      content: "Les horaires d'été (9h à 16h le vendredi) seront en vigueur du 1er juillet au 1er septembre.",
                    },
                  ].map((announcement, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <span className="text-sm text-muted-foreground">{announcement.date}</span>
                      </div>
                      <p className="text-muted-foreground">{announcement.content}</p>
                      <Button variant="link" className="px-0 mt-2">
                        Lire la suite <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Vos Avantages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Assurance Santé",
                      provider: "Blue Cross Blue Shield",
                      plan: "PPO Plan Familial",
                      status: "Actif",
                      icon: "🏥",
                    },
                    {
                      title: "Assurance Dentaire",
                      provider: "Delta Dental",
                      plan: "Plan Familial Complet",
                      status: "Actif",
                      icon: "🦷",
                    },
                    {
                      title: "Assurance Vision",
                      provider: "VSP",
                      plan: "Plan Premium",
                      status: "Actif",
                      icon: "👁️",
                    },
                    {
                      title: "Retraite 401(k)",
                      provider: "Fidelity",
                      plan: "Correspondance de l'entreprise jusqu'à 6%",
                      status: "Inscrit",
                      icon: "💰",
                    },
                    {
                      title: "Assurance Vie",
                      provider: "MetLife",
                      plan: "2x Salaire Annuel",
                      status: "Actif",
                      icon: "🛡️",
                    },
                    {
                      title: "Assurance Invalidité",
                      provider: "Guardian",
                      plan: "Court et Long Terme",
                      status: "Actif",
                      icon: "🩺",
                    },
                  ].map((benefit) => (
                    <Card key={benefit.title} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{benefit.icon}</span>
                            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-1 rounded-full">
                              {benefit.status}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                          <p className="text-sm text-muted-foreground">{benefit.provider}</p>
                          <p className="text-sm">{benefit.plan}</p>
                        </div>
                        <div className="bg-muted p-3 flex justify-between items-center">
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Voir les Détails
                          </Button>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Carte d'identité
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Avantages Supplémentaires</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Programme de Bien-être",
                        description: "Accès à des réductions de gym, des défis de bien-être et des ressources de santé.",
                      },
                      {
                        title: "Programme d'Aide aux Employés",
                        description: "Services confidentiels de conseil et de soutien pour vous et votre famille.",
                      },
                      {
                        title: "Développement Professionnel",
                        description: "Allocation annuelle de 2 000 $ pour les cours, les conférences et les certifications.",
                      },
                      {
                        title: "Avantages de Transport",
                        description: "Déductions avant impôts pour les transports en commun et les frais de stationnement.",
                      },
                    ].map((benefit) => (
                      <div key={benefit.title} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <h4 className="font-medium">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                        <Button variant="link" className="ml-auto">
                          En savoir plus
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeoff">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Solde de Congés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Vacances", used: 5, total: 15, color: "bg-blue-500" },
                    { type: "Congé de Maladie", used: 2, total: 7, color: "bg-green-500" },
                    { type: "Jours Personnels", used: 1, total: 3, color: "bg-purple-500" },
                  ].map((balance) => (
                    <div key={balance.type}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{balance.type}</span>
                        <span>
                          {balance.used} / {balance.total} jours
                        </span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${balance.color}`}
                          style={{ width: `${(balance.used / balance.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6">Demander un Congé</Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Demandes de Congés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "Vacances",
                      dates: "24-28 Juillet 2023",
                      days: 5,
                      status: "Approuvé",
                      requestedOn: "10 Juin 2023",
                      approvedBy: "Lisa Brown",
                    },
                    {
                      type: "Journée Personnelle",
                      dates: "15 Août 2023",
                      days: 1,
                      status: "En attente",
                      requestedOn: "5 Juillet 2023",
                      approvedBy: null,
                    },
                    {
                      type: "Congé de Maladie",
                      dates: "5 Juin 2023",
                      days: 1,
                      status: "Pris",
                      requestedOn: "5 Juin 2023",
                      approvedBy: "Système",
                    },
                  ].map((request, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{request.type}</h3>
                          <span
                            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              request.status === "Approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : request.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {request.status === "Approved" ? "Approuvé" : request.status === "Pending" ? "En attente" : "Pris"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{request.dates}</span>
                          <span className="mx-1">•</span>
                          <span>
                            {request.days} {request.days === 1 ? "jour" : "jours"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Demandé le {request.requestedOn}
                          {request.approvedBy && ` • Approuvé par ${request.approvedBy}`}
                        </p>
                      </div>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                        {request.status === "Pending" && (
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                            Annuler
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Jours Fériés de l'Entreprise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Jour de l'An", date: "1 Janvier 2023", past: true },
                  { name: "Jour de Martin Luther King Jr.", date: "16 Janvier 2023", past: true },
                  { name: "Jour des Présidents", date: "20 Février 2023", past: true },
                  { name: "Jour du Souvenir", date: "29 Mai 2023", past: true },
                  { name: "Jour de l'Indépendance", date: "4 Juillet 2023", past: true },
                  { name: "Fête du Travail", date: "4 Septembre 2023", past: false },
                  { name: "Jour de Thanksgiving", date: "23 Novembre 2023", past: false },
                  { name: "Le lendemain de Thanksgiving", date: "24 Novembre 2023", past: false },
                  { name: "Jour de Noël", date: "25 Décembre 2023", past: false },
                ].map((holiday) => (
                  <Card key={holiday.name} className={holiday.past ? "opacity-60" : ""}>
                    <CardContent className="p-4 flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{holiday.name}</h3>
                        <p className="text-sm text-muted-foreground">{holiday.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
 
        <TabsContent value="forms">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Formulaires RH",
                description: "Formulaires courants pour les demandes et la documentation liées aux RH",
                forms: [
                  { name: "Mise à Jour des Informations Personnelles", type: "pdf" },
                  { name: "Autorisation de Dépôt Direct", type: "pdf" },
                  { name: "Informations sur les Contacts d'Urgence", type: "pdf" },
                  { name: "Demande de Changement de Nom", type: "pdf" },
                ],
              },
              {
                title: "Formulaires d'Avantages Sociaux",
                description: "Formulaires liés aux avantages sociaux et à l'inscription des employés",
                forms: [
                  { name: "Formulaire d'Inscription aux Avantages Sociaux", type: "pdf" },
                  { name: "Changement de Contribution 401(k)", type: "pdf" },
                  { name: "Renonciation à l'Assurance Maladie", type: "pdf" },
                  { name: "Formulaire de Couverture des Personnes à Charge", type: "pdf" },
                ],
              },
              {
                title: "Congés et Absences",
                description: "Formulaires pour demander des congés et des absences",
                forms: [
                  { name: "Formulaire de Demande de Vacances", type: "pdf" },
                  { name: "Demande de Congé de Maladie", type: "pdf" },
                  { name: "Demande de FMLA", type: "pdf" },
                  { name: "Demande de Congé Parental", type: "pdf" },
                ],
              },
              {
                title: "Dépenses et Remboursements",
                description: "Formulaires pour soumettre des dépenses et des demandes de remboursement",
                forms: [
                  { name: "Modèle de Rapport de Dépenses", type: "xlsx" },
                  { name: "Formulaire de Remboursement des Frais de Voyage", type: "pdf" },
                  { name: "Journal de Bord Kilométrique", type: "xlsx" },
                  { name: "Demande de Petite Caisse", type: "pdf" },
                ],
              },
              {
                title: "Performance et Développement",
                description: "Formulaires liés à la performance des employés et au développement de carrière",
                forms: [
                  { name: "Modèle d'Évaluation de la Performance", type: "docx" },
                  { name: "Formulaire d'Auto-évaluation", type: "pdf" },
                  { name: "Formulaire de Demande de Formation", type: "pdf" },
                  { name: "Plan de Développement de Carrière", type: "docx" },
                ],
              },
              {
                title: "Politiques et Procédures",
                description: "Politiques et documents de procédure importants de l'entreprise",
                forms: [
                  { name: "Manuel de l'Employé", type: "pdf" },
                  { name: "Code de Conduite", type: "pdf" },
                  { name: "Politique de Sécurité Informatique", type: "pdf" },
                  { name: "Politique de Voyage", type: "pdf" },
                ],
              },
            ].map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <div className="space-y-2">
                    {category.forms.map((form) => (
                      <div key={form.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{form.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
