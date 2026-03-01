import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

interface TodoRow {
  id: number;
  text: string;
  done: number;
}

// GET: 全てのtodoを取得
export async function GET() {
  const todos = db.prepare('SELECT id, text, done FROM todos ORDER BY created_at DESC').all() as TodoRow[];
  const result = todos.map(t => ({
    id: t.id,
    text: t.text,
    done: t.done === 1,
  }));
  return NextResponse.json(result);
}

// POST: 新しいtodoを追加
export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }
  const result = db.prepare('INSERT INTO todos (text) VALUES (?)').run(text.trim());
  return NextResponse.json({
    id: result.lastInsertRowid as number,
    text: text.trim(),
    done: false,
  }, { status: 201 });
}

// DELETE: 完了済みtodoを一括削除
export async function DELETE() {
  db.prepare('DELETE FROM todos WHERE done = 1').run();
  return NextResponse.json({ ok: true });
}
