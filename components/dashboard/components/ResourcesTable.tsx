import { Users, Eye, Sparkles } from "lucide-react";
import { monthlyData } from "@/lib/mock-data/common";

import { Card,  CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ResourcesTable() {
  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-purple-600">
          <Users className="h-5 w-5" />
          Disponibilité Ressources par Service
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">En Mission</div>
              <div className="text-lg font-bold text-green-600">
                {monthlyData.resources.onMission}
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Disponibles</div>
              <div className="text-lg font-bold text-orange-600">
                {monthlyData.resources.availableConsultants}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <ResourceRow label="Transformation Digitale" mission={8} dispo={2} />
            <ResourceRow label="Data & Analytics" mission={6} dispo={3} />
            <ResourceRow label="Intelligence Artificielle" mission={7} dispo={4} />
            <ResourceRow label="CRM & Expérience Client" mission={4} dispo={2} />
            <ResourceRow label="Cloud & Intégration" mission={5} dispo={1} />
            <ResourceRow label="Taux d'utilisation global" mission={monthlyData.resources.currentUtilization} dispo={null} borderTop />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceRow({ label, mission, dispo, borderTop = false }: { label: string; mission: number; dispo: number | null; borderTop?: boolean }) {
  return (
    <div className={`flex justify-between items-center p-2 hover:bg-gray-50 rounded group${borderTop ? " border-t pt-3" : ""}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {dispo !== null ? (
            <>
              <span className="text-xs text-green-600">{mission} en mission</span>
              <span className="text-xs text-orange-600">{dispo} dispo</span>
            </>
          ) : (
            <span className="text-xs text-blue-600">{mission}%</span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-blue-100" title="Voir le détail">
            <Eye className="h-3 w-3 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-purple-100" title="Résumé IA">
            <Sparkles className="h-3 w-3 text-purple-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
