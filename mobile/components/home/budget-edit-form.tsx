import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import type { NativeSyntheticEvent, TextInputSelectionChangeEventData } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useDatabase } from '@/providers/database-provider';
import { Text, TextInput, View, ScrollView } from '@/tw';
import { Animated } from '@/tw/animated';
import {
  CURRENCIES,
  PERIOD_OPTIONS,
  type BudgetPeriodType,
  type Currency,
} from '@/features/budgets/types';
import {
  formatAmountWithCommas,
  sanitizeAmountInput,
} from '@/features/budgets/amount-format';
import PrimaryButton from '@/components/onboarding/ui/primary-button';
import { formatAmount } from './budget-helpers';
import SelectionChip from './selection-chip';
import { TreatJarIcon } from './cat-icons';

const JAR_BODY_HEIGHT = 88;
const JAR_MAX_FILL = JAR_BODY_HEIGHT * 0.72;

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  PHP: '₱',
};

function periodDaysForPreview(
  periodType: BudgetPeriodType,
  periodDays: string,
): number {
  if (periodType === 'weekly') return 7;
  if (periodType === 'monthly') return 30;
  const parsed = parseInt(periodDays, 10);
  return parsed > 0 ? parsed : 30;
}

type BudgetEditFormProps = {
  onSaveSuccess: () => void;
};

