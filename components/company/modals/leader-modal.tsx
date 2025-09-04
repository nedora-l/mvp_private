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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { orgApiClient } from "@/lib/services/client/org/organization.client.service";
import { OrganizationLeaderDto } from "@/lib/interfaces/apis/organization";

const leaderSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  position: z.string().min(1, "Position is required"),
  bio: z.string().optional(),
  startDate: z.string().optional(),
  department: z.string().optional(),
  order: z.number().min(0, "Order must be a positive number"),
  organizationId: z.string().optional(),
});

type LeaderFormData = z.infer<typeof leaderSchema>;

interface LeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  leader?: OrganizationLeaderDto | null;
  onSuccess: () => void;
  existingLeaders: OrganizationLeaderDto[];
}

export function LeaderModal({
  isOpen,
  onClose,
  leader,
  onSuccess,
  existingLeaders,
}: LeaderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  // Sonner toast is imported at top
  const isEditing = !!leader;
  const form = useForm<LeaderFormData>({
    resolver: zodResolver(leaderSchema),
    defaultValues: {
      employeeId: "",
      position: "",
      bio: "",
      startDate: "",
      department: "",
      order: 0,
      organizationId: "",
    },
  });

  useEffect(() => {
    if (leader) {      form.reset({
        employeeId: leader.employeeId,
        position: leader.position,
        bio: leader.bio || "",
        startDate: leader.startDate || "",
        department: leader.department || "",
        order: leader.order,
        organizationId: leader.organizationId,
      });
    } else {      // Set default order to next available position
      const maxOrder = Math.max(...existingLeaders.map(l => l.order || 0), -1);
      form.reset({
        employeeId: "",
        position: "",
        bio: "",
        startDate: "",
        department: "",
        order: maxOrder + 1,
        organizationId: "",
      });
    }
  }, [leader, existingLeaders, form]);
  const onSubmit = async (data: LeaderFormData) => {
    setIsLoading(true);
    try {
      // Ensure organizationId is set from existing leader or first existing leader
      const organizationId = leader?.organizationId || existingLeaders[0]?.organizationId || "1";
      const leaderData = { ...data, organizationId };
      
      if (isEditing && leader?.id) {
        await orgApiClient.updateOrganizationLeader(Number(leader.id), leaderData);
        toast({
          title: "Success",
          description: "Organization leader updated successfully",
        });
      } else {
        await orgApiClient.createOrganizationLeader(leaderData);
        toast({
          title: "Success",
          description: "Organization leader added successfully",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving leader:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} organization leader`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!leader?.id) return;

    if (!confirm("Are you sure you want to remove this leader?")) {
      return;
    }

    setIsLoading(true);    try {
      await orgApiClient.deleteOrganizationLeader(Number(leader.id));
      toast({
        title: "Success",
        description: "Organization leader removed successfully",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting leader:", error);
      toast({
        title: "Error",
        description: "Failed to remove organization leader",
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

  // Get employee initials for avatar fallback
  const getEmployeeInitials = (employeeId: string) => {
    return employeeId
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Organization Leader" : "Add Organization Leader"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this organization leader's information."
              : "Add a new leader to your organization's leadership team."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">            {/* Employee Preview */}
            {form.watch("employeeId") && (
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Avatar>
                  <AvatarImage 
                    src={leader?.employeeAvatar} 
                    alt={leader?.employeeName || form.watch("employeeId")} 
                  />
                  <AvatarFallback>
                    {leader?.employeeName 
                      ? getEmployeeInitials(leader.employeeName) 
                      : getEmployeeInitials(form.watch("employeeId"))}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {leader?.employeeName || form.watch("employeeId")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {leader?.employeeEmail || "Employee details will be loaded"}
                  </p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter employee ID or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chief Executive Officer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Executive, Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the leader's background and role"
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
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
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
                  Remove
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
                      : "Adding..."
                    : isEditing
                    ? "Update Leader"
                    : "Add Leader"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
