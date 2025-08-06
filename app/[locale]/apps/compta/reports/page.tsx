"use client"; // Add this if not present, or ensure parent is a client component if dynamic import alone isn't enough

import { BasePageProps } from "@/lib/interfaces/common/dictionary-props-component";
import { PieChart } from "lucide-react";
import dynamic from 'next/dynamic';

const FinancialReportsDashboard = dynamic(
  () => import("@/components/compta/reports/financial-reports-dashboard"),
  { ssr: false, loading: () => <p>Chargement des rapports...</p> } // Disable SSR and add a loading state
);

export default function FinancialReportsPage({ params }: BasePageProps) {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center">
        <PieChart className="h-6 w-6 mr-2" />
        <h1 className="text-3xl font-bold tracking-tight">Rapports Financiers</h1>
      </div>
      <FinancialReportsDashboard />
    </div>
  );
}
