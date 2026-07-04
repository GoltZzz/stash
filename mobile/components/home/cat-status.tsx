import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

type CatStatusProps = {
  message: string;
};

export default function CatStatus({ message }: CatStatusProps) {
  const reducedMotion = useReducedMotion();
  const bubbleScale = useSharedValue(1);

  // Trigger a subtle spring bounce/pop whenever the message changes
  useEffect(() => {
    if (reducedMotion) {
      bubbleScale.value = 1;
      return;
    }

    bubbleScale.value = withSequence(
      withTiming(0.94, { duration: 90 }),
      withSpring(1.02, { damping: 10, stiffness: 180 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
  }, [message, reducedMotion, bubbleScale]);

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
  }));

  return (
    <Animated.View
      className="relative overflow-visible rounded-[24px] border border-fg-line bg-fg-orange-soft px-5 py-4 shadow-sm"
      style={[
        animatedBubbleStyle,
        {
          boxShadow: '0 4px 16px rgba(41, 28, 18, 0.04)',
        },
      ]}>
      
      {/* Speech bubble pointer pointing upwards towards the main cat buddy */}
      <View
        className="absolute -top-[7px] left-1/2 -ml-2.5 w-3.5 h-3.5 bg-fg-orange-soft border-l border-t border-fg-line rotate-45"
        style={{ borderTopLeftRadius: 3 }}
      />

      {/* Bubble text */}
      <Text
        className="text-base text-center leading-relaxed text-fg-ink"
        style={{
          fontFamily: 'Fraunces_400Regular_Italic',
        }}>
        {message}
      </Text>
    </Animated.View>
  );
}
