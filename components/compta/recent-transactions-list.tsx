import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export function RecentTransactionsList() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Transactions Récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Paiement Fournisseur {String.fromCharCode(65 + i)}</p>
                <p className="text-sm text-muted-foreground">Aujourd\'hui</p>
              </div>
              <div className="ml-auto font-medium">- {Math.floor(Math.random() * 1000) + 50}.00 MAD</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
