import { put, list } from '@vercel/blob';

const BLOB_NAME = 'data.json';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// Blobから data.json を読み込む
export async function readTodos(): Promise<Todo[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    const blob = blobs.find(b => b.pathname === BLOB_NAME);
    if (!blob) return [];

    const res = await fetch(blob.url);
    const data: Todo[] = await res.json();
    return data;
  } catch {
    return [];
  }
}

// Blobに data.json を書き込む
export async function writeTodos(todos: Todo[]): Promise<void> {
  await put(BLOB_NAME, JSON.stringify(todos), {
    access: 'public',
    addRandomSuffix: false,
  });
}
