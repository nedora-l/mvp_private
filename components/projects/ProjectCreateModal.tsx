import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { useCollaborators } from "@/contexts/collaborators-context";

/**
 * Modèle extensible pour la création de projet (v0)
 * Prévu pour mapping direct avec MCP servers, Jira, Trello, etc.
 * Tous les champs sont documentés pour faciliter l'intégration future.
 */
interface ProjectForm {
  name: string; // Nom du projet (obligatoire)
  type: string; // Type d'outil (Jira, Trello, Slack, etc.)
  boardType?: string; // Type de board (Scrum, Kanban, XP pour Jira)
  customType?: string; // Type personnalisé si "Autre" est choisi
  description: string; // Description courte
  status: string; // Statut du projet (en-cours, termine, pause, attente)
  startDate: string; // Date de début (ISO)
  endDate: string; // Date de fin (ISO)
  members: string; // Membres impliqués (séparés par virgule)
}

const ROLE_COLORS = {
  "Manager": "bg-purple-100 text-purple-800",
  "Dev Team": "bg-blue-100 text-blue-800", 
  "AI Team": "bg-green-100 text-green-800",
  "RH": "bg-orange-100 text-orange-800",
  "Sécurité": "bg-red-100 text-red-800"
};

const initialForm: ProjectForm = {
  name: "",
  type: "Jira",
  boardType: "",
  customType: "",
  description: "",
  status: "en-cours",
  startDate: "",
  endDate: "",
  members: ""
};

export default function ProjectCreateModal({ onCreate }: { onCreate: (project: ProjectForm) => void }) {
  const { collaborators } = useCollaborators();
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<{name: string, role: string}[]>([]);

  // Gestion du changement de champ pour tous les inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Gestion de la sélection des collaborateurs
  const handleMemberToggle = (member: {name: string, role: string}) => {
    const isSelected = selectedMembers.some(m => m.name === member.name);
    const newSelectedMembers = isSelected
      ? selectedMembers.filter(m => m.name !== member.name)
      : [...selectedMembers, member];
    
    setSelectedMembers(newSelectedMembers);
    // Format: "Alice Martin (Manager), Bob Dupont (Dev Team)"
    setForm({ ...form, members: newSelectedMembers.map(m => `${m.name} (${m.role})`).join(", ") });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Le titre du projet est obligatoire.");
      return;
    }
    if (form.type === "Jira" && !form.boardType) {
      setError("Veuillez choisir une méthode agile pour les projets Jira.");
      return;
    }
    if (form.type === "Autre" && !form.customType?.trim()) {
      setError("Veuillez spécifier le type personnalisé.");
      return;
    }
    
    // Ajout automatique du boardType selon le type pour non-Jira
    const projectData = {
      ...form,
      boardType: form.type === "Jira" ? form.boardType : getBoardTypeForType(form.type)
    };
    
    onCreate(projectData);
    setSuccess(true);
    setForm(initialForm);
    setSelectedMembers([]);
    setTimeout(() => setSuccess(false), 2000);
  };

  // Fonction pour déterminer le boardType selon le type de projet
  const getBoardTypeForType = (type: string) => {
    switch (type) {
      case "Trello": return "Kanban";
      case "Slack": return "Simple";
      case "Autre": return "Simple";
      default: return "Simple";
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-xl rounded-2xl border-0 bg-gradient-to-br from-blue-50 via-violet-50 to-white animate-fadein">
      <CardHeader className="flex flex-col items-center justify-center pb-0">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 mb-2 shadow">
          {form.type === "Jira" && <img src="/logo/jira.svg" alt="Jira" className="h-8" />}
          {form.type === "Trello" && <img src="/logo/trello.svg" alt="Trello" className="h-8" />}
          {form.type === "Slack" && <img src="/logo/slack.svg" alt="Slack" className="h-8" />}
          {form.type === "Autre" && <span className="text-3xl text-slate-400">🛠️</span>}
        </div>
        <CardTitle className="text-xl font-bold text-blue-700">Créer un nouveau projet</CardTitle>
        <CardDescription className="text-xs text-slate-500 pt-1">* Champs obligatoires et extensibles pour mapping API</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
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
            {form.type === "Jira" && (
              <div className="mt-2">
                <label htmlFor="boardType" className="block text-sm font-medium text-blue-700">Méthode Agile *</label>
                <select
                  id="boardType"
                  name="boardType"
                  value={form.boardType}
                  onChange={handleChange}
                  className="w-full border-2 border-blue-200 focus:border-violet-400 rounded-lg px-3 py-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-200 bg-white"
                  required
                >
                  <option value="">🎯 Choisir la méthode agile...</option>
                  <option value="Scrum">🏃 Scrum (Sprints, Backlog, Review)</option>
                  <option value="Kanban">📋 Kanban (Flux continu)</option>
                  <option value="XP">⚡ XP (Extreme Programming)</option>
                </select>
                <p className="mt-1 text-xs text-gray-600">
                  Cette méthode déterminera l'organisation de votre board Jira
                </p>
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
              <option value="en-cours">En cours</option>
              <option value="termine">Terminé</option>
              <option value="pause">En pause</option>
              <option value="attente">En attente</option>
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
            <label className="block text-sm font-medium text-blue-700 mb-2">Collaborateurs</label>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-blue-200 rounded-lg p-3">
              {collaborators.map((member) => (
                <label key={member.name} className="flex items-center justify-between p-2 rounded hover:bg-blue-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedMembers.some(m => m.name === member.name)}
                      onChange={() => handleMemberToggle(member)}
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-sm">{member.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[member.role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                    {member.role}
                  </span>
                </label>
              ))}
            </div>
            {selectedMembers.length > 0 && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <div className="text-xs font-medium text-blue-700 mb-2">
                  Sélectionnés: {selectedMembers.length} collaborateur(s)
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedMembers.map((member, idx) => (
                    <span key={idx} className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[member.role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                      {member.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-150">
            Ajouter le projet
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
