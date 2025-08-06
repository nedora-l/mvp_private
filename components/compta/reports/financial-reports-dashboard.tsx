"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, BarChart2, PieChartIcon, Download, Calendar as CalendarIcon } from "lucide-react";
import { DateRangePicker } from "@/components/date-range-picker";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from 'recharts';

const mockReportTypes = [
  { id: "balance-sheet", name: "Bilan Comptable", icon: FileText },
  { id: "income-statement", name: "Compte de Résultat", icon: BarChart2 },
  { id: "cashflow-statement", name: "Tableau des Flux de Trésorerie", icon: PieChartIcon },
  { id: "sales-report", name: "Rapport des Ventes", icon: BarChart2 },
  { id: "expense-report", name: "Rapport des Dépenses", icon: PieChartIcon },
];

// Mock data for charts - replace with actual data fetching and processing
const mockSalesData = [
  { name: 'Jan', Ventes: 4000 }, { name: 'Fév', Ventes: 3000 }, { name: 'Mar', Ventes: 2000 },
  { name: 'Avr', Ventes: 2780 }, { name: 'Mai', Ventes: 1890 }, { name: 'Juin', Ventes: 2390 },
];

const mockExpenseData = [
  { name: 'Fournitures', value: 400 }, { name: 'Marketing', value: 300 },
  { name: 'Salaires', value: 1200 }, { name: 'Loyer', value: 800 },
  { name: 'Autres', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function FinancialReportsDashboard() {
  const [reportType, setReportType] = useState("income-statement");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!reportType || !dateRange.from || !dateRange.to) return;
    setLoading(true);
    setDownloadUrl(null);
    const dateStart = dateRange.from.toISOString().slice(0, 10);
    const dateEnd = dateRange.to.toISOString().slice(0, 10);
    const res = await fetch("/api/v0/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportType, dateStart, dateEnd })
    });
    if (res.ok) {
      const data = await res.json();
      setDownloadUrl(data.downloadUrl);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Générateur de Rapports Financiers</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={reportType} onValueChange={setReportType} defaultValue="income-statement">
                    <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue placeholder="Sélectionner un type de rapport" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockReportTypes.map(report => (
                            <SelectItem key={report.id} value={report.id}>
                                <div className="flex items-center">
                                    <report.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {report.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DateRangePicker className="w-full sm:w-auto" value={dateRange} onChange={setDateRange} />
                <Button onClick={handleGenerate} disabled={loading || !dateRange.from || !dateRange.to}>
                    <Download className="mr-2 h-4 w-4" /> Générer et Télécharger
                </Button>
            </div>
          </div>
          <CardDescription>Sélectionnez un type de rapport, une période, et générez votre document.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
            {downloadUrl ? (
              <a href={downloadUrl} download className="text-blue-600 underline font-medium">Télécharger le rapport</a>
            ) : (
              <p className="text-center text-muted-foreground">Le rapport sélectionné s'affichera ici.</p>
            )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des Ventes (6 derniers mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ventes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Dépenses (Mois en cours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
