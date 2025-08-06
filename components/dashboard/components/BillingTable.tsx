import { DollarSign, Eye, Sparkles } from "lucide-react";
import { monthlyData } from "@/lib/mock-data/common";
import { Card,  CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BillingTable() {
  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-600">
          <DollarSign className="h-5 w-5" />
          Facturation - {monthlyData.currentMonth}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Revenus Totaux</div>
              <div className="text-lg font-bold text-green-600">
                {(monthlyData.billing.totalRevenue / 1000000).toFixed(2)}M MAD
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Revenus Récurrents</div>
              <div className="text-lg font-bold text-blue-600">
                {(monthlyData.billing.recurringRevenue / 1000000).toFixed(2)}M MAD
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <BillingRow label="Factures envoyées" value={monthlyData.billing.invoicesSent} />
            <BillingRow label="Factures payées" value={monthlyData.billing.invoicesPaid} valueClass="text-green-600" />
            <BillingRow label="En attente de paiement" value={monthlyData.billing.invoicesPending} valueClass="text-orange-600" />
            <BillingRow label="Délai moyen paiement" value={`${monthlyData.billing.averagePaymentDelay} jours`} valueClass="text-gray-900" borderTop />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BillingRow({ label, value, valueClass = "", borderTop = false }: { label: string; value: React.ReactNode; valueClass?: string; borderTop?: boolean }) {
  return (
    <div className={`flex justify-between items-center p-2 hover:bg-gray-50 rounded group${borderTop ? " border-t pt-3" : ""}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-semibold ${valueClass}`}>{value}</span>
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
