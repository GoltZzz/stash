import { useEffect } from 'react';
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

type BudgetChipsProps = {
  budget: Budget;
};

// Reusable tap-responsive Treat component for the food bowl
function TreatItem({ isEaten }: { isEaten: boolean }) {
  const jumpY = useSharedValue(0);
  const scale = useSharedValue(isEaten ? 0 : 1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isEaten ? 0 : 1, { damping: 15, stiffness: 120 });
  }, [isEaten, scale]);

  const handlePress = () => {
    if (isEaten) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    jumpY.value = withSequence(
      withTiming(-18, { duration: 120 }),
      withSpring(0, { damping: 8, stiffness: 160 })
    );

    rotation.value = withSequence(
      withTiming(15, { duration: 80 }),
      withTiming(-15, { duration: 80 }),
      withSpring(0)
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: jumpY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Pressable onPress={handlePress} className="active:scale-95 px-0.5">
      <Animated.Text style={[{ fontSize: 24 }, animatedStyle]}>
        🐟
      </Animated.Text>
    </Pressable>
  );
}

export default function BudgetChips({ budget }: BudgetChipsProps) {
  const daysLeft = daysLeftInPeriod(budget);
  const length = periodLengthDays(budget);
  const progress = periodProgress(budget);
  const reducedMotion = useReducedMotion();

  // Calculate treats based on days remaining in current budget period
  const ratio = daysLeft / length;
  const totalTreats = 4;
  let activeTreatsCount = 0;
  if (ratio > 0.75) activeTreatsCount = 4;
  else if (ratio > 0.50) activeTreatsCount = 3;
  else if (ratio > 0.25) activeTreatsCount = 2;
  else if (ratio > 0.05) activeTreatsCount = 1;
  else activeTreatsCount = 0;

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
      {/* Treat Bowl Section */}
      <View className="relative overflow-hidden rounded-3xl border border-fg-line bg-fg-cream p-5">
        {/* Background visual detail */}
        <View
          pointerEvents="none"
          className="absolute rounded-full bg-fg-orange-soft/40"
          style={{ width: 140, height: 140, top: -70, right: -40 }}
        />

        <View className="flex-row items-center justify-between">
          <View className="gap-1 flex-1 pr-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-fg-orange-deep">
              Cat Treat Bowl
            </Text>
            <Text className="text-xl font-bold text-fg-ink">
              {activeTreatsCount > 0
                ? `${activeTreatsCount} of ${totalTreats} treats left`
                : 'Bowl is empty!'}
            </Text>
            <Text className="text-xs text-fg-ink-2 leading-relaxed">
              {activeTreatsCount === totalTreats
                ? 'Your stash is overflowing! The cat is fully stuffed.'
                : activeTreatsCount > 1
                  ? 'Pacing is fine, but stash is slowly shrinking!'
                  : activeTreatsCount === 1
                    ? 'Watch out, down to the last fish treat!'
                    : 'Oh no! Set a new budget to fill the bowl.'}
            </Text>
          </View>

          {/* Interactive Treat Bowl UI */}
          <View className="items-center justify-center pt-2">
            {/* Treats Floating Inside */}
            <View className="flex-row justify-center items-end h-8 mb-[-4px] z-10 px-2 gap-1">
              {[0, 1, 2, 3].map((index) => (
                <TreatItem key={index} isEaten={index >= activeTreatsCount} />
              ))}
            </View>

            {/* Ceramic Bowl */}
            <View
              className="rounded-b-[24px] rounded-t-[6px] border border-fg-line bg-fg-orange-soft flex-row items-center justify-center"
              style={{
                width: 120,
                height: 36,
                borderCurve: 'continuous',
                boxShadow: '0 4px 10px rgba(41, 28, 18, 0.05)',
              }}>
              <Text
                className="text-[10px] uppercase font-bold tracking-widest text-fg-ink-2 opacity-50"
                style={{ fontFamily: 'Fraunces_600SemiBold' }}>
                STASH
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats row */}
      <View className="flex-row gap-3">
        <View className="flex-1 gap-1 rounded-2xl border border-fg-line/60 bg-fg-orange-soft px-4 py-3">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-fg-ink-2">
            Period Budget
          </Text>
          <Text className="text-lg font-bold text-fg-ink">
            {formatAmount(budget.amount, budget.currency)}
          </Text>
          <Text className="text-xs text-fg-ink-2 font-medium">{periodLabel(budget)}</Text>
        </View>
        <View className="min-w-[110px] gap-1 rounded-2xl border border-fg-line/60 bg-fg-orange-soft px-4 py-3">
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
      <View className="gap-2.5 rounded-2xl border border-fg-line/60 bg-fg-orange-soft px-4 py-3.5 relative overflow-visible">
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-fg-ink-2">
            Stash Progress (Yarn Path)
          </Text>
          <Text className="text-xs font-bold text-fg-ink-2">{progress}%</Text>
        </View>

        {/* Custom Progress Track */}
        <View className="h-6 justify-center relative overflow-visible mt-1">
          {/* Background Yarn Path (dashed and soft) */}
          <View
            className="absolute left-0 right-0 h-1 rounded-full border-b border-dashed border-fg-line/90"
            style={{ top: 11 }}
          />

          {/* Completed solid orange yarn thread */}
          <Animated.View
            className="absolute left-0 h-1 bg-fg-orange rounded-full"
            style={[{ top: 11 }, yarnProgressStyle]}
          />

          {/* Rolling Yarn Ball */}
          <Animated.View
            className="absolute w-6 h-6 items-center justify-center"
            style={[{ top: 1, zIndex: 10 }, yarnBallStyle]}>
            <Text className="text-xl">🧶</Text>
          </Animated.View>
        </View>

        <Text className="text-[10px] text-fg-ink-2 text-center mt-0.5 font-medium">
          The yarn rolls as time ticks. Keep it rolling safely!
        </Text>
      </View>
    </View>
  );
}
