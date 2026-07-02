import GhostButton from '@/components/onboarding/ui/ghost-button';
import PrimaryButton from '@/components/onboarding/ui/primary-button';
import StepShell from '@/components/onboarding/ui/step-shell';
import { DisplayText } from '@/components/onboarding/ui/display-text';
import type { StepNavigationProps } from '@/components/onboarding/steps/shared';
import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';
import {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

function AnimatedProgressBar() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      400,
      withSpring(0.64, { damping: 18, stiffness: 90 }),
    );
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View className="h-1.5 overflow-hidden rounded-full bg-fg-orange-soft">
      <Animated.View
        className="h-1.5 rounded-full bg-fg-orange"
        style={barStyle}
      />
    </View>
  );
}

export default function ExplainStep({ onContinue, onBack }: StepNavigationProps) {
  return (
    <StepShell
      footer={
        <>
          {onBack ? <GhostButton label="Back" onPress={onBack} /> : null}
          <PrimaryButton label="Continue" onPress={onContinue} />
        </>
      }>
      <View className="gap-8 pt-4">
        <Animated.View entering={FadeInDown.delay(80).duration(500)} className="gap-3">
          <DisplayText className="text-4xl leading-tight">
            Set a budget. Watch what{"'"}s left.
          </DisplayText>
          <Text className="text-lg leading-relaxed text-fg-ink-2">
            Choose a spending limit for a week or month. As you track expenses,
            you{"'"}ll see what{"'"}s left.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(240).duration(500)}
          className="gap-4 rounded-2xl border border-fg-line bg-white p-5 shadow-sm">
          <View className="flex-row justify-between">
            <Text className="text-sm font-semibold tracking-wide text-fg-ink">
              Monthly budget
            </Text>
            <Text className="text-sm text-fg-ink-2">₱5,000</Text>
          </View>
          <AnimatedProgressBar />
          <Text className="text-sm font-semibold text-fg-orange">₱3,200 left</Text>
        </Animated.View>
      </View>
    </StepShell>
  );
}
