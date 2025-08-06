import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, PieChart, ArrowRightLeft } from "lucide-react";

export function TotalRevenueWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenus Totals</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,250,345.67 MAD</div>
        <p className="text-xs text-muted-foreground">
          +15.2% par rapport au mois dernier
        </p>
      </CardContent>
    </Card>
  );
}

export function TotalExpensesWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">750,123.45 MAD</div>
        <p className="text-xs text-muted-foreground">
          +8.1% par rapport au mois dernier
        </p>
      </CardContent>
    </Card>
  );
}

// Add more widgets as needed, e.g., NetProfitWidget, AccountsPayableWidget
