'use client';

import { useState, useEffect, useRef } from 'react';

type Filter = 'all' | 'active' | 'completed';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) setTodos(JSON.parse(stored));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos, mounted]);

  const add = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
    setInput('');
    inputRef.current?.focus();
  };

  const toggle = (id: number) =>
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const remove = (id: number) =>
    setTodos(prev => prev.filter(t => t.id !== id));

  const clearCompleted = () =>
    setTodos(prev => prev.filter(t => !t.done));

  const visible = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  const remaining = todos.filter(t => !t.done).length;
  const hasCompleted = todos.some(t => t.done);

  const filters: { label: string; value: Filter }[] = [
    { label: 'すべて', value: 'all' },
    { label: '未完了', value: 'active' },
    { label: '完了', value: 'completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Todo</h1>

        {/* 入力フォーム */}
        <form
          onSubmit={e => { e.preventDefault(); add(); }}
          className="flex gap-2 mb-4"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            追加
          </button>
        </form>

        {/* フィルター */}
        <div className="flex gap-1 mb-4">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                filter === f.value
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* リスト */}
        <ul className="flex flex-col gap-2 min-h-8">
          {visible.length === 0 ? (
            <li className="text-center text-sm text-gray-400 py-8">
              タスクがありません
            </li>
          ) : (
            visible.map(todo => (
              <li
                key={todo.id}
                className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all ${
                  todo.done
                    ? 'border-gray-100 opacity-50'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                <input
                  type="checkbox"
                  id={`todo-${todo.id}`}
                  checked={todo.done}
                  onChange={() => toggle(todo.id)}
                  className="w-4 h-4 accent-indigo-600 cursor-pointer flex-shrink-0"
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`flex-1 text-sm cursor-pointer break-all ${
                    todo.done ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {todo.text}
                </label>
                <button
                  onClick={() => remove(todo.id)}
                  aria-label="削除"
                  className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none px-1"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>

        {/* フッター */}
        {todos.length > 0 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">残り {remaining} 件</span>
            {hasCompleted && (
              <button
                onClick={clearCompleted}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-50"
              >
                完了を削除
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
