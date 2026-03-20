import { drizzle } from "drizzle-orm/better-sqlite3";
import { config } from "@/lib/config";
import * as schema from "./schema";

function createDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  const sqlite = new Database(config.databasePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzle(sqlite, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDatabase() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// For backwards compatibility - lazily create DB
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop: string | symbol) {
    const instance = getDatabase();
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

export type Db = ReturnType<typeof createDb>;
