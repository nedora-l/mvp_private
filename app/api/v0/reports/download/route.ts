import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Simule le téléchargement d'un fichier PDF/CSV
  const { searchParams } = new URL(req.url);
  const reportType = searchParams.get("reportType") || "report";
  const dateStart = searchParams.get("dateStart") || "";
  const dateEnd = searchParams.get("dateEnd") || "";
  // Génère un contenu fictif
  const content = `Rapport: ${reportType}\nPériode: ${dateStart} - ${dateEnd}\nContenu: ...`;
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename=${reportType}-${dateStart}-${dateEnd}.txt`
    }
  });
}
