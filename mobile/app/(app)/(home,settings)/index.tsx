import { useEffect, useState } from 'react';
import { FadeInDown } from 'react-native-reanimated';

import ActivityEmpty from '@/components/home/activity-empty';
import {
  catStatusMessage,
  formatAmount,
  periodLabel,
  todayAllowance,
} from '@/components/home/budget-helpers';
import BudgetChips from '@/components/home/budget-chips';
import CatStatus from '@/components/home/cat-status';
import HomeActions from '@/components/home/home-actions';
import AppScreen from '@/components/ui/app-screen';
import { getDatabase } from '@/db/client';
import { getLatestBudget } from '@/features/budgets/repository';
import type { Budget } from '@/features/budgets/types';
import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

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

  const statusMessage = catStatusMessage(budget, loading);
  const allowance = budget ? todayAllowance(budget) : 0;

  return (
    <AppScreen>
      {/* Today's allowance hero */}
      <Animated.View entering={FadeInDown.duration(500)} className="gap-5">
        <View>
          <Text className="text-sm font-bold uppercase tracking-wider text-fg-orange-deep">
            Today&apos;s allowance
          </Text>
          <Text
            className="mt-1 text-5xl text-fg-ink"
            style={{ fontFamily: 'Fraunces_600SemiBold' }}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {loading
              ? '—'
              : budget
                ? formatAmount(allowance, budget.currency)
                : '—'}
          </Text>
          {budget ? (
            <Text className="mt-1 text-base text-fg-ink-2">
              from {formatAmount(budget.amount, budget.currency)}{' '}
              {periodLabel(budget)}
            </Text>
          ) : !loading ? (
            <Text className="mt-1 text-base text-fg-ink-2">
              Set up a budget to see your daily allowance.
            </Text>
          ) : (
            <Text className="mt-1 text-base text-fg-ink-2">Loading budget…</Text>
          )}
        </View>

        <CatStatus message={statusMessage} />

        {budget ? <BudgetChips budget={budget} /> : null}

        {budget ? <HomeActions /> : null}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(500)}>
        <ActivityEmpty />
      </Animated.View>
    </AppScreen>
  );
}
