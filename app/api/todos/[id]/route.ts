import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

// PATCH: todoの完了状態をトグル
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  const todo = db.prepare('SELECT done FROM todos WHERE id = ?').get(numId) as
    | { done: number }
    | undefined;

  if (!todo) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const newDone = todo.done === 1 ? 0 : 1;
  db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(newDone, numId);

  return NextResponse.json({ id: numId, done: newDone === 1 });
}

// DELETE: 個別のtodoを削除
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  db.prepare('DELETE FROM todos WHERE id = ?').run(numId);
  return NextResponse.json({ ok: true });
}
