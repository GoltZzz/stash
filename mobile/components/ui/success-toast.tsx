import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { PawIcon } from '../home/cat-icons';

type SuccessToastProps = {
  message: string;
  onDismiss: () => void;
  duration?: number;
};

export default function SuccessToast({ message, onDismiss, duration = 2500 }: SuccessToastProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const topOffset = Platform.OS === 'ios' ? insets.top + 8 : 16;

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(15).stiffness(120)}
      exiting={FadeOutUp.duration(200)}
      className="absolute left-4 right-4 bg-fg-cream border border-fg-orange/30 rounded-2xl p-4 shadow-xl z-50 flex-row items-center gap-3"
      style={{
        top: topOffset,
        borderCurve: 'continuous',
        boxShadow: '0 4px 16px rgba(234, 88, 12, 0.12)',
        elevation: 8,
      }}
    >
      <View className="w-8 h-8 rounded-full bg-fg-orange/15 items-center justify-center">
        <PawIcon size={16} color="#ea580c" />
      </View>
      <Text
        className="text-sm font-bold text-fg-ink flex-1"
        style={{ fontFamily: 'Fraunces_600SemiBold' }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}
