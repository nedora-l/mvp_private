import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Settings } from "lucide-react";

export default function ComptaSettingsPage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <Settings className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Paramètres de Comptabilité</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page permettra de configurer les paramètres spécifiques à la comptabilité.</p>
          {/* Placeholder for compta settings content */}
          <div className="mt-4 p-4 bg-muted rounded-md">
            Contenu des paramètres de comptabilité à venir...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
