import { NextRequest, NextResponse } from 'next/server';
import { readTodos, writeTodos } from '@/app/lib/db';

// PATCH: todoの完了状態をトグル
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    const todos = await readTodos();
    const todo = todos.find(t => t.id === numId);
    if (!todo) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }

    todo.done = !todo.done;
    await writeTodos(todos);

    return NextResponse.json({ id: numId, done: todo.done });
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

    const todos = await readTodos();
    const filtered = todos.filter(t => t.id !== numId);
    await writeTodos(filtered);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/todos/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
