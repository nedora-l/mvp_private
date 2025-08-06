import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, PlusCircle, Link2, Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockBankTransactions = [
  { id: "TRN-001", date: "2025-06-15", description: "Paiement Fournisseur A", amount: -750.00, type: "Paiement", status: "Réconcilié" },
  { id: "TRN-002", date: "2025-06-14", description: "Encaissement Client Beta", amount: 875.50, type: "Encaissement", status: "Non Réconcilié" },
  { id: "TRN-003", date: "2025-06-13", description: "Frais bancaires", amount: -15.00, type: "Frais", status: "Réconcilié" },
  { id: "TRN-004", date: "2025-06-12", description: "Virement interne", amount: -500.00, type: "Transfert", status: "N/A" },
  { id: "TRN-005", date: "2025-06-11", description: "Paiement Fournisseur D", amount: -980.00, type: "Paiement", status: "Non Réconcilié" },
];

export default function BankTransactionsTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Relevé des Transactions Bancaires</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button size="sm" variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Importer un Relevé
            </Button>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter Manuellement
            </Button>
          </div>
        </div>
        <CardDescription>Consultez, importez et gérez vos transactions bancaires.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between items-center">
            <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher par description..." className="pl-8 w-full sm:w-[300px]" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Statut de réconciliation" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="reconciled">Réconcilié</SelectItem>
                        <SelectItem value="unreconciled">Non Réconcilié</SelectItem>
                        <SelectItem value="na">N/A</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>
                 <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                </Button>
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Montant (MAD)</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut Réconciliation</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBankTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell className={`text-right ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "Réconcilié" ? "success"
                        : transaction.status === "Non Réconcilié" ? "warning"
                        : "secondary"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {transaction.status === "Non Réconcilié" && (
                    <Button variant="outline" size="sm">
                      <Link2 className="mr-1 h-3 w-3" /> Réconcilier
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Affichage de {mockBankTransactions.length} transactions.
        </CardDescription>
      </CardFooter>
    </Card>
  );
}

// Add 'warning' variant to BadgeProps if it doesn't exist
declare module "@/components/ui/badge" {
  interface BadgeProps {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  }
}
