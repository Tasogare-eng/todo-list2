import { NextRequest, NextResponse } from 'next/server';
import { readTodos, writeTodos } from '@/app/lib/db';

// GET: 全てのtodoを取得
export async function GET() {
  try {
    const todos = await readTodos();
    return NextResponse.json(todos);
  } catch (err) {
    console.error('GET /api/todos error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: 新しいtodoを追加
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const todos = await readTodos();
    const newTodo = { id: Date.now(), text: text.trim(), done: false };
    todos.unshift(newTodo);
    await writeTodos(todos);

    return NextResponse.json(newTodo, { status: 201 });
  } catch (err) {
    console.error('POST /api/todos error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 完了済みtodoを一括削除
export async function DELETE() {
  try {
    const todos = await readTodos();
    const remaining = todos.filter(t => !t.done);
    await writeTodos(remaining);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/todos error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
