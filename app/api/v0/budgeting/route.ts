import { NextRequest, NextResponse } from "next/server";
import budgetsStore from "./mock-budgets-store";

export async function GET(_req: NextRequest) {
  return NextResponse.json(budgetsStore.getAll());
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, category, period, allocated, spent, status } = data;
    if (!name || !category || !period || !allocated) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }
    const newBudget = budgetsStore.add({ name, category, period, allocated, spent, status });
    return NextResponse.json(newBudget, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  }
}
