import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { HelpCircle } from "lucide-react";

export default function ComptaHelpPage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <HelpCircle className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Aide - Comptabilité</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Support et Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page fournira de l'aide et de la documentation pour le module de comptabilité.</p>
          {/* Placeholder for compta help content */}
          <div className="mt-4 p-4 bg-muted rounded-md">
            Contenu de l'aide pour la comptabilité à venir...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
