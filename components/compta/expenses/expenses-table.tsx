"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Edit, Trash2, Filter, FileText, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SubmitExpenseModal from "./SubmitExpenseModal";
import ConfirmDialog from "./ConfirmDialog";

export default function ExpensesTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState<null | { id: string; action: "approve" | "reject" }>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchExpenses = async () => {
    setLoading(true);
    const res = await fetch("/api/v0/expenses");
    const data = await res.json();
    setExpenses(data);
    setLoading(false);
  };
  useEffect(() => { fetchExpenses(); }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setMessage(null);
    try {
      const res = await fetch(`/api/v0/expenses/${id}/${action}`, { method: "POST" });
      if (!res.ok) throw new Error("Erreur lors de l'action");
      setMessage(action === "approve" ? "Dépense approuvée !" : "Dépense rejetée !");
      await fetchExpenses();
    } catch {
      setMessage("Erreur lors de l'action");
    }
    setConfirm(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Suivi des Notes de Frais</CardTitle>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Soumettre une Dépense
          </Button>
        </div>
        <CardDescription>Gérez et suivez les dépenses soumises par les employés.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between items-center">
          <Input placeholder="Rechercher par description ou employé..." className="w-full sm:w-[300px]" />
          <div className="flex gap-2 w-full sm:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvée</SelectItem>
                <SelectItem value="rejected">Rejetée</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Montant (MAD)</TableHead>
              <TableHead>Soumis par</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Chargement...</TableCell></TableRow>
            ) : expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell className="font-medium truncate max-w-xs">{expense.description}</TableCell>
                <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                <TableCell>{expense.submittedBy}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      expense.status === "Approuvée"
                        ? "success"
                        : expense.status === "En attente"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center space-x-1">
                  <Button variant="ghost" size="icon" aria-label="Voir les détails">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {expense.status === "En attente" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Approuver"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => setConfirm({ id: expense.id, action: "approve" })}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Rejeter"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setConfirm({ id: expense.id, action: "reject" })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {expense.status !== "En attente" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Modifier le statut"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" aria-label="Voir le justificatif">
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {message && <div className="mt-2 text-center text-green-600">{message}</div>}
      </CardContent>
      <CardFooter>
        <CardDescription>
          Total de {expenses.length} notes de frais.
        </CardDescription>
      </CardFooter>
      <SubmitExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={fetchExpenses}
      />
      <ConfirmDialog
        open={!!confirm}
        type={confirm?.action === "approve" ? "success" : "destructive"}
        title={confirm?.action === "approve" ? "Confirmer l'approbation" : "Confirmer le rejet"}
        description={confirm?.action === "approve" ? "Voulez-vous vraiment approuver cette dépense ?" : "Voulez-vous vraiment rejeter cette dépense ?"}
        onConfirm={() => confirm && handleAction(confirm.id, confirm.action)}
        onCancel={() => setConfirm(null)}
      />
    </Card>
  );
}
