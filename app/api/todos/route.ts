import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/app/lib/db';

interface TodoRow {
  id: number;
  text: string;
  done: number;
}

// GET: 全てのtodoを取得
export async function GET() {
  try {
    const todos = getDb().prepare('SELECT id, text, done FROM todos ORDER BY created_at DESC').all() as TodoRow[];
    const result = todos.map(t => ({
      id: t.id,
      text: t.text,
      done: t.done === 1,
    }));
    return NextResponse.json(result);
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
    const result = getDb().prepare('INSERT INTO todos (text) VALUES (?)').run(text.trim());
    return NextResponse.json({
      id: result.lastInsertRowid as number,
      text: text.trim(),
      done: false,
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/todos error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: 完了済みtodoを一括削除
export async function DELETE() {
  try {
    getDb().prepare('DELETE FROM todos WHERE done = 1').run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/todos error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
