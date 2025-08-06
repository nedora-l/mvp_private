"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Contexte pour la gestion des sprints Jira
 * Synchronisation bidirectionnelle avec l'API MCP
 */

export interface Sprint {
  id: number;
  name: string;
  goal: string;
  state: 'future' | 'active' | 'closed';
  startDate: string;
  endDate: string;
  completeDate?: string;
  boardId: number;
  storyPoints: number;
  completedPoints: number;
  velocity?: number;
}

interface SprintsContextType {
  sprints: Sprint[];
  loading: boolean;
  error: string | null;
  fetchSprints: (boardId: string) => Promise<void>;
  addSprint: (sprintData: Partial<Sprint>) => Promise<Sprint | null>;
  editSprint: (id: number, sprintData: Partial<Sprint>) => Promise<void>;
  deleteSprint: (id: number) => Promise<void>;
  startSprint: (id: number) => Promise<void>;
  completeSprint: (id: number) => Promise<void>;
  getActiveSprint: () => Sprint | null;
  getSprintVelocity: (sprintId: number) => number;
}

const SprintsContext = createContext<SprintsContextType | undefined>(undefined);

export function SprintsProvider({ children }: { children: React.ReactNode }) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSprints = useCallback(async (boardId: string) => {
    if (!boardId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Récupération sprints pour board:", boardId);
      
      const response = await fetch(`/api/mcp/sprints?boardId=${boardId}`);
      const data = await response.json();
      
      if (data.success) {
        setSprints(data.sprints || []);
        console.log(`✅ ${data.sprints?.length || 0} sprints récupérés`);
      } else {
        throw new Error(data.error || 'Erreur lors de la récupération des sprints');
      }
    } catch (error) {
      console.error("❌ Erreur fetchSprints:", error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setSprints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSprint = useCallback(async (sprintData: Partial<Sprint>): Promise<Sprint | null> => {
    if (!sprintData.name || !sprintData.boardId) {
      throw new Error('Nom du sprint et boardId requis');
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Création sprint:", sprintData);
      
      const response = await fetch('/api/mcp/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sprintData)
      });
      
      const data = await response.json();
      
      if (data.success && data.sprint) {
        setSprints(prev => [...prev, data.sprint]);
        console.log("✅ Sprint créé:", data.sprint);
        return data.sprint;
      } else {
        throw new Error(data.error || 'Erreur lors de la création du sprint');
      }
    } catch (error) {
      console.error("❌ Erreur addSprint:", error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const editSprint = useCallback(async (id: number, sprintData: Partial<Sprint>) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Modification sprint:", id, sprintData);
      
      const response = await fetch('/api/mcp/sprints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...sprintData })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSprints(prev => prev.map(sprint => 
          sprint.id === id ? { ...sprint, ...sprintData } : sprint
        ));
        console.log("✅ Sprint modifié");
      } else {
        throw new Error(data.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error("❌ Erreur editSprint:", error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSprint = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Suppression sprint:", id);
      
      const response = await fetch(`/api/mcp/sprints?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSprints(prev => prev.filter(sprint => sprint.id !== id));
        console.log("✅ Sprint supprimé");
      } else {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error("❌ Erreur deleteSprint:", error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  const startSprint = useCallback(async (id: number) => {
    await editSprint(id, { 
      state: 'active',
      startDate: new Date().toISOString().split('T')[0]
    });
  }, [editSprint]);

  const completeSprint = useCallback(async (id: number) => {
    await editSprint(id, { 
      state: 'closed',
      completeDate: new Date().toISOString().split('T')[0]
    });
  }, [editSprint]);

  const getActiveSprint = useCallback((): Sprint | null => {
    return sprints.find(sprint => sprint.state === 'active') || null;
  }, [sprints]);

  const getSprintVelocity = useCallback((sprintId: number): number => {
    const sprint = sprints.find(s => s.id === sprintId);
    if (!sprint || sprint.storyPoints === 0) return 0;
    return Math.round((sprint.completedPoints / sprint.storyPoints) * 100);
  }, [sprints]);

  const value = {
    sprints,
    loading,
    error,
    fetchSprints,
    addSprint,
    editSprint,
    deleteSprint,
    startSprint,
    completeSprint,
    getActiveSprint,
    getSprintVelocity
  };

  return (
    <SprintsContext.Provider value={value}>
      {children}
    </SprintsContext.Provider>
  );
}

export function useSprints() {
  const context = useContext(SprintsContext);
  if (!context) {
    throw new Error('useSprints must be used within a SprintsProvider');
  }
  return context;
}
