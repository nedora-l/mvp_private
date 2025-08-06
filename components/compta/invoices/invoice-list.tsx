import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Trash2 } from "lucide-react";

const mockInvoices = [
  { id: "INV-001", client: "Alpha SARL", date: "2025-06-15", dueDate: "2025-07-15", total: 1250.75, status: "Paid" },
  { id: "INV-002", client: "Beta Corp", date: "2025-06-10", dueDate: "2025-07-10", total: 850.00, status: "Pending" },
  { id: "INV-003", client: "Gamma Ltd", date: "2025-05-20", dueDate: "2025-06-20", total: 2300.50, status: "Overdue" },
  { id: "INV-004", client: "Delta Inc", date: "2025-06-01", dueDate: "2025-07-01", total: 500.20, status: "Paid" },
];

export default function InvoiceList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Factures</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date d'émission</TableHead>
              <TableHead>Date d'échéance</TableHead>
              <TableHead className="text-right">Montant Total (MAD)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell className="text-right">{invoice.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === "Paid" ? "success" : invoice.status === "Pending" ? "outline" : "destructive"}>
                    {invoice.status === "Paid" ? "Payée" : invoice.status === "Pending" ? "En attente" : "En retard"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center space-x-1">
                  <Button variant="ghost" size="icon" aria-label="Voir la facture">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Modifier la facture">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Supprimer la facture" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Helper for badge variants if not already defined in your Badge component
declare module "@/components/ui/badge" {
  interface BadgeProps {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | undefined;
  }
}
