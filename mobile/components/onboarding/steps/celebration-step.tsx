import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';

import PrimaryButton from '@/components/onboarding/ui/primary-button';
import StepShell from '@/components/onboarding/ui/step-shell';
import { DisplayText } from '@/components/onboarding/ui/display-text';
import type { CelebrationStepProps } from '@/components/onboarding/steps/shared';
import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function CelebrationStep({ onFinish }: CelebrationStepProps) {
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (process.env.EXPO_OS === 'ios') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const handleFinish = async () => {
    setFinishing(true);
    try {
      await onFinish();
    } finally {
      setFinishing(false);
    }
  };

  return (
    <StepShell
      footer={
        <PrimaryButton
          label={finishing ? 'Opening Stash...' : 'Continue to Stash'}
          disabled={finishing}
          onPress={handleFinish}
        />
      }>
      <View className="flex-1 justify-center gap-6">
        <Animated.View
          entering={ZoomIn.delay(100).springify().damping(14)}
          className="h-20 w-20 items-center justify-center rounded-full bg-fg-orange">
          <Text className="text-3xl font-bold text-white">✓</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280).duration(500)} className="gap-3">
          <DisplayText className="text-4xl leading-tight">You{"'"}re all set</DisplayText>
          <Text className="text-lg leading-relaxed text-fg-ink-2">
            Your budget is saved on this device.
          </Text>
        </Animated.View>
      </View>
    </StepShell>
  );
}
