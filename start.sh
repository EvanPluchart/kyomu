#!/bin/sh
set -e

echo "[kyomu] Running database migrations..."
node -e "
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './data/kyomu.db';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Find better-sqlite3 native module in pnpm store
const bsq3Path = require.resolve('better-sqlite3', {
  paths: [
    path.join(process.cwd(), 'node_modules'),
    path.join(process.cwd(), 'node_modules/.pnpm/node_modules'),
  ]
});
const Database = require(bsq3Path);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.prepare('CREATE TABLE IF NOT EXISTS __drizzle_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, hash TEXT NOT NULL, created_at INTEGER NOT NULL)').run();

const migrationsDir = path.join(process.cwd(), 'drizzle');
const journal = JSON.parse(fs.readFileSync(path.join(migrationsDir, 'meta', '_journal.json'), 'utf-8'));
const applied = db.prepare('SELECT hash FROM __drizzle_migrations').all().map(function(r) { return r.hash; });

for (const entry of journal.entries) {
  if (!applied.includes(entry.tag)) {
    const sql = fs.readFileSync(path.join(migrationsDir, entry.tag + '.sql'), 'utf-8');
    db.exec(sql);
    db.prepare('INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)').run(entry.tag, Date.now());
    console.warn('[kyomu] Applied migration:', entry.tag);
  }
}

db.close();
console.warn('[kyomu] Database ready');
"

echo "[kyomu] Starting server..."
node server.js
