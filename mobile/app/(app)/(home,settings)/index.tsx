import { useEffect, useState } from 'react';
import { FadeInDown } from 'react-native-reanimated';

import ActivityEmpty from '@/components/home/activity-empty';
import {
  catStatusMessage,
  daysLeftInPeriod,
  formatAmount,
  periodLabel,
  periodLengthDays,
  todayAllowance,
} from '@/components/home/budget-helpers';
import BudgetChips from '@/components/home/budget-chips';
import CatSprite, { type CatMood } from '@/components/home/cat-sprite';
import CatStatus from '@/components/home/cat-status';
import HomeActions from '@/components/home/home-actions';
import AppScreen from '@/components/ui/app-screen';
import { getDatabase } from '@/db/client';
import { getLatestBudget } from '@/features/budgets/repository';
import type { Budget } from '@/features/budgets/types';
import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

const FUNNY_CAT_QUOTES = [
  "Don't spend it all on catnip! I'm watching you.",
  "If I fits, I sits... on your savings pile!",
  "Can we buy some more fish treats? Just put it on the card.",
  "Purr-fect financial pacing today. I give you 10/10 claws!",
  "A penny saved is a penny I can bat under the refrigerator.",
  "Remember, premium cat beds are an investment, not an expense.",
  "Stash safe, life good. Pet me again!",
];

export default function HomeScreen() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [customSpeech, setCustomSpeech] = useState<string | null>(null);

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

  const standardStatusMessage = catStatusMessage(budget, loading);
  const allowance = budget ? todayAllowance(budget) : 0;

  // Determine cat mood based on remaining time in the budget period
  const getCatMood = (): CatMood => {
    if (loading) return 'good';
    if (!budget) return 'walking';

    const daysLeft = daysLeftInPeriod(budget);
    const length = periodLengthDays(budget);
    const ratio = daysLeft / length;

    if (daysLeft === 0) return 'empty';
    if (ratio <= 0.05) return 'critical';
    if (ratio <= 0.25) return 'warning';
    if (ratio <= 0.50) return 'walking';
    return 'good';
  };

  const handleCatTap = () => {
    // Select a random sassy cat financial quote
    const randomQuote = FUNNY_CAT_QUOTES[Math.floor(Math.random() * FUNNY_CAT_QUOTES.length)];
    setCustomSpeech(randomQuote);
  };

  // Restore original speech bubble message after 3 seconds
  useEffect(() => {
    if (customSpeech) {
      const timer = setTimeout(() => {
        setCustomSpeech(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [customSpeech]);

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

      {/* 2. Interactive Cat Stage (Hero Mascot and Speech Bubble) */}
      <Animated.View
        entering={FadeInDown.delay(80).duration(500)}
        className="items-stretch gap-5 p-5 rounded-3xl border border-fg-line bg-fg-cream relative overflow-hidden"
        style={{
          boxShadow: '0 6px 20px rgba(41, 28, 18, 0.03)',
        }}>
        {/* Playful background card detailing (floor outline style) */}
        <View
          pointerEvents="none"
          className="absolute bottom-0 left-0 right-0 h-4 border-t border-fg-line/30 bg-fg-orange-soft/10"
        />

        {/* The Large Interactive Cat Sprite */}
        <View className="items-center justify-center py-2 relative">
          <CatSprite
            size={144}
            mood={getCatMood()}
            onTap={handleCatTap}
          />
        </View>

        {/* Dynamic Speech Bubble pointing up to the Mascot */}
        <CatStatus message={customSpeech || standardStatusMessage} />
      </Animated.View>

      {/* 3. Budget Dashboard (Treat Bowl & Yarn Tracker) */}
      {budget ? (
        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <BudgetChips budget={budget} />
        </Animated.View>
      ) : null}

      {/* 4. Unified Home Actions */}
      {budget ? (
        <Animated.View entering={FadeInDown.delay(220).duration(500)}>
          <HomeActions />
        </Animated.View>
      ) : null}

      {/* 5. Recent Activity Section */}
      <Animated.View entering={FadeInDown.delay(280).duration(500)}>
        <ActivityEmpty />
      </Animated.View>
    </AppScreen>
  );
}
