import type { BudgetPayload, BudgetPeriodType } from '@/features/budgets/types';
import { CURRENCIES } from '@/features/budgets/types';

export type OnboardingFormValues = {
  amount: string;
  currency: (typeof CURRENCIES)[number];
  periodType: BudgetPeriodType;
  periodDays: string;
};

export const DEFAULT_ONBOARDING_VALUES: OnboardingFormValues = {
  amount: '',
  currency: 'PHP',
  periodType: 'monthly',
  periodDays: '',
};

export function validateOnboardingForm(
  values: OnboardingFormValues,
): BudgetPayload | null {
  const amount = Number.parseFloat(values.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  if (!CURRENCIES.includes(values.currency)) {
    return null;
  }

  if (values.periodType === 'custom') {
    const periodDays = Number.parseInt(values.periodDays, 10);
    if (!Number.isFinite(periodDays) || periodDays < 1) {
      return null;
    }

    return {
      amount,
      currency: values.currency,
      periodType: values.periodType,
      periodDays,
    };
  }

  return {
    amount,
    currency: values.currency,
    periodType: values.periodType,
  };
}

export function isOnboardingFormValid(values: OnboardingFormValues): boolean {
  return validateOnboardingForm(values) !== null;
}
