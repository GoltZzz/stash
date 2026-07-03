import type { Budget } from '@/features/budgets/types';

export function periodLabel(budget: Budget): string {
  if (budget.periodType === 'weekly') return 'per week';
  if (budget.periodType === 'monthly') return 'per month';
  return `every ${budget.periodDays ?? 30} days`;
}

export function periodLengthDays(budget: Budget): number {
  if (budget.periodType === 'weekly') return 7;
  if (budget.periodType === 'monthly') return 30;
  return budget.periodDays ?? 30;
}

export function daysElapsedInPeriod(budget: Budget): number {
  const length = periodLengthDays(budget);
  const elapsedMs = Date.now() - new Date(budget.createdAt).getTime();
  const elapsedDays = Math.max(0, Math.floor(elapsedMs / 86_400_000));
  return elapsedDays % length;
}

export function daysLeftInPeriod(budget: Budget): number {
  const length = periodLengthDays(budget);
  return length - daysElapsedInPeriod(budget);
}

export function periodProgress(budget: Budget): number {
  const length = periodLengthDays(budget);
  return Math.min(100, Math.round((daysElapsedInPeriod(budget) / length) * 100));
}

export function todayAllowance(budget: Budget): number {
  return budget.amount / periodLengthDays(budget);
}

export function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function catStatusMessage(budget: Budget | null, loading: boolean): string {
  if (loading) return 'Crunching the numbers…';
  if (!budget) return 'Set a budget and I\'ll be your stash buddy.';

  const daysLeft = daysLeftInPeriod(budget);
  const length = periodLengthDays(budget);

  if (daysLeft <= 1) return 'Last day of the period. Spend like I\'m watching.';
  if (daysLeft <= 2) return 'Tight stretch ahead. Every peso counts.';
  if (daysLeft > length * 0.6) return 'Plenty of stash left. Treat yourself—or don\'t.';
  return 'Pacing looks good. The cat approves.';
}
