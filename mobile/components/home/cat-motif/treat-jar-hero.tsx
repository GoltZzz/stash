import React, { useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { View } from '@/tw';
import { Animated } from '@/tw/animated';

type TreatJarHeroProps = {
  fillLevel?: number;
};

export default function TreatJarHero({ fillLevel = 0.35 }: TreatJarHeroProps) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(fillLevel);

  useEffect(() => {
    progress.value = reducedMotion
      ? fillLevel
      : withSpring(fillLevel, { damping: 18, stiffness: 90 });
  }, [fillLevel, reducedMotion, progress]);

  const jarBodyHeight = 100;
  const maxFillHeight = jarBodyHeight * 0.58;

  const fillStyle = useAnimatedStyle(() => ({
    height: progress.value * maxFillHeight,
  }));

  return (
    <View className="items-center py-2 relative">
      <View
        className="w-[72px] h-[100px] rounded-b-[22px] rounded-t-[12px] border-[2.5px] border-fg-line/80 bg-fg-cream overflow-hidden relative"
        style={{ borderCurve: 'continuous' }}>
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-fg-orange/30"
          style={fillStyle}
        />
        <View className="absolute top-0 left-2 right-2 h-[5px] rounded-b-md bg-fg-line/35" />
        <View className="absolute top-3 left-3 right-3 flex-row flex-wrap gap-1 justify-center">
          <View className="w-2 h-2 rounded-full bg-fg-orange/50" />
          <View className="w-1.5 h-1.5 rounded-full bg-fg-orange/40 mt-0.5" />
          <View className="w-2 h-2 rounded-full bg-fg-orange/45" />
        </View>
      </View>

      <View
        className="absolute bottom-0 w-[100px] h-[3px] rounded-full bg-fg-line/50"
        style={{ borderCurve: 'continuous' }}
      />

      <View
        pointerEvents="none"
        className="absolute w-16 h-[2px] bg-fg-ink/10 rounded-full"
        style={{ bottom: 6, transform: [{ rotate: '-2deg' }] }}
      />
    </View>
  );
}
