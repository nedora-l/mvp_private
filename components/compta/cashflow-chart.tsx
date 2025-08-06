import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CashFlowChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Flux de trésorerie</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {/* Placeholder for Cash Flow Chart - Integrate with a charting library later */}
        <div className="h-[350px] bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
          <p className="text-muted-foreground">Graphique du flux de trésorerie (Placeholder)</p>
        </div>
      </CardContent>
    </Card>
  );
}
