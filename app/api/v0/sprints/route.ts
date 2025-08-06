import { NextRequest, NextResponse } from 'next/server';

// In-memory mock data (reset on server restart)
let sprints = [
  { id: 1, name: 'Sprint 1', startDate: '2025-07-01', endDate: '2025-07-15' },
  { id: 2, name: 'Sprint 2', startDate: '2025-07-16', endDate: '2025-07-31' },
];

export async function GET() {
  return NextResponse.json({ sprints });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.name || !data.startDate || !data.endDate) {
    return NextResponse.json({ error: 'Missing name, startDate or endDate' }, { status: 400 });
  }
  const newSprint = {
    id: sprints.length ? Math.max(...sprints.map(s => s.id)) + 1 : 1,
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
  };
  sprints.push(newSprint);
  return NextResponse.json(newSprint, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data.id || !data.name || !data.startDate || !data.endDate) {
    return NextResponse.json({ error: 'Missing id, name, startDate or endDate' }, { status: 400 });
  }
  const idx = sprints.findIndex(s => s.id === data.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
  }
  sprints[idx] = { ...sprints[idx], ...data };
  return NextResponse.json(sprints[idx]);
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
  const idx = sprints.findIndex(s => s.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
  }
  const deleted = sprints.splice(idx, 1)[0];
  return NextResponse.json(deleted);
}
