import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileEdit, Trash2, Plus } from "lucide-react";
import { getInvoices } from "@/lib/services/client/invoices/invoices-client";
import { Invoices } from "@/app/api/v0/bank/invoices/route";
import AddInvoicesModal from "./AddInvoicesModal";
import EditReceivableModal from "./EditReceivableModal";
import DeleteInvoicesModal from "./DeleteInvoicesModal";

// Ce composant est désormais obsolète : utilisez `invoice-list.tsx` pour la table harmonisée des factures clients.

export default function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoices[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoices | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    const data = await getInvoices();
    setInvoices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liste des Factures Clients</CardTitle>
        <Button onClick={() => setAddOpen(true)} size="sm" variant="default" className="gap-2">
          <Plus className="w-4 h-4" /> Nouvelle facture
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date d'émission</TableHead>
              <TableHead>Date d'échéance</TableHead>
              <TableHead className="text-right">Montant (MAD)</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.invoiceDate}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell className="text-right">{invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={
                    invoice.status === "Payée"
                      ? "success"
                      : invoice.status === "À Payer"
                      ? "outline"
                      : "destructive"
                  }>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center space-x-1">
                  <Button variant="ghost" size="icon" aria-label="Voir la facture">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Modifier la facture"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setEditOpen(true);
                    }}
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Supprimer la facture"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Aucune facture trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <AddInvoicesModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={fetchInvoices} />
      <EditReceivableModal open={editOpen} onClose={() => setEditOpen(false)} onUpdated={fetchInvoices} invoice={selectedInvoice} />
      <DeleteInvoicesModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onDeleted={fetchInvoices} invoice={selectedInvoice} />
    </Card>
  );
}
