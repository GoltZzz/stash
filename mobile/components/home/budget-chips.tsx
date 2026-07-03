import type { Budget } from '@/features/budgets/types';

import {
  daysLeftInPeriod,
  formatAmount,
  periodLabel,
  periodProgress,
} from '@/components/home/budget-helpers';
import { Text, View } from '@/tw';

type BudgetChipsProps = {
  budget: Budget;
};

export default function BudgetChips({ budget }: BudgetChipsProps) {
  const daysLeft = daysLeftInPeriod(budget);
  const progress = periodProgress(budget);

  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <View className="flex-1 gap-1 rounded-2xl border border-fg-line/60 bg-fg-orange-soft px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-wider text-fg-ink-2">
            Period budget
          </Text>
          <Text className="text-lg font-bold text-fg-ink">
            {formatAmount(budget.amount, budget.currency)}
          </Text>
          <Text className="text-xs text-fg-ink-2">{periodLabel(budget)}</Text>
        </View>
        <View className="min-w-[100px] gap-1 rounded-2xl border border-fg-line/60 bg-fg-orange-soft px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-wider text-fg-ink-2">
            Days left
          </Text>
          <Text className="text-lg font-bold text-fg-ink">{daysLeft}</Text>
        </View>
      </View>

      <View className="gap-2 rounded-2xl border border-fg-line/60 bg-fg-orange-soft px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold uppercase tracking-wider text-fg-ink-2">
            Period progress
          </Text>
          <Text className="text-xs font-semibold text-fg-ink-2">{progress}%</Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-fg-line/50">
          <View
            className="h-full rounded-full bg-fg-orange"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>
    </View>
  );
}
