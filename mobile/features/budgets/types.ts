export type BudgetPeriodType = 'weekly' | 'monthly' | 'custom';

export type Budget = {
  id: string;
  amount: number;
  currency: string;
  periodType: BudgetPeriodType;
  periodDays: number | null;
  createdAt: string;
  updatedAt: string;
};

export type BudgetPayload = {
  amount: number;
  currency: string;
  periodType: BudgetPeriodType;
  periodDays?: number;
};

export const CURRENCIES = ['PHP', 'USD', 'EUR'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const PERIOD_OPTIONS: { label: string; value: BudgetPeriodType }[] = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom', value: 'custom' },
];
