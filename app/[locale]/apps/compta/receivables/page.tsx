import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { ArrowLeftRight } from "lucide-react";
import ReceivablesTable from "@/components/compta/receivables/receivables-table"; // Added import

export default function AccountsReceivablePage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <ArrowLeftRight className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Comptes Clients</h1>
      </div>
      {/* Removed Card and CardHeader for direct table display */}
      <ReceivablesTable />
    </div>
  );
}
