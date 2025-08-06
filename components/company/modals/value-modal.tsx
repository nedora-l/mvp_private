"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { orgApiClient } from "@/lib/services/client/org/organization.client.service";
import { OrganizationValueDto } from "@/lib/interfaces/apis/organization";

const valueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  order: z.number().min(0, "Order must be a positive number"),
  organizationId: z.string().optional(),
});

type ValueFormData = z.infer<typeof valueSchema>;

interface ValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  value?: OrganizationValueDto | null;
  onSuccess: () => void;
  existingValues: OrganizationValueDto[];
}

const VALUE_CATEGORIES = [
  "Core Values",
  "Principles",
  "Beliefs",
  "Standards",
  "Culture",
  "Mission",
  "Vision",
  "Ethics",
];

export function ValueModal({
  isOpen,
  onClose,
  value,
  onSuccess,
  existingValues,
}: ValueModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!value;
  const form = useForm<ValueFormData>({
    resolver: zodResolver(valueSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      order: 0,
      organizationId: "",
    },
  });
  useEffect(() => {
    if (value) {
      form.reset({
        title: value.title,
        description: value.description,
        category: value.category,
        order: value.order,
        organizationId: value.organizationId,
      });
    } else {      // Set default order to next available position
      const maxOrder = Math.max(...existingValues.map(v => v.order || 0), -1);
      form.reset({
        title: "",
        description: "",
        category: "",
        order: maxOrder + 1,
        organizationId: "",
      });
    }
  }, [value, existingValues, form]);
  const onSubmit = async (data: ValueFormData) => {
    setIsLoading(true);
    try {
      // Ensure organizationId is set from existing value or first existing value
      const organizationId = value?.organizationId || existingValues[0]?.organizationId || "1";
      const valueData = { ...data, organizationId };
      
      if (isEditing && value?.id) {
        await orgApiClient.updateOrganizationValue(Number(value.id), valueData);
        toast({
          title: "Success",
          description: "Organization value updated successfully",
        });
      } else {
        await orgApiClient.createOrganizationValue(valueData);
        toast({
          title: "Success",
          description: "Organization value created successfully",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving value:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} organization value`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!value?.id) return;

    if (!confirm("Are you sure you want to delete this value?")) {
      return;
    }

    setIsLoading(true);    try {
      await orgApiClient.deleteOrganizationValue(Number(value.id));
      toast({
        title: "Success",
        description: "Organization value deleted successfully",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting value:", error);
      toast({
        title: "Error",
        description: "Failed to delete organization value",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Organization Value" : "Add Organization Value"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this organization value."
              : "Add a new value that represents your organization's principles."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter value title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this value means to your organization"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {VALUE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between pt-4">
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              )}
              <div className="flex space-x-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update Value"
                    : "Create Value"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
