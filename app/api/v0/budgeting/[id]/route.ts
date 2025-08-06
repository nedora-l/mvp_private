import { NextRequest, NextResponse } from "next/server";
import budgetsStore from "../mock-budgets-store";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await req.json();
    const updated = budgetsStore.update(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }
    return NextResponse.json({ status: 200, data: updated });
  } catch (e) {
    return NextResponse.json({ error: "Erreur lors de la modification." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const deleted = budgetsStore.deleteBudget(id);
  if (!deleted) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }
  return NextResponse.json({ status: 200, id, message: "Le budget a été supprimé avec succès." });
}
