import PrimaryButton from '@/components/onboarding/ui/primary-button';
import StepShell from '@/components/onboarding/ui/step-shell';
import { DisplayText } from '@/components/onboarding/ui/display-text';
import type { StepNavigationProps } from '@/components/onboarding/steps/shared';
import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { FadeInDown } from 'react-native-reanimated';

export default function WelcomeStep({ onContinue }: StepNavigationProps) {
  return (
    <StepShell
      footer={<PrimaryButton label="Continue" onPress={onContinue} />}>
      <View className="flex-1 justify-center gap-8">
        <Animated.View entering={FadeInDown.delay(80).duration(500)} className="gap-6">
          <View className="h-px w-12 bg-fg-line" />
          <DisplayText className="text-5xl leading-tight">
            Welcome to{' '}
            <Text
              className="text-5xl text-fg-orange"
              style={{ fontFamily: 'Fraunces_600SemiBold' }}>
              Stash
            </Text>
          </DisplayText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(500)}>
          <DisplayText italic className="text-xl leading-relaxed text-fg-ink-2">
            A simple way to stay on top of spending.
          </DisplayText>
        </Animated.View>
      </View>
    </StepShell>
  );
}
