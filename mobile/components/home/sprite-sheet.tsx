import { useEffect } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { View } from '@/tw';
import { Animated } from '@/tw/animated';
import { Image } from '@/tw/image';

export type SpriteSheetProps = {
  /** Image source for the sprite sheet asset */
  source: ImageSourcePropType;
  /** Number of columns in the sheet */
  columns: number;
  /** Number of rows in the sheet */
  rows?: number;
  /** Total frames to animate (defaults to columns * rows) */
  totalFrames?: number;
  /** Frames per second for the loop */
  fps?: number;
  /** Display width of one frame */
  width: number;
  /** Display height of one frame */
  height: number;
  /** First frame index (inclusive) */
  startFrame?: number;
  /** Last frame index (inclusive) */
  endFrame?: number;
  /** Whether the animation should loop */
  loop?: boolean;
  className?: string;
  /** Callback when a non-looping animation completes */
  onFinish?: () => void;
  /** Key to trigger restart of non-looping animation */
  playKey?: string | number;
};

export default function SpriteSheet({
  source,
  columns,
  rows = 1,
  totalFrames,
  fps = 6,
  width,
  height,
  startFrame = 0,
  endFrame,
  loop = true,
  className,
  onFinish,
  playKey,
}: SpriteSheetProps) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  const frameCount = totalFrames ?? columns * rows;
  const lastFrame = endFrame ?? frameCount - 1;
  const activeFrames = lastFrame - startFrame + 1;
  const loopDuration = (activeFrames / fps) * 1000;

  useEffect(() => {
    if (reducedMotion || activeFrames <= 1) {
      progress.value = 0;
      return;
    }

    progress.value = 0;

    if (loop) {
      progress.value = withRepeat(
        withTiming(1, {
          duration: loopDuration,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    } else {
      progress.value = withTiming(
        1,
        {
          duration: loopDuration,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished && onFinish) {
            runOnJS(onFinish)();
          }
        }
      );
    }
  }, [activeFrames, loop, loopDuration, progress, reducedMotion, playKey, onFinish]);

  const animatedStyle = useAnimatedStyle(() => {
    const frameOffset = Math.min(
      Math.floor(progress.value * activeFrames),
      activeFrames - 1,
    );
    const frameIndex = startFrame + frameOffset;
    const col = frameIndex % columns;
    const row = Math.floor(frameIndex / columns);

    return {
      transform: [
        { translateX: -col * width },
        { translateY: -row * height },
      ],
    };
  });

  return (
    <View
      className={className}
      style={{ width, height, overflow: 'hidden' }}>
      <Animated.View style={animatedStyle}>
        <Image
          source={source}
          contentFit="cover"
          style={{
            width: columns * width,
            height: rows * height,
          }}
        />
      </Animated.View>
    </View>
  );
}

/** Idle animation config for the fg mascot sprite sheet */
export const FG_IDLE_SPRITE = {
  source: require('../../assets/images/fg/fg-idle-spritesheet.png'),
  frameWidth: 256,
  frameHeight: 1024,
  columns: 6,
  rows: 1,
  totalFrames: 6,
  fps: 4,
} as const;

export const FG_IDLE_LOOP = {
  source: require('../../assets/images/fg/fg-idle-loop.png'),
  frameWidth: 1536,
  frameHeight: 1024,
  columns: 6,
  rows: 1,
  totalFrames: 6,
  fps: 6,
} as const;

export const FG_IDLE_SPECIAL = {
  source: require('../../assets/images/fg/fg-idle-special.png'),
  frameWidth: 1536,
  frameHeight: 1024,
  columns: 8,
  rows: 1,
  totalFrames: 8,
  fps: 8,
} as const;
