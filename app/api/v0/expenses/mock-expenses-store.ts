// Shared in-memory store for all expense APIs
export type Expense = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  submittedBy: string;
  status: "Approuvée" | "En attente" | "Rejetée";
};

let expenses: Expense[] = [
  { id: "EXP-001", date: "2025-06-12", category: "Fournitures de bureau", description: "Achat stylos et papier", amount: 75.50, submittedBy: "Alice Dupont", status: "Approuvée" },
  { id: "EXP-002", date: "2025-06-10", category: "Déplacement", description: "Billet de train Rabat-Casa", amount: 120.00, submittedBy: "Bob Martin", status: "En attente" },
  { id: "EXP-003", date: "2025-06-08", category: "Repas d'affaires", description: "Déjeuner client Alpha", amount: 250.75, submittedBy: "Carole Petit", status: "Rejetée" },
  { id: "EXP-004", date: "2025-06-05", category: "Logiciels", description: "Abonnement SaaS CRM", amount: 99.00, submittedBy: "David Moreau", status: "Approuvée" },
  { id: "EXP-005", date: "2025-06-14", category: "Formation", description: "Cours en ligne React Avancé", amount: 499.00, submittedBy: "Alice Dupont", status: "En attente" },
];

function getAll() {
  return expenses;
}

function add({ amount, description, date, category, submittedBy, status }: Partial<Expense>) {
  const newExpense: Expense = {
    id: `EXP-${(expenses.length + 1).toString().padStart(3, "0")}`,
    date: date || new Date().toISOString().slice(0, 10),
    category: category || "Autre",
    description: description || "",
    amount: amount || 0,
    submittedBy: submittedBy || "Utilisateur",
    status: status || "En attente",
  };
  expenses = [newExpense, ...expenses];
  return newExpense;
}

function updateStatus(id: string, status: "Approuvée" | "Rejetée" | "En attente") {
  const expense = expenses.find(e => e.id === id);
  if (expense) {
    expense.status = status;
    return expense;
  }
  return null;
}

const expensesStore = { getAll, add, updateStatus };
export default expensesStore;
