import { NextRequest, NextResponse } from "next/server";
import budgetsStore from "../../mock-budgets-store";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updated = budgetsStore.updateStatus(id, "Dépassement");
  if (!updated) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }
  return NextResponse.json({ status: 200, data: updated });
}
