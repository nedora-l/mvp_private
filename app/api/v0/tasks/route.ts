import { NextRequest, NextResponse } from 'next/server';

// In-memory mock data (reset on server restart)
let tasks = [
  { id: 1, projectId: 1, title: 'Préparer la campagne marketing', status: 'En cours', description: 'Lancer la campagne sur tous les canaux', priority: 'Haute', createdAt: '2025-07-01', sprintId: 1 },
  { id: 2, projectId: 1, title: 'Analyser les résultats', status: 'À faire', description: '', priority: 'Normale', createdAt: '2025-07-02', sprintId: null },
  { id: 3, projectId: 2, title: 'Configurer les channels Slack', status: 'Terminé', description: '', priority: 'Basse', createdAt: '2025-07-03', sprintId: 2 },
  { id: 4, projectId: 3, title: 'Recrutement RH', status: 'En cours', description: '', priority: 'Normale', createdAt: '2025-07-04', sprintId: null },
  { id: 5, projectId: 4, title: 'Maquette design', status: 'À faire', description: '', priority: 'Haute', createdAt: '2025-07-05', sprintId: null },
];

export async function GET(req: NextRequest) {
  // Optionally filter by projectId: /api/v0/tasks?projectId=1
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  if (projectId) {
    return NextResponse.json({ tasks: tasks.filter(t => t.projectId === Number(projectId)) });
  }
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const projectIdNum = Number(data.projectId);
  if (!projectIdNum || !data.title || !data.status) {
    return NextResponse.json({ error: 'Missing or invalid projectId, title or status' }, { status: 400 });
  }
  const newTask = {
    id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    projectId: projectIdNum,
    title: data.title,
    status: data.status,
    description: data.description || '',
    priority: data.priority || 'Normale',
    createdAt: new Date().toISOString().slice(0, 10),
    sprintId: typeof data.sprintId === 'number' ? data.sprintId : null,
  };
  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data.id || !data.projectId || !data.title || !data.status) {
    return NextResponse.json({ error: 'Missing id, projectId, title or status' }, { status: 400 });
  }
  const idx = tasks.findIndex(t => t.id === data.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  tasks[idx] = {
    ...tasks[idx],
    ...data,
    description: data.description || '',
    priority: data.priority || 'Normale',
    sprintId: typeof data.sprintId === 'number' ? data.sprintId : null,
  };
  return NextResponse.json(tasks[idx]);
}

export async function DELETE(req: NextRequest) {
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
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  const deleted = tasks.splice(idx, 1)[0];
  return NextResponse.json(deleted);
}
