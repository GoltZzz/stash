import { useEffect } from 'react';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { View } from '@/tw';
import { Animated } from '@/tw/animated';
import { Image } from '@/tw/image';

// Single idle frame animated as a stepped 4-"frame" sprite cycle:
// Easing.steps quantizes the timeline so the cat jumps between poses
// (bob + squash) instead of tweening smoothly, mimicking pixel-art sprites.
const FRAME_COUNT = 4;
const CYCLE_MS = 1600;

const FRAMES = [0, 1, 2, 3, 4];
const BOB_Y = [0, -3, -6, -3, 0];
const SQUASH_X = [1, 1.015, 1.03, 1.015, 1];
const SQUASH_Y = [1, 0.985, 0.97, 0.985, 1];

type CatSpriteProps = {
  size?: number;
};

export default function CatSprite({ size = 168 }: CatSpriteProps) {
  const frame = useSharedValue(0);

  useEffect(() => {
    frame.value = withRepeat(
      withTiming(FRAME_COUNT, {
        duration: CYCLE_MS,
        easing: Easing.steps(FRAME_COUNT, false),
      }),
      -1,
      false,
    );
  }, [frame]);

  const spriteStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(frame.value, FRAMES, BOB_Y) },
      { scaleX: interpolate(frame.value, FRAMES, SQUASH_X) },
      { scaleY: interpolate(frame.value, FRAMES, SQUASH_Y) },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(frame.value, [0, 2, 4], [0.16, 0.1, 0.16]),
    transform: [{ scaleX: interpolate(frame.value, [0, 2, 4], [1, 0.88, 1]) }],
  }));

  return (
    <View className="items-center">
      <Animated.View style={spriteStyle}>
        <Image
          source={require('../../assets/images/fg/fg-idle.png')}
          contentFit="contain"
          style={{ width: size, height: size }}
        />
      </Animated.View>
      <Animated.View
        className="rounded-full bg-fg-ink"
        style={[{ width: size * 0.5, height: 10, marginTop: -2 }, shadowStyle]}
      />
    </View>
  );
}
