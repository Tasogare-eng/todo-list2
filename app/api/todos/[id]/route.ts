import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/app/lib/db';

// PATCH: todoの完了状態をトグル
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    const todo = getDb().prepare('SELECT done FROM todos WHERE id = ?').get(numId) as
      | { done: number }
      | undefined;

    if (!todo) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }

    const newDone = todo.done === 1 ? 0 : 1;
    getDb().prepare('UPDATE todos SET done = ? WHERE id = ?').run(newDone, numId);

    return NextResponse.json({ id: numId, done: newDone === 1 });
  } catch (err) {
    console.error('PATCH /api/todos/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 個別のtodoを削除
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    getDb().prepare('DELETE FROM todos WHERE id = ?').run(numId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/todos/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
