import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { BookCopy } from "lucide-react";
import ChartOfAccountsTable from "@/components/compta/chart-of-accounts/chart-of-accounts-table"; // Added import

export default function ChartOfAccountsPage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <BookCopy className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Plan Comptable Général</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Détails du Plan Comptable</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for chart of accounts table or list */}
          
          <ChartOfAccountsTable />
        </CardContent>
      </Card>
    </div>
  );
}
