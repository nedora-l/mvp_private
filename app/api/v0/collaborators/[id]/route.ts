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

const dataPath = path.join(process.cwd(), 'data', 'collaborators.json');

async function getCollaborators(): Promise<Collaborator[]> {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveCollaborators(collaborators: Collaborator[]): Promise<void> {
  await fs.writeFile(dataPath, JSON.stringify(collaborators, null, 2));
}

// GET - Récupérer un collaborateur par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collaborators = await getCollaborators();
    const collaborator = collaborators.find(c => c.id === params.id);
    
    if (!collaborator) {
      return NextResponse.json(
        { error: 'Collaborateur non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(collaborator);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du collaborateur' },
      { status: 500 }
    );
  }
}

// PUT - Modifier un collaborateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collaboratorData = await request.json();
    const collaborators = await getCollaborators();
    const index = collaborators.findIndex(c => c.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Collaborateur non trouvé' },
        { status: 404 }
      );
    }
    
    collaborators[index] = {
      ...collaborators[index],
      ...collaboratorData,
      id: params.id // Assurer que l'ID ne change pas
    };
    
    await saveCollaborators(collaborators);
    return NextResponse.json(collaborators[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la modification du collaborateur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un collaborateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collaborators = await getCollaborators();
    const index = collaborators.findIndex(c => c.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Collaborateur non trouvé' },
        { status: 404 }
      );
    }
    
    collaborators.splice(index, 1);
    await saveCollaborators(collaborators);
    
    return NextResponse.json({ message: 'Collaborateur supprimé avec succès' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du collaborateur' },
      { status: 500 }
    );
  }
}
