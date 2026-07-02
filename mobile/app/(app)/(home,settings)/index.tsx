import { useEffect, useState } from 'react';
import { FadeInDown } from 'react-native-reanimated';

import CatSprite from '@/components/home/cat-sprite';
import AppScreen from '@/components/ui/app-screen';
import { getDatabase } from '@/db/client';
import { getLatestBudget } from '@/features/budgets/repository';
import type { Budget } from '@/features/budgets/types';
import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

function periodLabel(budget: Budget): string {
  if (budget.periodType === 'weekly') return 'per week';
  if (budget.periodType === 'monthly') return 'per month';
  return `every ${budget.periodDays ?? 30} days`;
}

function periodLengthDays(budget: Budget): number {
  if (budget.periodType === 'weekly') return 7;
  if (budget.periodType === 'monthly') return 30;
  return budget.periodDays ?? 30;
}

function daysLeftInPeriod(budget: Budget): number {
  const length = periodLengthDays(budget);
  const elapsedMs = Date.now() - new Date(budget.createdAt).getTime();
  const elapsedDays = Math.max(0, Math.floor(elapsedMs / 86_400_000));
  return length - (elapsedDays % length);
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function HomeScreen() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDatabase()
      .then((db) => getLatestBudget(db))
      .then((result) => {
        if (!cancelled) setBudget(result);
      })
      .catch(() => {
        if (!cancelled) setBudget(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const daysLeft = budget ? daysLeftInPeriod(budget) : 0;
  const dailyAllowance = budget
    ? budget.amount / periodLengthDays(budget)
    : 0;

  return (
    <AppScreen>
      {/* Budget Hero */}
      <Animated.View entering={FadeInDown.duration(500)} className="gap-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-bold uppercase tracking-wider text-fg-orange-deep">
              Left to spend
            </Text>
            <Text
              className="mt-1 text-5xl text-fg-ink"
              style={{ fontFamily: 'Fraunces_600SemiBold' }}>
              {loading
                ? '—'
                : budget
                  ? formatAmount(budget.amount, budget.currency)
                  : 'No budget'}
            </Text>
            {budget ? (
              <Text className="mt-1 text-base text-fg-ink-2">
                {formatAmount(budget.amount, budget.currency)} {periodLabel(budget)}
              </Text>
            ) : (
              <Text className="mt-1 text-base text-fg-ink-2">
                Set up a budget to start tracking.
              </Text>
            )}
          </View>
          <View className="justify-center items-center">
            <CatSprite size={90} />
          </View>
        </View>

        {/* Stats tiles */}
        {budget ? (
          <View className="flex-row gap-4">
            <View className="flex-1 gap-1 rounded-3xl bg-fg-orange-soft border border-fg-line/60 p-5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-fg-ink-2">
                Days left
              </Text>
              <Text className="text-3xl font-extrabold text-fg-ink">{daysLeft}</Text>
            </View>
            <View className="flex-1 gap-1 rounded-3xl bg-fg-orange-soft border border-fg-line/60 p-5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-fg-ink-2">
                Per day
              </Text>
              <Text className="text-3xl font-extrabold text-fg-ink">
                {formatAmount(Math.floor(dailyAllowance), budget.currency)}
              </Text>
            </View>
          </View>
        ) : null}
      </Animated.View>

      {/* Activity placeholder */}
      <Animated.View
        entering={FadeInDown.delay(120).duration(500)}
        className="gap-3 rounded-3xl border border-fg-line bg-fg-cream p-6 mt-2">
        <Text
          className="text-lg font-bold text-fg-ink"
          style={{ fontFamily: 'Fraunces_600SemiBold' }}>
          Activity
        </Text>
        <Text className="text-base leading-relaxed text-fg-ink-2">
          Expense tracking is coming soon. Everything you spend will show up
          here, and the cat will get grumpier as the stash shrinks.
        </Text>
      </Animated.View>
    </AppScreen>
  );
}
