import { NextRequest, NextResponse } from "next/server";
import expensesStore from "../../mock-expenses-store";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updated = expensesStore.updateStatus(id, "Approuvée");
  if (!updated) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }
  return NextResponse.json({ status: 200, data: updated });
}
