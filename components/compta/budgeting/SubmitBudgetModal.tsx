import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubmitBudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function SubmitBudgetModal({ open, onClose, onSubmitted }: SubmitBudgetModalProps) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    allocated: "",
    spent: "0"
  });
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const period = dateStart && dateEnd ? `${dateStart.split("-").reverse().join("/")} - ${dateEnd.split("-").reverse().join("/")}` : "";
    try {
      const res = await fetch("/api/v0/budgeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          period,
          allocated: parseFloat(form.allocated),
          spent: parseFloat(form.spent)
        })
      });
      if (!res.ok) throw new Error("Erreur lors de la soumission");
      setForm({ name: "", category: "", allocated: "", spent: "0" });
      setDateStart("");
      setDateEnd("");
      setMessage({ type: "success", text: "✔ Budget créé avec succès !" });
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
        <h2 className="text-lg font-semibold">Créer un Nouveau Budget</h2>
        <Input name="name" value={form.name} onChange={handleChange} placeholder="Nom du budget" required />
        <Input name="category" value={form.category} onChange={handleChange} placeholder="Catégorie" required />
        <div className="flex gap-2">
          <Input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} required />
          <span className="self-center">à</span>
          <Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} required />
        </div>
        <Input name="allocated" value={form.allocated} onChange={handleChange} type="number" placeholder="Montant alloué (MAD)" required />
        <Input name="spent" value={form.spent} onChange={handleChange} type="number" placeholder="Montant déjà dépensé (optionnel)" />
        {message && (
          <div
            className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm animate-fade-in ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            <span>{message.text}</span>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Annuler</Button>
          <Button type="submit" disabled={loading}>{loading ? "Création..." : "Créer"}</Button>
        </div>
      </form>
    </Modal>
  );
}
