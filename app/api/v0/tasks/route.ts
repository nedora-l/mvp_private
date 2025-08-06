import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const tasksFilePath = path.join(process.cwd(), 'data', 'tasks.json');

// Fonction utilitaire pour lire les tâches
async function readTasks() {
  try {
    const data = await fs.readFile(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture tasks.json:', error);
    return [];
  }
}

// Fonction utilitaire pour écrire les tâches
async function writeTasks(tasks: any[]) {
  try {
    await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Erreur écriture tasks.json:', error);
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const tasks = await readTasks();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    
    if (projectId) {
      const filteredTasks = tasks.filter((t: any) => t.projectId === Number(projectId));
      return NextResponse.json({ tasks: filteredTasks });
    }
    
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Erreur GET tasks:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const projectIdNum = Number(data.projectId);
    
    if (!projectIdNum || !data.title || !data.status) {
      return NextResponse.json({ error: 'Missing or invalid projectId, title or status' }, { status: 400 });
    }
    
    const tasks = await readTasks();
    const newTask = {
      id: tasks.length ? Math.max(...tasks.map((t: any) => t.id)) + 1 : 1,
      projectId: projectIdNum,
      title: data.title,
      status: data.status,
      description: data.description || '',
      priority: data.priority || 'normale',
      createdAt: new Date().toISOString().slice(0, 10),
      dueDate: data.dueDate || null,
      assignedTo: data.assignedTo || '',
      sprintId: typeof data.sprintId === 'number' ? data.sprintId : null,
    };
    
    tasks.push(newTask);
    await writeTasks(tasks);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Erreur POST tasks:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.id || !data.projectId || !data.title || !data.status) {
      return NextResponse.json({ error: 'Missing id, projectId, title or status' }, { status: 400 });
    }
    
    const tasks = await readTasks();
    const idx = tasks.findIndex((t: any) => t.id === data.id);
    
    if (idx === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    tasks[idx] = {
      ...tasks[idx],
      ...data,
      description: data.description || '',
      priority: data.priority || 'normale',
      sprintId: typeof data.sprintId === 'number' ? data.sprintId : null,
    };
    
    await writeTasks(tasks);
    return NextResponse.json(tasks[idx]);
  } catch (error) {
    console.error('Erreur PUT tasks:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
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
    
    const tasks = await readTasks();
    const idx = tasks.findIndex((t: any) => t.id === id);
    
    if (idx === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    const deleted = tasks.splice(idx, 1)[0];
    await writeTasks(tasks);
    
    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Erreur DELETE tasks:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
