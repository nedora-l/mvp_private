import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState } from "react";
// import Modal from "@/components/ui/Modal";
import Modal from "@/components/ui/Modal"; // Update this path if Modal is located elsewhere

interface SubmitExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function SubmitExpenseModal({ open, onClose, onSubmitted }: SubmitExpenseModalProps) {
  const [form, setForm] = useState({
    date: "",
    category: "",
    description: "",
    amount: "",
    submittedBy: "",
    status: "En attente"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/v0/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount)
        })
      });
      if (!res.ok) throw new Error("Erreur lors de la soumission");
      setForm({ date: "", category: "", description: "", amount: "", submittedBy: "", status: "En attente" });
      setMessage({ type: "success", text: "✔ Dépense soumise avec succès !" });
      if (onSubmitted) onSubmitted();
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Erreur inconnue" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <form className="p-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">Soumettre une Dépense</h2>
        <Input name="date" value={form.date} onChange={handleChange} type="date" placeholder="Date" required />
        <Input name="category" value={form.category} onChange={handleChange} placeholder="Catégorie" required />
        <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <Input name="amount" value={form.amount} onChange={handleChange} type="number" placeholder="Montant (MAD)" required />
        <Input name="submittedBy" value={form.submittedBy} onChange={handleChange} placeholder="Soumis par" required />
        <Select value={form.status} onValueChange={v => handleSelect("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="Approuvée">Approuvée</SelectItem>
            <SelectItem value="Rejetée">Rejetée</SelectItem>
          </SelectContent>
        </Select>
        {message && (
          <div
            className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm animate-fade-in ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.type === "success" ? (
              <FaCheckCircle className="text-green-500 text-lg" />
            ) : (
              <FaTimesCircle className="text-red-500 text-lg" />
            )}
            <span>{message.text}</span>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Annuler</Button>
          <Button type="submit" disabled={loading}>{loading ? "Soumission..." : "Soumettre"}</Button>
        </div>
      </form>
    </Modal>
  );
}
