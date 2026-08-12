import React, { useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import type { Budget } from '@/features/budgets/types';
import {
  daysLeftInPeriod,
  formatAmount,
  periodLabel,
  periodLengthDays,
  periodProgress,
} from '@/components/home/budget-helpers';
import { Pressable, Text, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { YarnIcon } from './cat-icons';

type BudgetChipsProps = {
  budget: Budget;
};

export default function BudgetChips({ budget }: BudgetChipsProps) {
  const daysLeft = daysLeftInPeriod(budget);
  const length = periodLengthDays(budget);
  const progress = periodProgress(budget);
  const reducedMotion = useReducedMotion();

  // Shared values for the rolling yarn ball animation
  const animProgress = useSharedValue(0);


  useEffect(() => {
    animProgress.value = withSpring(progress, {
      damping: 18,
      stiffness: 80,
    });
  }, [progress, animProgress]);

  const yarnProgressStyle = useAnimatedStyle(() => ({
    width: `${animProgress.value}%`,
  }));

  const yarnBallStyle = useAnimatedStyle(() => {
    // Rotation proportional to horizontal scroll percentage
    const rotateDegrees = animProgress.value * 5.4;
    return {
      left: `${animProgress.value}%`,
      transform: [
        { translateX: -12 },
        { rotate: `${rotateDegrees}deg` },
      ],
    };
  });

  return (
    <View className="gap-4">


      {/* Stats row */}
      <View className="flex-row gap-3">
        <View 
          className="flex-1 gap-1 rounded-[24px] border-[0.5px] border-fg-line bg-fg-orange-soft/40 px-4 py-3"
          style={{ borderCurve: 'continuous' }}>
          <Text className="text-[10px] font-bold uppercase tracking-wider text-fg-ink-2">
            Period Budget
          </Text>
          <Text className="text-lg font-bold text-fg-ink">
            {formatAmount(budget.amount, budget.currency)}
          </Text>
          <Text className="text-xs text-fg-ink-2 font-medium">{periodLabel(budget)}</Text>
        </View>
        <View 
          className="min-w-[110px] gap-1 rounded-[24px] border-[0.5px] border-fg-line bg-fg-orange-soft/40 px-4 py-3"
          style={{ borderCurve: 'continuous' }}>
          <Text className="text-[10px] font-bold uppercase tracking-wider text-fg-ink-2">
            Days Left
          </Text>
          <Text className="text-lg font-bold text-fg-ink">
            {daysLeft} <Text className="text-xs font-normal text-fg-ink-2">/ {length}</Text>
          </Text>
          <Text className="text-xs text-fg-ink-2 font-medium">remaining</Text>
        </View>
      </View>

      {/* Yarn Ball Progress Tracker */}
      <View 
        className="gap-2.5 rounded-[24px] border-[0.5px] border-fg-line bg-fg-orange-soft/30 px-4 py-3.5 relative overflow-visible"
        style={{ borderCurve: 'continuous' }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-fg-ink-2">
            Stash Progress (Yarn Path)
          </Text>
          <Text className="text-xs font-bold text-fg-ink">{progress}%</Text>
        </View>

        {/* Custom Progress Track */}
        <View className="h-6 justify-center relative overflow-visible mt-0.5">
          {/* Background Yarn Path (dashed and soft) */}
          <View
            className="absolute left-0 right-0 h-[1.5px] rounded-full border-b border-dashed border-fg-line/90"
            style={{ top: 11 }}
          />

          {/* Completed solid orange yarn thread */}
          <Animated.View
            className="absolute left-0 h-[1.5px] bg-fg-orange rounded-full"
            style={[{ top: 11 }, yarnProgressStyle]}
          />

          {/* Rolling Yarn Ball */}
          <Animated.View
            className="absolute w-6 h-6 items-center justify-center"
            style={[{ top: 0, zIndex: 10 }, yarnBallStyle]}>
            <YarnIcon size={20} color="#ea580c" />
          </Animated.View>
        </View>

        <Text className="text-[9px] text-fg-ink-2 text-center mt-0.5 font-semibold uppercase tracking-wider opacity-60">
          The yarn rolls as time ticks. Keep it rolling safely!
        </Text>
      </View>
    </View>
  );
}
