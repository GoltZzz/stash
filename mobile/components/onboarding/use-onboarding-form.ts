import { useCallback, useState } from 'react';

import {
  DEFAULT_ONBOARDING_VALUES,
  isOnboardingFormValid,
  type OnboardingFormValues,
  validateOnboardingForm,
} from '@/components/onboarding/types';
import { useDatabase } from '@/providers/database-provider';

export function useOnboardingForm() {
  const { saveBudget } = useDatabase();
  const [values, setValues] = useState<OnboardingFormValues>(
    DEFAULT_ONBOARDING_VALUES,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = isOnboardingFormValid(values);

  const updateValues = useCallback(
    (patch: Partial<OnboardingFormValues>) => {
      setValues((current) => ({ ...current, ...patch }));
      setError(null);
    },
    [],
  );

  const submit = useCallback(async (): Promise<boolean> => {
    const payload = validateOnboardingForm(values);
    if (!payload) {
      return false;
    }

    setSubmitting(true);
    setError(null);

    try {
      await saveBudget(payload);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save budget');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [saveBudget, values]);

  return {
    values,
    updateValues,
    submit,
    submitting,
    error,
    isValid,
  };
}
