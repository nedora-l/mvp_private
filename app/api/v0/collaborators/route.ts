import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Interface pour les collaborateurs
interface Collaborator {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  active: boolean;
  dateAdded: string;
}

// Chemin du fichier JSON
const dataPath = path.join(process.cwd(), 'data', 'collaborators.json');

// Fonction pour lire les collaborateurs
async function getCollaborators(): Promise<Collaborator[]> {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture collaborators.json:', error);
    return [];
  }
}

// Fonction pour sauvegarder les collaborateurs
async function saveCollaborators(collaborators: Collaborator[]): Promise<void> {
  try {
    await fs.writeFile(dataPath, JSON.stringify(collaborators, null, 2));
  } catch (error) {
    console.error('Erreur sauvegarde collaborators.json:', error);
    throw error;
  }
}

// GET - Récupérer tous les collaborateurs
export async function GET() {
  try {
    const collaborators = await getCollaborators();
    return NextResponse.json(collaborators);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des collaborateurs' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau collaborateur
export async function POST(request: NextRequest) {
  try {
    const collaboratorData = await request.json();
    const collaborators = await getCollaborators();
    
    // Générer un nouvel ID
    const newId = (Math.max(...collaborators.map(c => parseInt(c.id)), 0) + 1).toString();
    
    const newCollaborator: Collaborator = {
      id: newId,
      name: collaboratorData.name,
      role: collaboratorData.role,
      email: collaboratorData.email,
      department: collaboratorData.department,
      active: true,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    collaborators.push(newCollaborator);
    await saveCollaborators(collaborators);
    
    return NextResponse.json(newCollaborator, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du collaborateur' },
      { status: 500 }
    );
  }
}
