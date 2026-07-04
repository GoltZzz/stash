import { useSharedValue, useAnimatedStyle, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Pressable, Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

export default function ActivityEmpty() {
  const shake = useSharedValue(0);

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Micro-interaction shake when tapping the empty state graphic
    shake.value = withSequence(
      withTiming(-12, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(6, { duration: 60 }),
      withSpring(0, { damping: 6 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${shake.value}deg` }],
  }));

  return (
    <Animated.View className="gap-3 rounded-3xl border border-fg-line bg-fg-cream p-6 relative overflow-hidden">
      
      {/* Playful Cat Scratch Accents in the corners, mirroring the tab-bar style */}
      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/10"
        style={{ width: 16, height: 2, bottom: 16, right: 20, transform: [{ rotate: '-28deg' }] }}
      />
      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/8"
        style={{ width: 12, height: 2, bottom: 20, right: 16, transform: [{ rotate: '-18deg' }] }}
      />
      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/10"
        style={{ width: 14, height: 2, bottom: 14, right: 24, transform: [{ rotate: '-38deg' }] }}
      />

      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/10"
        style={{ width: 15, height: 2, top: 18, left: 16, transform: [{ rotate: '24deg' }] }}
      />
      <View
        pointerEvents="none"
        className="absolute rounded-full bg-fg-ink/8"
        style={{ width: 11, height: 2, top: 22, left: 12, transform: [{ rotate: '14deg' }] }}
      />

      <Text
        className="text-lg font-bold text-fg-ink"
        style={{ fontFamily: 'Fraunces_600SemiBold' }}>
        Recent activity
      </Text>
      
      <View className="items-center gap-2.5 py-5">
        {/* Interactive graphic container */}
        <Pressable onPress={handlePress} className="active:scale-95 items-center justify-center p-3 rounded-2xl bg-fg-orange-soft/40 border border-fg-line/30 mb-1">
          <Animated.View style={animatedStyle}>
            <Text className="text-4xl text-center">🐾</Text>
          </Animated.View>
        </Pressable>

        <Text className="text-center text-base font-bold text-fg-ink leading-snug">
          No transactions yet
        </Text>
        
        <Text className="text-center text-sm leading-relaxed text-fg-ink-2 max-w-[280px]">
          When expense tracking lands, everything you log will show up here—and
          our cat buddy will react as your stash shrinks.
        </Text>
      </View>
    </Animated.View>
  );
}
