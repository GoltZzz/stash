import * as SQLite from 'expo-sqlite';

import { migrate } from '@/db/schema';

let database: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) {
    return database;
  }

  if (!initPromise) {
    initPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('stash.db');
      await migrate(db);
      database = db;
      return db;
    })();
  }

  return initPromise;
}
