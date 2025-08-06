import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Types pour le projet
interface ProjectData {
  id: number;
  name: string;
  type: string;
  description: string;
  customType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  members?: string;
}

// Chemin vers le fichier de persistence
const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json');

// Données par défaut
const DEFAULT_PROJECTS: ProjectData[] = [
  { id: 1, name: 'Jira - Marketing', type: 'Jira', description: 'Projet marketing sur Jira' },
  { id: 2, name: 'Slack - Dev Team', type: 'Slack', description: 'Développement sur Slack' },
  { id: 3, name: 'Jira - RH', type: 'Jira', description: 'Gestion RH sur Jira' },
  { id: 4, name: 'Trello - Design', type: 'Trello', description: 'Design sur Trello' },
];

// Fonctions de persistence
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function loadProjects(): Promise<ProjectData[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    // Si le fichier n'existe pas, créer avec les données par défaut
    await saveProjects(DEFAULT_PROJECTS);
    return DEFAULT_PROJECTS;
  }
}

async function saveProjects(projects: ProjectData[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
}

export async function GET() {
  const projects = await loadProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("🔄 POST /api/v0/projects", data);
  
  if (!data.name || !data.type) {
    return NextResponse.json({ error: 'Missing name or type' }, { status: 400 });
  }
  
  const projects = await loadProjects();
  const newProject: ProjectData = {
    id: projects.length ? Math.max(...projects.map((p: ProjectData) => p.id)) + 1 : 1,
    name: data.name,
    type: data.type,
    description: data.description || '',
    // Support des champs supplémentaires du type Project
    customType: data.customType || '',
    status: data.status || '',
    startDate: data.startDate || '',
    endDate: data.endDate || '',
    members: data.members || '',
  };
  
  projects.push(newProject);
  await saveProjects(projects);
  console.log("✅ Project created and saved:", newProject);
  
  return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data.id || !data.name || !data.type) {
    return NextResponse.json({ error: 'Missing id, name or type' }, { status: 400 });
  }
  
  const projects = await loadProjects();
  const idx = projects.findIndex((p: ProjectData) => p.id === data.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  
  projects[idx] = { ...projects[idx], ...data };
  await saveProjects(projects);
  
  return NextResponse.json(projects[idx]);
}

export async function DELETE(req: NextRequest) {
  // Accept id in body or as ?id= param
  let id = undefined;
  if (req.method === 'DELETE') {
    const url = new URL(req.url);
    id = url.searchParams.get('id');
    if (!id) {
      try {
        const data = await req.json();
        id = data.id;
      } catch {}
    }
  }
  
  id = Number(id);
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  
  const projects = await loadProjects();
  const idx = projects.findIndex((p: ProjectData) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  
  const deleted = projects.splice(idx, 1)[0];
  await saveProjects(projects);
  
  return NextResponse.json(deleted);
}
