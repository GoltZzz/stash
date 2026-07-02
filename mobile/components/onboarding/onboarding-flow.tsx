import { useCallback, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  FadeInRight,
  FadeOutLeft,
  FadeInLeft,
  FadeOutRight,
} from 'react-native-reanimated';

import BudgetStep from '@/components/onboarding/steps/budget-step';
import CelebrationStep from '@/components/onboarding/steps/celebration-step';
import ExplainStep from '@/components/onboarding/steps/explain-step';
import WelcomeStep from '@/components/onboarding/steps/welcome-step';
import { useOnboardingForm } from '@/components/onboarding/use-onboarding-form';
import { useDatabase } from '@/providers/database-provider';
import { View } from '@/tw';
import { Animated } from '@/tw/animated';

export type OnboardingStep = 'welcome' | 'explain' | 'budget' | 'celebration';

const STEP_ORDER: OnboardingStep[] = [
  'welcome',
  'explain',
  'budget',
  'celebration',
];

export default function OnboardingFlow() {
  const { resumeAtCelebration, finishOnboarding } = useDatabase();
  const [step, setStep] = useState<OnboardingStep>(
    resumeAtCelebration ? 'celebration' : 'welcome',
  );
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const form = useOnboardingForm();

  useEffect(() => {
    void Haptics.selectionAsync();
  }, [step]);

  const goToNext = useCallback(() => {
    setDirection('forward');
    setStep((current) => {
      const index = STEP_ORDER.indexOf(current);
      return STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)];
    });
  }, []);

  const goBack = useCallback(() => {
    setDirection('back');
    setStep((current) => {
      const index = STEP_ORDER.indexOf(current);
      return STEP_ORDER[Math.max(index - 1, 0)];
    });
  }, []);

  const handleBudgetSubmit = useCallback(async () => {
    const saved = await form.submit();
    if (saved) {
      setDirection('forward');
      setStep('celebration');
    }
  }, [form]);

  const handleFinish = useCallback(async () => {
    await finishOnboarding();
  }, [finishOnboarding]);

  const entering =
    direction === 'forward'
      ? FadeInRight.duration(320)
      : FadeInLeft.duration(320);

  const exiting =
    direction === 'forward'
      ? FadeOutLeft.duration(240)
      : FadeOutRight.duration(240);

  return (
    <View className="flex-1 bg-fg-cream">
      <Animated.View
        key={step}
        entering={entering}
        exiting={exiting}
        className="flex-1">
        {step === 'welcome' ? <WelcomeStep onContinue={goToNext} /> : null}
        {step === 'explain' ? (
          <ExplainStep onContinue={goToNext} onBack={goBack} />
        ) : null}
        {step === 'budget' ? (
          <BudgetStep
            values={form.values}
            updateValues={form.updateValues}
            onSubmit={handleBudgetSubmit}
            submitting={form.submitting}
            error={form.error}
            isValid={form.isValid}
            onBack={goBack}
          />
        ) : null}
        {step === 'celebration' ? (
          <CelebrationStep onFinish={handleFinish} />
        ) : null}
      </Animated.View>
    </View>
  );
}
