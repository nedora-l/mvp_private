import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";

/**
 * Modèle extensible pour la création de projet (v0)
 * Prévu pour mapping direct avec MCP servers, Jira, Trello, etc.
 * Tous les champs sont documentés pour faciliter l’intégration future.
 */
interface ProjectForm {
  name: string; // Nom du projet (obligatoire)
  type: string; // Type d’outil (Jira, Trello, Slack, etc.)
  customType?: string; // Type personnalisé si "Autre" est choisi
  description: string; // Description courte
  status: string; // Statut du projet (En cours, Terminé, En attente...)
  startDate: string; // Date de début (ISO)
  endDate: string; // Date de fin (ISO)
  members: string; // Membres impliqués (séparés par virgule)
}

const initialForm: ProjectForm = {
  name: "",
  type: "Jira",
  customType: "",
  description: "",
  status: "En cours",
  startDate: "",
  endDate: "",
  members: ""
};

export default function ProjectCreateModal({ onCreate }: { onCreate: (project: ProjectForm) => void }) {
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  // Gestion du changement de champ pour tous les inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Le titre du projet est obligatoire.");
      return;
    }
    onCreate(form);
    setSuccess(true);
    setForm(initialForm);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl rounded-2xl border-0 bg-gradient-to-br from-blue-50 via-violet-50 to-white animate-fadein">
      <CardHeader className="flex flex-col items-center justify-center pb-0">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-2 shadow">
          {form.type === "Jira" && <img src="/logo/jira.svg" alt="Jira" className="h-8" />}
          {form.type === "Trello" && <img src="/logo/trello.svg" alt="Trello" className="h-8" />}
          {form.type === "Slack" && <img src="/logo/slack.svg" alt="Slack" className="h-8" />}
          {form.type === "Autre" && <span className="text-3xl text-slate-400">�️</span>}
        </div>
        <CardTitle className="text-xl font-bold text-blue-700">Créer un nouveau projet</CardTitle>
        <CardDescription className="text-xs text-slate-500 pt-1">* Champs obligatoires et extensibles pour mapping API</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        {/* Ajout du scroll vertical et limitation de la hauteur */}
        <CardContent className="space-y-6 pt-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-violet-50">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-blue-700">Titre du projet *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 focus:border-violet-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200 bg-white"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-blue-700">Type</label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 focus:border-violet-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200 bg-white"
            >
              <option value="Jira">Jira</option>
              <option value="Slack">Slack</option>
              <option value="Trello">Trello</option>
              <option value="Autre">Autre</option>
            </select>
            {form.type === "Autre" && (
              <div className="mt-2">
                <label htmlFor="customType" className="block text-sm font-medium text-blue-700">Type personnalisé</label>
                <input
                  id="customType"
                  name="customType"
                  type="text"
                  value={form.customType}
                  onChange={handleChange}
                  className="w-full border-2 border-violet-200 focus:border-blue-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  placeholder="ex: Monday, ClickUp, etc."
                  required
                />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-blue-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 focus:border-violet-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200 bg-white"
              rows={2}
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-blue-700">Statut</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 focus:border-violet-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200 bg-white"
            >
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-blue-700">Date de début</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border-2 border-blue-200 focus:border-violet-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200 bg-white"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm font-medium text-blue-700">Date de fin</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border-2 border-blue-200 focus:border-violet-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200 bg-white"
              />
            </div>
          </div>
          <div>
            <label htmlFor="members" className="block text-sm font-medium text-blue-700">Membres (séparés par virgule)</label>
            <input
              id="members"
              name="members"
              type="text"
              value={form.members}
              onChange={handleChange}
              className="w-full border-2 border-blue-200 focus:border-violet-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200 bg-white"
              placeholder="ex: Alice, Bob, Charlie"
            />
          </div>
          {error && <div className="text-red-600 text-sm animate-shake">{error}</div>}
          {success && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm animate-bounce-in">
              <span role="img" aria-label="Success">✅</span>
              Projet créé avec succès !
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-150">Ajouter le projet</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
