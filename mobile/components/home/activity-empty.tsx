import React from 'react';
import { useSharedValue, useAnimatedStyle, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Pressable, Text, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { PawIcon } from './cat-icons';

export default function ActivityEmpty() {
  const shake = useSharedValue(0);

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Micro-interaction shake when tapping the empty state graphic
    shake.value = withSequence(
      withTiming(-15, { duration: 70 }),
      withTiming(12, { duration: 70 }),
      withTiming(-10, { duration: 70 }),
      withTiming(7, { duration: 70 }),
      withSpring(0, { damping: 6 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${shake.value}deg` }],
  }));

  return (
    <Animated.View 
      className="gap-3 rounded-[28px] border-[0.5px] border-fg-line bg-fg-cream p-6 relative overflow-hidden"
      style={{
        borderCurve: 'continuous',
        boxShadow: '0 2px 12px rgba(41, 28, 18, 0.03)',
      }}>
      
      {/* Playful Cat Scratch Accents in the corners */}
      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/8"
        style={{ width: 16, height: 1.5, bottom: 16, right: 20, transform: [{ rotate: '-28deg' }] }}
      />
      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/6"
        style={{ width: 12, height: 1.5, bottom: 20, right: 16, transform: [{ rotate: '-18deg' }] }}
      />
      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/8"
        style={{ width: 14, height: 1.5, bottom: 14, right: 24, transform: [{ rotate: '-38deg' }] }}
      />

      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/8"
        style={{ width: 15, height: 1.5, top: 18, left: 16, transform: [{ rotate: '24deg' }] }}
      />
      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/6"
        style={{ width: 11, height: 1.5, top: 22, left: 12, transform: [{ rotate: '14deg' }] }}
      />

      <Text
        className="text-xs font-bold text-fg-ink-2 uppercase tracking-widest">
        Recent activity
      </Text>
      
      <View className="items-center gap-2 py-4">
        {/* Interactive graphic container */}
        <Pressable 
          onPress={handlePress} 
          className="active:scale-[0.95] items-center justify-center w-16 h-16 rounded-2xl bg-fg-orange-soft/40 border-[0.5px] border-fg-line/40 mb-2"
          style={{ borderCurve: 'continuous' }}>
          <Animated.View style={animatedStyle}>
            <PawIcon size={36} color="#ea580c" />
          </Animated.View>
        </Pressable>

        <Text className="text-center text-base font-bold text-fg-ink">
          No transactions yet
        </Text>
        
        <Text className="text-center text-xs leading-relaxed text-fg-ink-2 max-w-[280px]">
          When expense tracking lands, everything you log will show up here—and
          our cat buddy will react as your stash shrinks.
        </Text>
      </View>
    </Animated.View>
  );
}
