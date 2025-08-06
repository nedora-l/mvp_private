import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { Target } from "lucide-react";
import BudgetingTable from "@/components/compta/budgeting/budgeting-table"; // Added import

export default function BudgetingPage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <Target className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Budgétisation</h1>
      </div>
      {/* Removed Card and CardHeader for direct table display */}
      <BudgetingTable />
    </div>
  );
}
