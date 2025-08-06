import InvoiceList from "@/components/compta/invoices/invoice-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Factures</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Créer une Facture
        </Button>
      </div>
      <InvoiceList />
    </div>
  );
}
