import React, { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CatDetailedSVG from '@/components/home/cat-detailed-svg';
import { PawIcon } from '@/components/home/cat-icons';
import CatStatus from '@/components/home/cat-status';
import { Text, View, Pressable } from '@/tw';
import { Animated } from '@/tw/animated';
import { LevelConfig } from './quest-data';

interface QuestHeroProps {
  xp: number;
  levelConfig: LevelConfig;
  message: string;
  onTapCat?: () => void;
}

export default function QuestHero({ xp, levelConfig, message, onTapCat }: QuestHeroProps) {
  const insets = useSafeAreaInsets();
  
  // XP Progress Bar animated width
  const xpProgress = useSharedValue(0);
  const catFloatY = useSharedValue(0);

  // Calculate percentage of XP in the current level range
  const levelRange = levelConfig.maxXP - levelConfig.minXP;
  const currentXPInLevel = xp - levelConfig.minXP;
  const percentage = levelConfig.maxXP === Infinity 
    ? 100 
    : Math.min(100, Math.max(0, (currentXPInLevel / levelRange) * 100));

  useEffect(() => {
    xpProgress.value = withSpring(percentage, { damping: 15, stiffness: 100 });
  }, [percentage, xpProgress]);

  // Idle floating animation for the cat
  useEffect(() => {
    catFloatY.value = withRepeat(
      withTiming(-6, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [catFloatY]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${xpProgress.value}%`,
  }));

  const catStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: catFloatY.value }],
  }));

  return (
    <View className="gap-6">
      {/* 1. Cozy Orange Header Card */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        className="relative overflow-hidden bg-fg-orange rounded-b-[32px] rounded-t-none p-6 justify-between min-h-[180px] border-[0.5px] border-fg-orange-deep border-t-0"
        style={{
          borderCurve: 'continuous',
          boxShadow: '0 4px 20px rgba(234, 88, 12, 0.12)',
          paddingTop: insets.top + 20,
        }}
      >
        {/* Decorative Watermark */}
        <View
          pointerEvents="none"
          className="absolute"
          style={{ right: -16, bottom: -16, opacity: 0.12, transform: [{ rotate: '15deg' }] }}
        >
          <PawIcon size={120} color="#ffffff" />
        </View>

        <View className="flex-row items-center justify-between z-10 gap-4">
          {/* Left Side: Animated Cat Avatar */}
          <Pressable onPress={onTapCat} className="active:scale-95 transition-all">
            <Animated.View style={catStyle} className="w-20 h-20 items-center justify-center bg-fg-cream/10 rounded-full border border-white/20 overflow-hidden">
              <View style={{ transform: [{ scale: 0.55 }, { translateY: 10 }] }}>
                <CatDetailedSVG size={120} mood="good" />
              </View>
            </Animated.View>
          </Pressable>

          {/* Right Side: Level & XP Progress Info */}
          <View className="flex-1 gap-2">
            <View>
              <Text className="text-[10px] font-black uppercase tracking-widest text-fg-orange-soft/95">
                Level {levelConfig.level} Companion
              </Text>
              <Text
                className="text-2xl font-bold text-fg-cream mt-0.5"
                style={{ fontFamily: 'Fraunces_600SemiBold' }}
              >
                {levelConfig.title}
              </Text>
            </View>

            {/* XP progress bar */}
            <View className="gap-1 mt-1">
              <View className="flex-row justify-between items-center px-0.5">
                <Text className="text-[9px] font-bold text-fg-orange-soft/80 uppercase tracking-wider">Companion XP</Text>
                <Text className="text-[10px] font-bold text-fg-cream">
                  {levelConfig.maxXP === Infinity ? `${xp} XP` : `${xp} / ${levelConfig.maxXP} XP`}
                </Text>
              </View>
              <View className="h-2.5 w-full bg-fg-orange-deep/50 rounded-full overflow-hidden border border-fg-orange-deep/30">
                <Animated.View
                  className="h-full bg-fg-cream rounded-full"
                  style={[
                    progressBarStyle,
                    {
                      boxShadow: '0 0 6px rgba(255, 251, 245, 0.6)',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* 2. Cat Speech Bubble (Arrow pointing up) */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} className="px-6">
        <CatStatus message={message} />
      </Animated.View>
    </View>
  );
}
