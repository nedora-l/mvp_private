import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Edit, Trash2, FileText, CheckCircle, XCircle } from "lucide-react";

const mockPayables = [
  { id: "PAY-001", vendor: "Fournisseur A", invoiceDate: "2025-06-01", dueDate: "2025-07-01", amount: 750.00, status: "À Payer" },
  { id: "PAY-002", vendor: "Fournisseur B", invoiceDate: "2025-05-15", dueDate: "2025-06-15", amount: 1200.50, status: "Payée" },
  { id: "PAY-003", vendor: "Fournisseur C", invoiceDate: "2025-06-10", dueDate: "2025-07-10", amount: 300.75, status: "En Retard" },
  { id: "PAY-004", vendor: "Fournisseur D", invoiceDate: "2025-06-20", dueDate: "2025-07-20", amount: 980.00, status: "À Payer" },
];

export default function PayablesTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Liste des Factures Fournisseurs</CardTitle>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Facture
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Facture</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Date Facture</TableHead>
              <TableHead>Date d'Échéance</TableHead>
              <TableHead className="text-right">Montant (MAD)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPayables.map((payable) => (
              <TableRow key={payable.id}>
                <TableCell className="font-medium">{payable.id}</TableCell>
                <TableCell>{payable.vendor}</TableCell>
                <TableCell>{payable.invoiceDate}</TableCell>
                <TableCell>{payable.dueDate}</TableCell>
                <TableCell className="text-right">{payable.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payable.status === "Payée" ? "success"
                        : payable.status === "À Payer" ? "default"
                        : "destructive"
                    }
                  >
                    {payable.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center space-x-1">
                  <Button variant="ghost" size="icon" aria-label="Voir la facture">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Modifier">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {payable.status === "À Payer" && (
                    <Button variant="ghost" size="icon" aria-label="Marquer comme payée" className="text-green-600 hover:text-green-700">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {payable.status === "Payée" && (
                     <Button variant="ghost" size="icon" aria-label="Marquer comme non payée" className="text-orange-600 hover:text-orange-700">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" aria-label="Supprimer" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Total de {mockPayables.length} factures fournisseurs.
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
