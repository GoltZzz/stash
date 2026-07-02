import type * as SQLite from 'expo-sqlite';

const MIGRATIONS: Record<number, string> = {
  1: `
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'PHP',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `,
  2: `
    ALTER TABLE budgets ADD COLUMN period_type TEXT NOT NULL DEFAULT 'monthly';
    ALTER TABLE budgets ADD COLUMN period_days INTEGER;

    CREATE TABLE IF NOT EXISTS app_meta (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      onboarding_completed_at TEXT
    );

    INSERT OR IGNORE INTO app_meta (id, onboarding_completed_at) VALUES (1, NULL);
  `,
};

export async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  let version = result?.user_version ?? 0;

  while (MIGRATIONS[version + 1]) {
    version += 1;
    const sql = MIGRATIONS[version];
    await db.execAsync(sql);
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
}
