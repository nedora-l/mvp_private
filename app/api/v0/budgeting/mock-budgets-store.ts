export type Budget = {
  id: string;
  name: string;
  category: string;
  period: string;
  allocated: number;
  spent: number;
  status: "En Cours" | "Terminé" | "Dépassement";
};

let budgets: Budget[] = [
  { id: "BUDGET-001", name: "Budget Marketing T3 2025", category: "Marketing", period: "01/07/2025 - 30/09/2025", allocated: 50000, spent: 35000, status: "En Cours" },
  { id: "BUDGET-002", name: "Budget Opérationnel Annuel 2025", category: "Opérations", period: "01/01/2025 - 31/12/2025", allocated: 250000, spent: 180000, status: "En Cours" },
  { id: "BUDGET-003", name: "Budget R&D Projet X", category: "Recherche et Développement", period: "01/06/2025 - 31/12/2025", allocated: 75000, spent: 80000, status: "Dépassement" },
  { id: "BUDGET-004", name: "Budget Formation T2 2025", category: "Ressources Humaines", period: "01/04/2025 - 30/06/2025", allocated: 15000, spent: 12000, status: "Terminé" },
];

function getAll() {
  return budgets;
}

function add(data: Partial<Budget>) {
  const newBudget: Budget = {
    id: `BUDGET-${(budgets.length + 1).toString().padStart(3, "0")}`,
    name: data.name || "Nouveau budget",
    category: data.category || "Autre",
    period: data.period || "",
    allocated: data.allocated || 0,
    spent: data.spent || 0,
    status: data.status || "En Cours",
  };
  budgets = [newBudget, ...budgets];
  return newBudget;
}

function update(id: string, data: Partial<Budget>) {
  const budget = budgets.find(b => b.id === id);
  if (budget) {
    Object.assign(budget, data);
    return budget;
  }
  return null;
}

function deleteBudget(id: string) {
  const idx = budgets.findIndex(b => b.id === id);
  if (idx !== -1) {
    budgets.splice(idx, 1);
    return true;
  }
  return false;
}

function updateStatus(id: string, status: Budget["status"]) {
  const budget = budgets.find(b => b.id === id);
  if (budget) {
    budget.status = status;
    return budget;
  }
  return null;
}

const budgetsStore = { getAll, add, update, deleteBudget, updateStatus };
export default budgetsStore;
