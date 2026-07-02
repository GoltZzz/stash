import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';

import GhostButton from '@/components/onboarding/ui/ghost-button';
import PrimaryButton from '@/components/onboarding/ui/primary-button';
import StepShell from '@/components/onboarding/ui/step-shell';
import { DisplayText } from '@/components/onboarding/ui/display-text';
import type { BudgetStepProps } from '@/components/onboarding/steps/shared';
import {
  CURRENCIES,
  PERIOD_OPTIONS,
  type BudgetPeriodType,
  type Currency,
} from '@/features/budgets/types';
import { Pressable, Text, TextInput, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { FadeInDown } from 'react-native-reanimated';

function SelectionChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const handlePress = useCallback(() => {
    void Haptics.selectionAsync();
    onPress();
  }, [onPress]);

  return (
    <Pressable
      className={`rounded-full px-4 py-2.5 ${
        selected ? 'bg-fg-orange' : 'bg-fg-orange-soft'
      }`}
      onPress={handlePress}>
      <Text
        className={`text-sm font-medium ${
          selected ? 'text-white' : 'text-fg-ink'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function BudgetStep({
  values,
  updateValues,
  onSubmit,
  submitting,
  error,
  isValid,
  onBack,
}: BudgetStepProps) {
  const [amountFocused, setAmountFocused] = useState(false);
  const showCustomDays = values.periodType === 'custom';

  return (
    <StepShell
      footer={
        <>
          {onBack ? <GhostButton label="Back" onPress={onBack} /> : null}
          <PrimaryButton
            label={submitting ? 'Saving...' : 'Continue'}
            disabled={!isValid || submitting}
            onPress={onSubmit}
          />
        </>
      }>
      <View className="gap-6">
        <Animated.View entering={FadeInDown.delay(80).duration(500)} className="gap-2">
          <DisplayText className="text-4xl leading-tight">Your first budget</DisplayText>
          <Text className="text-lg leading-relaxed text-fg-ink-2">
            A rough estimate is fine — you can change this anytime.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)} className="gap-5">
          <View className="gap-2">
            <Text className="text-sm font-medium tracking-wide text-fg-ink-2">
              Budget amount
            </Text>
            <TextInput
              className={`border-b pb-2 text-4xl text-fg-ink ${
                amountFocused ? 'border-fg-orange' : 'border-fg-line'
              }`}
              style={{ fontFamily: 'Fraunces_600SemiBold' }}
              value={values.amount}
              onChangeText={(amount) => updateValues({ amount })}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="rgb(120, 98, 82)"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium tracking-wide text-fg-ink-2">
              Currency
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CURRENCIES.map((currency) => (
                <SelectionChip
                  key={currency}
                  label={currency}
                  selected={values.currency === currency}
                  onPress={() =>
                    updateValues({ currency: currency as Currency })
                  }
                />
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium tracking-wide text-fg-ink-2">
              Budget period
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <SelectionChip
                  key={option.value}
                  label={option.label}
                  selected={values.periodType === option.value}
                  onPress={() =>
                    updateValues({
                      periodType: option.value as BudgetPeriodType,
                    })
                  }
                />
              ))}
            </View>
          </View>

          {showCustomDays ? (
            <View className="gap-2">
              <Text className="text-sm font-medium tracking-wide text-fg-ink-2">
                Custom period (days)
              </Text>
              <TextInput
                className="border-b border-fg-line pb-2 text-2xl text-fg-ink"
                style={{ fontFamily: 'Fraunces_600SemiBold' }}
                value={values.periodDays}
                onChangeText={(periodDays) => updateValues({ periodDays })}
                keyboardType="number-pad"
                placeholder="30"
                placeholderTextColor="rgb(120, 98, 82)"
              />
            </View>
          ) : null}
        </Animated.View>

        {error ? (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Text className="text-sm text-fg-red">{error}</Text>
          </Animated.View>
        ) : null}
      </View>
    </StepShell>
  );
}
