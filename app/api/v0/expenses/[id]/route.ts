import { NextRequest, NextResponse } from "next/server";
import expensesStore, { Expense } from "../mock-expenses-store";

// PATCH: Update an expense by id
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    let expense = expensesStore.getAll().find((e: Expense) => e.id === id);
    if (!expense) {
      return NextResponse.json({ status: 404, error: "Expense not found" }, { status: 404 });
    }
    // Si le statut est modifié, utiliser updateStatus
    if (body.status) {
      const updated = expensesStore.updateStatus(id, body.status);
      if (updated) expense = updated;
    }
    if (expense) Object.assign(expense, body);
    return NextResponse.json({ status: 200, data: expense });
  } catch (error) {
    return NextResponse.json({ status: 500, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Remove an expense by id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const expensesArray = expensesStore.getAll();
    const idx = expensesArray.findIndex((e: Expense) => e.id === id);
    if (idx === -1) {
      return NextResponse.json({ status: 404, error: "Expense not found" }, { status: 404 });
    }
    expensesArray.splice(idx, 1);
    return NextResponse.json({ status: 200, id, message: "La dépense a été supprimée avec succès." });
  } catch (error) {
    return NextResponse.json({ status: 500, error: "Internal server error" }, { status: 500 });
  }
}
