import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Landmark } from "lucide-react";
import BankTransactionsTable from "@/components/compta/banking/bank-transactions-table"; // Added import

export default function BankingPage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <Landmark className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Transactions Bancaires</h1>
      </div>
      {/* Removed Card and CardHeader for direct table display */}
      <BankTransactionsTable />
    </div>
  );
}
