"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker"; // Assuming you have a DatePicker component

const invoiceItemSchema = z.object({
  description: z.string().min(1, "La description est requise."),
  quantity: z.coerce.number().min(1, "La quantité doit être au moins 1."),
  unitPrice: z.coerce.number().min(0, "Le prix unitaire ne peut être négatif."),
});

const createInvoiceSchema = z.object({
  clientName: z.string().min(1, "Le nom du client est requis."),
  clientEmail: z.string().email("L'email du client n'est pas valide."),
  clientAddress: z.string().min(1, "L'adresse du client est requise."),
  invoiceDate: z.date({ required_error: "La date de facturation est requise." }),
  dueDate: z.date({ required_error: "La date d'échéance est requise." }),
  items: z.array(invoiceItemSchema).min(1, "Au moins un article est requis."),
  notes: z.string().optional(),
});

type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;

const defaultValues: Partial<CreateInvoiceFormValues> = {
  items: [{ description: "", quantity: 1, unitPrice: 0 }],
  invoiceDate: new Date(),
};

export default function CreateInvoiceForm() {
  const form = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  function onSubmit(data: CreateInvoiceFormValues) {
    console.log(data);
    // Here you would typically send the data to your backend
    alert("Facture soumise (voir console pour les données)");
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une Nouvelle Facture</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du Client</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Alpha SARL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email du Client</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Ex: contact@alphasarl.ma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="clientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse du Client</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: 123 Rue Principale, Casablanca" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de Facturation</FormLabel>
                    <DatePicker date={field.value} onDateChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'Échéance</FormLabel>
                    <DatePicker date={field.value} onDateChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            <div>
              <h3 className="text-lg font-medium mb-2">Articles de la Facture</h3>
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr_auto] gap-4 items-start mb-4 p-4 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Description de l'article/service" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Quantité</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : ""}>Prix Unitaire (MAD)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-auto self-center text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un Article
              </Button>
              {form.formState.errors.items && !form.formState.errors.items.root && (
                 <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.items.message}</p>
              )}
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optionnel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Conditions de paiement, remerciements..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => form.reset()}>Annuler</Button>
                <Button type="submit">Sauvegarder la Facture</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

