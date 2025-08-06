import { NextRequest, NextResponse } from "next/server";
import expensesStore from "./mock-expenses-store";

export async function GET(req: NextRequest) {
  // Retourne la liste des dépenses
  return NextResponse.json(expensesStore.getAll());
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { amount, description, date, category, submittedBy, status } = data;
    if (!amount || !description) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }
    const newExpense = expensesStore.add({ amount, description, date, category, submittedBy, status });
    return NextResponse.json(newExpense, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  }
}
