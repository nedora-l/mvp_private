import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Chemin vers le fichier de persistence
const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

// Fonctions de persistence (copiées du route.ts parent)
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function loadProjects() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveProjects(projects: any[]) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
}

// GET /api/v0/projects/[id] - Récupérer un projet par ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const projects = await loadProjects();
  const project = projects.find((p: any) => p.id === id);
  
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PUT /api/v0/projects/[id] - Modifier un projet
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const data = await req.json();
  console.log("🔄 PUT /api/v0/projects/" + id, data);

  const projects = await loadProjects();
  const index = projects.findIndex((p: any) => p.id === id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Mise à jour du projet avec conservation de l'ID
  projects[index] = {
    id: id,
    name: data.name || projects[index].name,
    type: data.type || projects[index].type,
    description: data.description || projects[index].description,
    // Ajouter les champs supplémentaires du type Project si nécessaires
    customType: data.customType || '',
    status: data.status || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    members: data.members || '',
  };

  await saveProjects(projects);
  console.log("✅ Project updated and saved:", projects[index]);

  return NextResponse.json(projects[index]);
}

// DELETE /api/v0/projects/[id] - Supprimer un projet
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  console.log("🔄 DELETE /api/v0/projects/" + id);

  const projects = await loadProjects();
  const index = projects.findIndex((p: any) => p.id === id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const deletedProject = projects.splice(index, 1)[0];
  await saveProjects(projects);
  console.log("✅ Project deleted and saved:", deletedProject);

  return NextResponse.json(deletedProject);
}
