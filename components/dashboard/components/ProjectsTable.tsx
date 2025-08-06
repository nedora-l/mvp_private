import { FolderOpen, Eye, Sparkles } from "lucide-react";
import { monthlyData } from "@/lib/mock-data/common";

import { Card,  CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProjectsTable() {
  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <FolderOpen className="h-5 w-5" />
          Projets - État Actuel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Heures Facturables</div>
              <div className="text-lg font-bold text-blue-600">
                {monthlyData.productivity.billableHours.toLocaleString()}h
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Marge Moyenne</div>
              <div className="text-lg font-bold text-purple-600">
                {monthlyData.productivity.averageProjectMargin}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <ProjectsRow label="Projets actifs" value={monthlyData.productivity.projectsActive} valueClass="text-blue-600" />
            <ProjectsRow label="Projets terminés" value={monthlyData.productivity.projectsCompleted} valueClass="text-green-600" />
            <ProjectsRow label="Projets en retard" value={monthlyData.productivity.projectsDelayed} valueClass="text-red-600" />
            <ProjectsRow label="Satisfaction client" value={`${monthlyData.productivity.clientSatisfaction}/5`} valueClass="text-gray-900" borderTop isSatisfaction satisfaction={monthlyData.productivity.clientSatisfaction} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsRow({ label, value, valueClass = "", borderTop = false, isSatisfaction = false, satisfaction = 0 }: { label: string; value: React.ReactNode; valueClass?: string; borderTop?: boolean; isSatisfaction?: boolean; satisfaction?: number }) {
  return (
    <div className={`flex justify-between items-center p-2 hover:bg-gray-50 rounded group${borderTop ? " border-t pt-3" : ""}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className={`font-semibold ${valueClass}`}>{value}</span>
          {isSatisfaction && (
            <div className="flex gap-1 ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-2 h-2 rounded-full ${star <= Math.floor(satisfaction) ? "bg-yellow-400" : "bg-gray-200"}`}
                ></div>
              ))}
            </div>
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
