import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

function getDb() {
  const dbPath = path.join(process.cwd(), 'data', 'todos.db');
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  return db;
}

// Singleton: reuse across requests
let _db: ReturnType<typeof Database> | null = null;

function db() {
  if (!_db) {
    _db = getDb();
  }
  return _db;
}

export default db;
