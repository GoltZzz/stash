export type StepNavigationProps = {
  onContinue: () => void;
  onBack?: () => void;
};

export type BudgetStepProps = {
  values: import('@/components/onboarding/types').OnboardingFormValues;
  updateValues: (
    patch: Partial<import('@/components/onboarding/types').OnboardingFormValues>,
  ) => void;
  onSubmit: () => void | Promise<void>;
  submitting: boolean;
  error: string | null;
  isValid: boolean;
  onBack?: () => void;
};

export type CelebrationStepProps = {
  onFinish: () => void | Promise<void>;
};
