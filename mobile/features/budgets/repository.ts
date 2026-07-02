import type * as SQLite from 'expo-sqlite';

import type { Budget, BudgetPayload } from '@/features/budgets/types';

type BudgetRow = {
  id: string;
  amount: number;
  currency: string;
  period_type: Budget['periodType'];
  period_days: number | null;
  created_at: string;
  updated_at: string;
};

function rowToBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    periodType: row.period_type,
    periodDays: row.period_days,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createBudgetId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export async function hasCompletedOnboarding(
  db: SQLite.SQLiteDatabase,
): Promise<boolean> {
  const row = await db.getFirstAsync<{ onboarding_completed_at: string | null }>(
    'SELECT onboarding_completed_at FROM app_meta WHERE id = 1',
  );
  return row?.onboarding_completed_at != null;
}

export async function createBudget(
  db: SQLite.SQLiteDatabase,
  payload: BudgetPayload,
): Promise<Budget> {
  const now = new Date().toISOString();
  const id = createBudgetId();
  const periodDays =
    payload.periodType === 'custom' ? (payload.periodDays ?? null) : null;

  await db.runAsync(
    `INSERT INTO budgets (id, amount, currency, period_type, period_days, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    payload.amount,
    payload.currency,
    payload.periodType,
    periodDays,
    now,
    now,
  );

  const row = await db.getFirstAsync<BudgetRow>(
    'SELECT * FROM budgets WHERE id = ?',
    id,
  );

  if (!row) {
    throw new Error('Failed to create budget');
  }

  return rowToBudget(row);
}

export async function hasSavedBudget(
  db: SQLite.SQLiteDatabase,
): Promise<boolean> {
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM budgets',
  );
  return (row?.count ?? 0) > 0;
}

export async function markOnboardingComplete(
  db: SQLite.SQLiteDatabase,
): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    'UPDATE app_meta SET onboarding_completed_at = ? WHERE id = 1',
    now,
  );
}

export async function completeOnboarding(
  db: SQLite.SQLiteDatabase,
  payload: BudgetPayload,
): Promise<Budget> {
  let budget: Budget | null = null;

  await db.withTransactionAsync(async () => {
    budget = await createBudget(db, payload);
    await markOnboardingComplete(db);
  });

  if (!budget) {
    throw new Error('Failed to complete onboarding');
  }

  return budget;
}
