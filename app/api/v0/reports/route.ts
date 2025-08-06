import { NextRequest, NextResponse } from "next/server";

const mockReports = [
  { id: "balance-sheet", name: "Bilan Comptable" },
  { id: "income-statement", name: "Compte de Résultat" },
  { id: "cashflow-statement", name: "Tableau des Flux de Trésorerie" },
  { id: "sales-report", name: "Rapport des Ventes" },
  { id: "expense-report", name: "Rapport des Dépenses" },
];

export async function GET(req: NextRequest) {
  // Retourne la liste des types de rapports disponibles
  return NextResponse.json(mockReports);
}

export async function POST(req: NextRequest) {
  // Simule la génération d'un rapport financier
  try {
    const { reportType, dateStart, dateEnd } = await req.json();
    if (!reportType || !dateStart || !dateEnd) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }
    // Simule un rapport généré (ici, juste un objet avec un lien fictif)
    return NextResponse.json({
      id: `${reportType}-${dateStart}-${dateEnd}`,
      name: mockReports.find(r => r.id === reportType)?.name || reportType,
      period: `${dateStart} - ${dateEnd}`,
      downloadUrl: `/api/v0/reports/download?reportType=${reportType}&dateStart=${dateStart}&dateEnd=${dateEnd}`
    });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la génération du rapport." }, { status: 500 });
  }
}
