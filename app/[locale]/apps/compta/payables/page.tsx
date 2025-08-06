import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { ArrowRightLeft } from "lucide-react";
import PayablesTable from "@/components/compta/payables/payables-table"; // Added import

export default function AccountsPayablePage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <ArrowRightLeft className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Comptes Fournisseurs</h1>
      </div>
      {/* Removed Card and CardHeader for direct table display */}
      <PayablesTable />
    </div>
  );
}
