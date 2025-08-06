import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { CreditCard } from "lucide-react";
import ExpensesTable from "@/components/compta/expenses/expenses-table"; // Added import

export default function ExpenseManagementPage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <CreditCard className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Dépenses</h1>
      </div>
      {/* Removed Card and CardHeader for direct table display */}
      <ExpensesTable />
    </div>
  );
}