export default function BudgetEditForm({ onSaveSuccess }: BudgetEditFormProps) {
  const { latestBudget, modifyBudget } = useDatabase();
  const reducedMotion = useReducedMotion();
  const fillProgress = useSharedValue(0);

  const [amount, setAmount] = useState(() =>
    latestBudget?.amount ? String(latestBudget.amount) : '',
  );
  const [amountFocused, setAmountFocused] = useState(false);
  const formattedAmount = formatAmountWithCommas(amount);
  const [amountSelection, setAmountSelection] = useState(() => {
    const initial = latestBudget?.amount ? String(latestBudget.amount) : '';
    const formatted = formatAmountWithCommas(initial);
    return { start: formatted.length, end: formatted.length };
  });

  const [currency, setCurrency] = useState<Currency>(
    () => (latestBudget?.currency as Currency) ?? 'USD',
  );
  const [periodType, setPeriodType] = useState<BudgetPeriodType>(
    () => latestBudget?.periodType ?? 'weekly',
  );
  const [periodDays, setPeriodDays] = useState(() =>
    latestBudget?.periodDays ? String(latestBudget.periodDays) : '',
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount);
  const isValid =
    amount.length > 0 &&
    parsedAmount > 0 &&
    (periodType !== 'custom' ||
      (periodDays.length > 0 && parseInt(periodDays, 10) > 0));

  const dailyAllowance =
    parsedAmount > 0
      ? parsedAmount / periodDaysForPreview(periodType, periodDays)
      : 0;

  const targetFill = Math.min(
    1,
    parsedAmount > 0 ? Math.log10(parsedAmount + 1) / 4 : 0,
  );

  useEffect(() => {
    fillProgress.value = reducedMotion
      ? targetFill
      : withSpring(targetFill, { damping: 16, stiffness: 120 });
  }, [targetFill, reducedMotion, fillProgress]);

  const jarFillStyle = useAnimatedStyle(() => ({
    height: fillProgress.value * JAR_MAX_FILL,
  }));

  const handleAmountChange = useCallback((raw: string) => {
    const sanitized = sanitizeAmountInput(raw);
    const formatted = formatAmountWithCommas(sanitized);
    setAmount(sanitized);
    setAmountSelection({ start: formatted.length, end: formatted.length });
  }, []);

  const handleAmountSelectionChange = useCallback(
    (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      setAmountSelection(event.nativeEvent.selection);
    },
    [],
  );

  const handleSave = async () => {
    if (!latestBudget || !isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await modifyBudget(latestBudget.id, {
        amount: parsedAmount,
        currency,
        periodType,
        periodDays: periodType === 'custom' ? parseInt(periodDays, 10) : undefined,
      });
      onSaveSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to update budget';
      setError(message);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!latestBudget) {
    return (
      <View className="py-8 items-center">
        <Text className="text-sm text-fg-ink-2">No budget to edit yet.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-4">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 pb-2"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="items-center py-2 gap-3">
          <View className="flex-row items-end gap-4">
            <View
              className="w-[52px] h-[88px] rounded-b-[18px] rounded-t-[10px] border-[2px] border-fg-line/70 bg-fg-cream/80 overflow-hidden relative"
              style={{ borderCurve: 'continuous' }}>
              <Animated.View
                className="absolute bottom-0 left-0 right-0 bg-fg-orange/35"
                style={jarFillStyle}
              />
              <View className="absolute top-2 left-1 right-1 h-[3px] rounded-full bg-fg-line/40" />
            </View>

            <View className="flex-1 gap-1">
              <Text className="text-xs font-bold uppercase tracking-wider text-fg-ink-2">
                Refill the jar
              </Text>
              <View
                className={`flex-row items-center border-b pb-1 ${
                  amountFocused ? 'border-fg-orange' : 'border-fg-line'
                }`}>
                <Text
                  className="text-3xl text-fg-orange font-bold mr-1.5"
                  style={{ fontFamily: 'Fraunces_600SemiBold' }}>
                  {CURRENCY_SYMBOLS[currency] || currency}
                </Text>
                <TextInput
                  className="text-4xl text-fg-ink p-0 font-bold flex-1"
                  style={{
                    fontFamily: 'Fraunces_600SemiBold',
                    minWidth: 80,
                  }}
                  value={formattedAmount}
                  onChangeText={handleAmountChange}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  selection={amountSelection}
                  onSelectionChange={handleAmountSelectionChange}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="rgba(120, 98, 82, 0.35)"
                  accessibilityLabel="Budget amount"
                />
              </View>
            </View>
          </View>

          {parsedAmount > 0 ? (
            <View
              className="px-4 py-2.5 bg-fg-orange-soft/75 border border-fg-orange/15 rounded-full flex-row items-center gap-2"
              style={{ borderCurve: 'continuous' }}>
              <TreatJarIcon size={16} color="#ea580c" />
              <Text className="text-xs font-medium text-fg-ink">
                One scoop a day:{' '}
                <Text className="font-extrabold text-fg-orange">
                  {formatAmount(dailyAllowance, currency)}
                </Text>
              </Text>
            </View>
          ) : (
            <View
              className="px-4 py-2.5 bg-fg-line/10 border border-transparent rounded-full"
              style={{ borderCurve: 'continuous' }}>
              <Text className="text-xs font-semibold text-fg-ink-2/70 italic">
                Fill the jar to see your daily scoop
              </Text>
            </View>
          )}
        </View>

        <View className="gap-1.5">
          <Text className="text-xs font-bold uppercase tracking-wider text-fg-ink-2">
            Jar label (currency)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CURRENCIES.map((curr) => (
              <SelectionChip
                key={curr}
                label={curr}
                selected={currency === curr}
                onPress={() => setCurrency(curr)}
              />
            ))}
          </View>
        </View>

        <View className="gap-1.5">
          <Text className="text-xs font-bold uppercase tracking-wider text-fg-ink-2">
            Refill schedule
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {PERIOD_OPTIONS.map((opt) => (
              <SelectionChip
                key={opt.value}
                label={opt.label}
                selected={periodType === opt.value}
                onPress={() => setPeriodType(opt.value)}
              />
            ))}
          </View>
        </View>

        {periodType === 'custom' && (
          <View className="gap-1.5">
            <Text className="text-xs font-bold uppercase tracking-wider text-fg-ink-2">
              Custom period (days)
            </Text>
            <TextInput
              className="border-b border-fg-line pb-2 text-2xl text-fg-ink"
              style={{ fontFamily: 'Fraunces_600SemiBold' }}
              value={periodDays}
              onChangeText={setPeriodDays}
              keyboardType="number-pad"
              placeholder="30"
              placeholderTextColor="rgba(120, 98, 82, 0.35)"
              accessibilityLabel="Custom period days"
            />
          </View>
        )}

        {error ? (
          <Text className="text-sm font-semibold text-fg-red">{error}</Text>
        ) : null}
      </ScrollView>

      {submitting ? (
        <View className="w-full py-4 rounded-full items-center justify-center bg-fg-line/60">
          <ActivityIndicator color="white" size="small" />
        </View>
      ) : (
        <PrimaryButton
          label="Save Changes"
          disabled={!isValid || submitting}
          onPress={handleSave}
        />
      )}
    </View>
  );
}
