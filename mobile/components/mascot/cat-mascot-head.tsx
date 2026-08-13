import type { Ref } from 'react';
import { useImperativeHandle } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { EarLayer, EyesLayer, HeadLayer, HEAD_ANCHORS } from '@/components/mascot/cat-mascot';
import { Animated } from '@/tw/animated';

/**
 * The mascot's head alone, cropped square for use as an icon.
 *
 * Shares its artwork with `CatMascot` — the paths live there and are drawn here
 * through a tighter viewBox, so redrawing the face updates both. Unlike the
 * full mascot this has no idle loop: it sits in the tab bar on every screen,
 * and a permanently moving element in the chrome competes with the content.
 * It moves only when touched.
 */

/**
 * Crop box in the mascot's canvas coordinates. The head spans x 54-146,
 * y 33-129; the padding around that leaves room for the ears to rotate out and
 * the skull to squash wider without clipping against the edge.
 */
const VB_X = 46;
const VB_Y = 26;
const VB_SIZE = 108;

/** Centre of the crop, which is what RN transforms pivot around. */
const CX = VB_X + VB_SIZE / 2;
const CY = VB_Y + VB_SIZE / 2;

export type CatMascotHeadHandle = {
  /** Startle perk: ears snap up and out, skull squashes, eyes go wide. */
  perk: () => void;
  /** Settle bounce: a small over-spring, for when the head returns to screen. */
  settle: () => void;
};

type CatMascotHeadProps = {
  /** Rendered size in px. The crop is square, so this is both width and height. */
  size?: number;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<CatMascotHeadHandle>;
};

export default function CatMascotHead({ size = 44, style, ref }: CatMascotHeadProps) {
  const reducedMotion = useReducedMotion();

  /** Canvas units → px. */
  const S = size / VB_SIZE;

  // Centre-to-pivot offsets in px. Same shift-transform-shift trick the full
  // mascot uses, and likewise precomputed: worklets can't call plain JS.
  const earPivotY = (HEAD_ANCHORS.earPivotY - CY) * S;
  const earLPivotX = (HEAD_ANCHORS.earLPivotX - CX) * S;
  const earRPivotX = (HEAD_ANCHORS.earRPivotX - CX) * S;
  const eyesPivotY = (HEAD_ANCHORS.eyeLineY - CY) * S;
  const chinPivotY = (HEAD_ANCHORS.chinY - CY) * S;

  const perk = useSharedValue(0);
  const settle = useSharedValue(0);

  useImperativeHandle(
    ref,
    () => ({
      perk: () => {
        if (reducedMotion) return;
        // Snap out fast, spring back loose. The press that triggers this also
        // starts fading the head out, so the attack has to carry the read.
        perk.value = withSequence(
          withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) }),
          withSpring(0, { damping: 9, stiffness: 190 })
        );
      },
      settle: () => {
        if (reducedMotion) return;
        // Underdamped so it crosses zero once — the head lands, dips, settles.
        settle.value = withSequence(
          withTiming(1, { duration: 0 }),
          withSpring(0, { damping: 8, stiffness: 170 })
        );
      },
    }),
    [reducedMotion, perk, settle]
  );

  const rootStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.1 * settle.value }],
  }));

  // Squash pivots on the chin, so the skull compresses down into the muzzle
  // rather than shrinking in place.
  const skullStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: chinPivotY },
      { scaleY: 1 - 0.09 * perk.value },
      { scaleX: 1 + 0.07 * perk.value },
      { translateY: -chinPivotY },
    ],
  }));

  // Ears lift and rotate outward — the clearest part of the perk at icon size,
  // since it changes the silhouette rather than shading inside it.
  const earLStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -1.6 * S * perk.value },
      { translateX: earLPivotX },
      { translateY: earPivotY },
      { rotate: `${-10 * perk.value}deg` },
      { translateX: -earLPivotX },
      { translateY: -earPivotY },
    ],
  }));

  const earRStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -1.6 * S * perk.value },
      { translateX: earRPivotX },
      { translateY: earPivotY },
      { rotate: `${10 * perk.value}deg` },
      { translateX: -earRPivotX },
      { translateY: -earPivotY },
    ],
  }));

  // Only the vertical opening widens. Scaling both axes would push the eyes
  // apart, since they sit either side of the pivot.
  const eyesStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: eyesPivotY },
      { scaleY: 1 + 0.16 * perk.value },
      { translateY: -eyesPivotY },
    ],
  }));

  const viewBox = `${VB_X} ${VB_Y} ${VB_SIZE} ${VB_SIZE}`;
  const layer: ViewStyle = { position: 'absolute', left: 0, top: 0, width: size, height: size };

  return (
    <Animated.View
      pointerEvents="none"
      style={[{ width: size, height: size }, rootStyle, style]}>
      <Animated.View style={[layer, earLStyle]}>
        <EarLayer w={size} h={size} viewBox={viewBox} side="left" />
      </Animated.View>
      <Animated.View style={[layer, earRStyle]}>
        <EarLayer w={size} h={size} viewBox={viewBox} side="right" />
      </Animated.View>
      <Animated.View style={[layer, skullStyle]}>
        <HeadLayer w={size} h={size} viewBox={viewBox} whiskers={false} />
      </Animated.View>
      {/* Outside the squash: the skull compressing while the eyes stay full
          size is what sells the startle. */}
      <Animated.View style={[layer, eyesStyle]}>
        <EyesLayer w={size} h={size} viewBox={viewBox} />
      </Animated.View>
    </Animated.View>
  );
}
