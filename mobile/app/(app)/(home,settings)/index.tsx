import { FadeInDown } from 'react-native-reanimated';

import ActivityEmpty from '@/components/home/activity-empty';
import {
  formatAmount,
  periodLabel,
  todayAllowance,
} from '@/components/home/budget-helpers';
import BudgetChips from '@/components/home/budget-chips';
import HomeActions from '@/components/home/home-actions';
import AppScreen from '@/components/ui/app-screen';
import { useDatabase } from '@/providers/database-provider';
import { Text } from '@/tw';
import { Animated } from '@/tw/animated';

export default function HomeScreen() {
  const { latestBudget: budget, status } = useDatabase();
  const loading = status === 'loading';
  const allowance = budget ? todayAllowance(budget) : 0;

  return (
    <AppScreen contentClassName="gap-7 pb-10">
      {/* 1. Today's Allowance Hero Header */}
      <Animated.View entering={FadeInDown.duration(500)} className="gap-1 mt-2">
        <Text className="text-xs font-bold uppercase tracking-widest text-fg-orange-deep">
          Today&apos;s allowance
        </Text>
        <Text
          className="text-5xl text-fg-ink"
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
          <Text className="text-sm font-semibold text-fg-ink-2">
            from {formatAmount(budget.amount, budget.currency)} {periodLabel(budget)}
          </Text>
        ) : !loading ? (
          <Text className="text-sm font-semibold text-fg-ink-2">
            Set up a budget to see your daily allowance.
          </Text>
        ) : (
          <Text className="text-sm font-semibold text-fg-ink-2">Loading budget…</Text>
        )}
      </Animated.View>

      {/* 2. Budget Dashboard (Treat Bowl & Yarn Tracker) */}
      {budget ? (
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <BudgetChips budget={budget} />
        </Animated.View>
      ) : null}

      {/* 3. Unified Home Actions */}
      {budget ? (
        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <HomeActions />
        </Animated.View>
      ) : null}

      {/* 4. Recent Activity Section */}
      <Animated.View entering={FadeInDown.delay(240).duration(500)}>
        <ActivityEmpty />
      </Animated.View>
    </AppScreen>
  );
}

