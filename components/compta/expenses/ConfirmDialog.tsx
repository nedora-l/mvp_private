import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  type?: "success" | "destructive";
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, type = "success", title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <div className="flex items-center gap-3 mb-4">
          {type === "success" ? (
            <FaCheckCircle className="text-green-500 text-2xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-2xl" />
          )}
          <h2 className="text-lg font-bold">{title}</h2>
        </div>
        {description && <p className="mb-4 text-gray-700">{description}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Annuler</Button>
          <Button
            className={type === "success" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}
            onClick={onConfirm}
          >
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
}
