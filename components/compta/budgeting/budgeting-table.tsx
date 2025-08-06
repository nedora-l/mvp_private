"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Edit, Trash2, Eye, TrendingUp, TrendingDown, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import SubmitBudgetModal from "./SubmitBudgetModal";

export default function BudgetingTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    setLoading(true);
    const res = await fetch("/api/v0/budgeting");
    const data = await res.json();
    setBudgets(data);
    setLoading(false);
  };
  useEffect(() => { fetchBudgets(); }, []);

  const calculateProgress = (spent: number, allocated: number) => {
    if (allocated === 0) return 0;
    return Math.min((spent / allocated) * 100, 100); // Cap at 100% for display
  };

  const getStatusVariant = (status: string, spent: number, allocated: number) => {
    if (status === "Dépassement" || spent > allocated) return "destructive";
    if (status === "Terminé") return "success";
    if (status === "En Cours") return "default";
    return "secondary";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Suivi des Budgets</CardTitle>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Créer un Nouveau Budget
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du Budget</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Période</TableHead>
              <TableHead className="text-right">Alloué (MAD)</TableHead>
              <TableHead className="text-right">Dépensé (MAD)</TableHead>
              <TableHead>Progression</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8}>Chargement...</TableCell></TableRow>
            ) : budgets.map((budget) => {
              const progress = calculateProgress(budget.spent, budget.allocated);
              const remaining = budget.allocated - budget.spent;
              return (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">{budget.name}</TableCell>
                  <TableCell>{budget.category}</TableCell>
                  <TableCell>{budget.period}</TableCell>
                  <TableCell className="text-right">{budget.allocated.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{budget.spent.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Progress 
                        value={progress} 
                        className="w-[60%] mr-2 h-3" 
                        style={{
                          '--progress-foreground': budget.spent > budget.allocated 
                            ? 'hsl(var(--destructive))' 
                            : progress > 80 
                              ? 'hsl(25, 95%, 53%)' 
                              : 'hsl(var(--primary))'
                        } as React.CSSProperties}
                      />
                      <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                    </div>
                    <div className={`text-xs ${remaining < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {remaining < 0 ? `Dépassement: ${(-remaining).toFixed(2)}` : `Restant: ${remaining.toFixed(2)}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(budget.status, budget.spent, budget.allocated)}>
                      {budget.spent > budget.allocated ? "Dépassement" : budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center space-x-1">
                    <Button variant="ghost" size="icon" aria-label="Voir les détails">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Modifier le budget">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Supprimer le budget" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <CardDescription>
          Total de {budgets.length} budgets actifs et planifiés.
        </CardDescription>
      </CardFooter>
      <SubmitBudgetModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmitted={fetchBudgets} />
    </Card>
  );
}
