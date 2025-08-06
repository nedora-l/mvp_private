import { Building } from "lucide-react";
import { monthlyData } from "@/lib/mock-data/common";

import { Card,  CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PartnershipsTable() {
  const totalDeals = Object.values(monthlyData.partnerships).reduce((sum, p) => sum + p.deals, 0);
  const totalRevenue = Object.values(monthlyData.partnerships).reduce((sum, p) => sum + p.revenue, 0);

  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-indigo-600">
          <Building className="h-5 w-5" />
          Performance Partenariats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Total Deals</div>
              <div className="text-lg font-bold text-indigo-600">{totalDeals}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Revenus Partenaires</div>
              <div className="text-lg font-bold text-green-600">{(totalRevenue / 1000000).toFixed(1)}M MAD</div>
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(monthlyData.partnerships).map(([partner, data]) => (
              <div key={partner} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded group">
                <span className="text-sm text-gray-600 font-medium">{partner.charAt(0).toUpperCase() + partner.slice(1)}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-indigo-600">{data.deals} deals</span>
                  <span className="text-xs text-green-600">{(data.revenue / 1000).toFixed(0)}k MAD</span>
                  <span className="text-xs text-blue-600">+{data.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
