import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Edit, Trash2, Send, CheckCircle, XCircle } from "lucide-react";

const mockReceivables = [
  { id: "REC-001", customer: "Client Alpha", invoiceDate: "2025-06-10", dueDate: "2025-07-10", amount: 1500.00, status: "Non Payée" },
  { id: "REC-002", customer: "Client Beta", invoiceDate: "2025-05-20", dueDate: "2025-06-20", amount: 875.50, status: "Payée" },
  { id: "REC-003", customer: "Client Gamma", invoiceDate: "2025-04-15", dueDate: "2025-05-15", amount: 2200.00, status: "En Retard" },
  { id: "REC-004", customer: "Client Delta", invoiceDate: "2025-06-25", dueDate: "2025-07-25", amount: 600.25, status: "Non Payée" },
];

export default function ReceivablesTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Liste des Factures Clients</CardTitle>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Créer une Facture Client
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date Facture</TableHead>
              <TableHead>Date d'Échéance</TableHead>
              <TableHead className="text-right">Montant (MAD)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReceivables.map((receivable) => (
              <TableRow key={receivable.id}>
                <TableCell className="font-medium">{receivable.id}</TableCell>
                <TableCell>{receivable.customer}</TableCell>
                <TableCell>{receivable.invoiceDate}</TableCell>
                <TableCell>{receivable.dueDate}</TableCell>
                <TableCell className="text-right">{receivable.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      receivable.status === "Payée" ? "success"
                        : receivable.status === "Non Payée" ? "default" // Or "warning" or a custom variant
                        : "destructive" // For "En Retard"
                    }
                  >
                    {receivable.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center space-x-1">
                  <Button variant="ghost" size="icon" aria-label="Voir la facture">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Modifier la facture">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {receivable.status === "Non Payée" && (
                    <Button variant="ghost" size="icon" aria-label="Marquer comme payée" className="text-green-600 hover:text-green-700">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  {receivable.status === "Payée" && (
                     <Button variant="ghost" size="icon" aria-label="Marquer comme non payée" className="text-orange-600 hover:text-orange-700">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                   {receivable.status !== "Payée" && (
                    <Button variant="ghost" size="icon" aria-label="Envoyer un rappel">
                        <Send className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" aria-label="Supprimer la facture" className="text-destructive hover:text-destructive">
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
          Total de {mockReceivables.length} factures clients.
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
