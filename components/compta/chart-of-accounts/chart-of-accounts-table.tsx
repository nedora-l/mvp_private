import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";

// Mock data for the chart of accounts
const mockAccounts = [
  { id: "101", name: "Capital Social", type: "Capitaux Propres", balance: 150000.00, currency: "MAD", active: true },
  { id: "4455", name: "TVA Facturée", type: "Dettes Fiscales", balance: 12500.75, currency: "MAD", active: true },
  { id: "611", name: "Achats de Marchandises", type: "Charges d'Exploitation", balance: 75000.00, currency: "MAD", active: true },
  { id: "701", name: "Ventes de Marchandises", type: "Produits d'Exploitation", balance: 250000.00, currency: "MAD", active: true },
  { id: "5141", name: "Banque (BMCE)", type: "Trésorerie Actif", balance: 85000.50, currency: "MAD", active: true },
  { id: "213", name: "Matériel et Outillage", type: "Immobilisations Corporelles", balance: 45000.00, currency: "MAD", active: false },
];

export default function ChartOfAccountsTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Compte
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro de Compte</TableHead>
            <TableHead>Nom du Compte</TableHead>
            <TableHead>Type de Compte</TableHead>
            <TableHead className="text-right">Solde (MAD)</TableHead>
            <TableHead className="text-center">Statut</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAccounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.id}</TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell className="text-right">{account.balance.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Badge variant={account.active ? "success" : "secondary"}>
                  {account.active ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell className="text-center space-x-1">
                <Button variant="ghost" size="icon" aria-label="Modifier le compte">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Supprimer le compte" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Ensure Badge component supports 'success' variant or adjust as needed
// You might need to extend BadgeProps if not already done:
// declare module "@/components/ui/badge" {
//   interface BadgeProps {
//     variant?: "default" | "secondary" | "destructive" | "outline" | "success";
//   }
// }
