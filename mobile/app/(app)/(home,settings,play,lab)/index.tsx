import React from 'react';
import { FadeInDown } from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ActivityEmpty from '@/components/home/activity-empty';
import {
  formatAmount,
  periodLabel,
  todayAllowance,
  catStatusMessage,
} from '@/components/home/budget-helpers';
import BudgetChips from '@/components/home/budget-chips';
import AppScreen from '@/components/ui/app-screen';
import CatStatus from '@/components/home/cat-status';
import CatMascot from '@/components/mascot/cat-mascot';
import { useDatabase } from '@/providers/database-provider';
import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { PawIcon } from '@/components/home/cat-icons';

export default function HomeScreen() {
  const { latestBudget: budget, status } = useDatabase();
  const loading = status === 'loading';
  const allowance = budget ? todayAllowance(budget) : 0;
  const statusMsg = catStatusMessage(budget, loading);
  const insets = useSafeAreaInsets();

  return (
    <AppScreen contentClassName="gap-6 pb-10" noTopPadding>
      {/* 1. Today's Allowance Hero Card */}
      <Animated.View 
        entering={FadeInDown.duration(600)} 
        className="relative overflow-hidden bg-fg-orange rounded-b-[32px] rounded-t-none p-6 justify-between min-h-[160px] border-[0.5px] border-fg-orange-deep border-t-0"
        style={{
          borderCurve: 'continuous',
          boxShadow: '0 4px 20px rgba(234, 88, 12, 0.12)',
          paddingTop: insets.top + 24,
        }}>
        
        {/* Subtle Decorative Paw Print Watermark in Card Background */}
        <View 
          pointerEvents="none" 
          className="absolute"
          style={{ right: -16, bottom: -16, opacity: 0.12, transform: [{ rotate: '15deg' }] }}>
          <PawIcon size={120} color="#ffffff" />
        </View>

        <View className="gap-1 z-10">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-fg-orange-soft/90">
            Today&apos;s allowance
          </Text>
          <Text
            className="text-5xl font-bold text-fg-cream tracking-tight mt-1"
            style={{ fontFamily: 'Fraunces_600SemiBold' }}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {loading
              ? '—'
              : budget
                ? formatAmount(allowance, budget.currency)
                : '—'}
          </Text>
        </View>

        <View className="z-10 mt-6">
          {budget ? (
            <Text className="text-xs font-semibold text-fg-orange-soft/85">
              from {formatAmount(budget.amount, budget.currency)} {periodLabel(budget)}
            </Text>
          ) : !loading ? (
            <Text className="text-xs font-semibold text-fg-orange-soft/85">
              Set up a budget to see your daily allowance.
            </Text>
          ) : (
            <Text className="text-xs font-semibold text-fg-orange-soft/85">Loading budget…</Text>
          )}
        </View>
      </Animated.View>

      {/* 2. The cat itself — the speech bubble below points up at it */}
      <Animated.View
        entering={FadeInDown.delay(80).duration(600)}
        className="items-center -mb-2">
        <CatMascot size={188} />
      </Animated.View>

      {/* 3. Cat Status Speech Bubble (Arrow pointing up to the cat) */}
      {budget ? (
        <Animated.View entering={FadeInDown.delay(160).duration(500)}>
          <CatStatus message={statusMsg} />
        </Animated.View>
      ) : null}

      {/* 4. Budget Dashboard */}
      {budget ? (
        <Animated.View entering={FadeInDown.delay(180).duration(500)}>
          <BudgetChips budget={budget} />
        </Animated.View>
      ) : null}

      {/* 5. Recent Activity Section */}
      <Animated.View entering={FadeInDown.delay(340).duration(500)}>
        <ActivityEmpty />
      </Animated.View>
    </AppScreen>
  );
}
