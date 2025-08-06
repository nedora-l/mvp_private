import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Printer, Mail, Download } from "lucide-react";

const mockInvoice = {
  id: "INV-001",
  clientName: "Alpha SARL",
  clientAddress: "123 Rue Principale, Casablanca, Maroc",
  clientEmail: "contact@alphasarl.ma",
  invoiceDate: "2025-06-15",
  dueDate: "2025-07-15",
  items: [
    { description: "Développement Web - Phase 1", quantity: 1, unitPrice: 800, total: 800 },
    { description: "Consultation SEO", quantity: 5, unitPrice: 90, total: 450.75 },
  ],
  subtotal: 1250.75,
  taxRate: 0.20, // 20%
  taxAmount: 250.15,
  total: 1500.90,
  status: "Paid",
  notes: "Merci pour votre confiance.",
};

export default function InvoiceDetails() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-3xl">Facture #{mockInvoice.id}</CardTitle>
          <CardDescription>Date d'émission: {mockInvoice.invoiceDate} | Date d'échéance: {mockInvoice.dueDate}</CardDescription>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="icon"><Printer className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><Mail className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-semibold mb-1">Facturé à:</h3>
            <p className="font-bold">{mockInvoice.clientName}</p>
            <p>{mockInvoice.clientAddress}</p>
            <p>{mockInvoice.clientEmail}</p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold mb-1">De:</h3>
            <p className="font-bold">D&A Solutions SARL</p>
            <p>789 Avenue Hassan II, Rabat, Maroc</p>
            <p>contact@dasolutions.ma</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="font-semibold mb-2 text-lg">Détails des Prestations</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-center py-2">Quantité</th>
                <th className="text-right py-2">Prix Unitaire (MAD)</th>
                <th className="text-right py-2">Total (MAD)</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoice.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">{item.unitPrice.toFixed(2)}</td>
                  <td className="text-right py-2">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
            <div>
                {mockInvoice.notes && (
                    <>
                        <h4 className="font-semibold mb-1">Notes:</h4>
                        <p className="text-sm text-muted-foreground">{mockInvoice.notes}</p>
                    </>
                )}
            </div>
            <div className="space-y-1 text-right">
                <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total:</span>
                <span>{mockInvoice.subtotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                <span className="text-muted-foreground">TVA ({mockInvoice.taxRate * 100}%):</span>
                <span>{mockInvoice.taxAmount.toFixed(2)} MAD</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{mockInvoice.total.toFixed(2)} MAD</span>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant={mockInvoice.status === "Paid" ? "glass" : "default"}>
            {mockInvoice.status === "Paid" ? "Marquer comme Non Payée" : "Marquer comme Payée"}
        </Button>
      </CardFooter>
    </Card>
  );
}
