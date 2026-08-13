import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import {
  Easing,
  useAnimatedStyle,
  useFrameCallback,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { View } from '@/tw';
import { Animated } from '@/tw/animated';

/**
 * The Stash mascot, drawn in SVG and animated with an idle loop.
 *
 * Each body part is its own full-canvas SVG layer, so the layers stay perfectly
 * registered with no per-part offset arithmetic. All motion is native View
 * transforms on those layers — never animated SVG props — which keeps the loop
 * on the UI thread at display framerate.
 *
 * Runs in Expo Go: react-native-svg + reanimated only, no native modules.
 */

const CANVAS_W = 220;
const CANVAS_H = 200;
const TWO_PI = Math.PI * 2;

/**
 * Oscillator periods, in seconds. Deliberately not small integer ratios of one
 * another — if breath, sway and tail share a beat the cat looks mechanical.
 * With these, the combined pose does not visibly repeat.
 */
const BREATH_S = 3.4;
const SWAY_S = 5.3;
const TAIL_S = 2.6;
const TAIL_WOBBLE_S = 1.3;

// fg tokens
const FUR = 'rgb(234, 88, 12)'; // fg-orange
const FUR_DEEP = 'rgb(194, 65, 12)'; // fg-orange-deep
const RUFF = 'rgb(255, 237, 213)'; // fg-orange-soft
const INK = 'rgb(41, 28, 18)'; // fg-ink
const INK_2 = 'rgb(120, 98, 82)'; // fg-ink-2
const CREAM = 'rgb(255, 251, 245)'; // fg-cream

// Illustration-only tints of fg-orange. Fur needs volume that the flat UI
// palette can't give it; these are never used for chrome or text.
const FUR_LIGHT = 'rgb(246, 148, 88)';
const EAR_INNER = 'rgb(255, 214, 196)';
const BLUSH = 'rgba(224, 90, 60, 0.16)';

type LayerProps = { w: number; h: number };

function Stage({ w, h, children }: LayerProps & { children: React.ReactNode }) {
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
      {children}
    </Svg>
  );
}

function ShadowLayer({ w, h }: LayerProps) {
  return (
    <Stage w={w} h={h}>
      <Ellipse cx={100} cy={186} rx={58} ry={8} fill={INK} opacity={0.1} />
    </Stage>
  );
}

const TAIL_PATH =
  'M 140,164 C 166,170 186,156 186,132 C 186,110 170,98 158,104 C 148,109 148,124 158,126';

// Stops short of the curl's tip — running the highlight all the way in reads as
// a spiral shell rather than fur.
const TAIL_CORE_PATH = 'M 141,163 C 165,168 184,155 184,133 C 184,116 173,104 163,107';

function TailLayer({ w, h }: LayerProps) {
  return (
    <Stage w={w} h={h}>
      {/* Fluffy outer mass, then a lighter core so the curl reads as fur volume */}
      <Path
        d={TAIL_PATH}
        stroke={FUR}
        strokeWidth={23}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d={TAIL_CORE_PATH}
        stroke={FUR_LIGHT}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.55}
      />
    </Stage>
  );
}

function BodyLayer({ w, h }: LayerProps) {
  return (
    <Stage w={w} h={h}>
      <Defs>
        <LinearGradient id="catBodyFur" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={FUR} />
          <Stop offset="1" stopColor={FUR_DEEP} />
        </LinearGradient>
      </Defs>
      <Path
        d="M 60,118 C 46,138 40,162 50,175 C 58,185 78,187 100,187 C 122,187 142,185 150,175 C 160,162 154,138 140,118 C 128,100 72,100 60,118 Z"
        fill="url(#catBodyFur)"
      />
      {/* Chest and belly ruff */}
      <Path
        d="M 76,138 C 66,154 68,174 84,181 C 94,185 110,184 118,179 C 128,172 128,152 120,138 C 108,128 88,128 76,138 Z"
        fill={RUFF}
        opacity={0.95}
      />
      {/* Flank fur tufts */}
      <Path
        d="M 48,150 C 44,158 44,166 48,172"
        stroke={FUR_LIGHT}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />
      <Path
        d="M 152,150 C 156,158 156,166 152,172"
        stroke={FUR_DEEP}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.4}
      />
    </Stage>
  );
}

function PawsLayer({ w, h }: LayerProps) {
  return (
    <Stage w={w} h={h}>
      <Path
        d="M 70,180 C 70,173 78,170 84,170 C 90,170 96,173 96,180 C 96,184 90,186 83,186 C 76,186 70,184 70,180 Z"
        fill={RUFF}
      />
      <Path
        d="M 104,180 C 104,173 112,170 118,170 C 124,170 130,173 130,180 C 130,184 124,186 117,186 C 110,186 104,184 104,180 Z"
        fill={RUFF}
      />
      {[79, 87, 113, 121].map((x) => (
        <Path
          key={x}
          d={`M ${x},174 L ${x},183`}
          stroke={FUR_DEEP}
          strokeWidth={1.3}
          strokeLinecap="round"
          opacity={0.3}
        />
      ))}
    </Stage>
  );
}

function HeadLayer({ w, h }: LayerProps) {
  return (
    <Stage w={w} h={h}>
      <Defs>
        <LinearGradient id="catHeadFur" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={FUR_LIGHT} />
          <Stop offset="0.55" stopColor={FUR} />
          <Stop offset="1" stopColor={FUR} />
        </LinearGradient>
      </Defs>
      {/* Wide, flat-faced Persian skull */}
      <Path
        d="M 100,44 C 76,44 60,53 54,70 C 48,86 51,103 60,113 C 69,123 84,129 100,129 C 116,129 131,123 140,113 C 149,103 152,86 146,70 C 140,53 124,44 100,44 Z"
        fill="url(#catHeadFur)"
      />
      {/* Rim light along the top-left of the skull */}
      <Path
        d="M 62,66 C 68,54 82,48 98,48"
        stroke={CREAM}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.28}
      />
      {/* Cheek blush */}
      <Ellipse cx={68} cy={101} rx={9} ry={5.5} fill={BLUSH} />
      <Ellipse cx={132} cy={101} rx={9} ry={5.5} fill={BLUSH} />
      {/* Cream muzzle ruff */}
      <Path
        d="M 100,96 C 85,96 74,103 72,113 C 70,122 79,128 100,128 C 121,128 130,122 128,113 C 126,103 115,96 100,96 Z"
        fill={RUFF}
        opacity={0.92}
      />
      {/* Brow tufts, kept inside the silhouette — anything crossing the skull
          outline reads as an antenna, not fur. */}
      <Path
        d="M 88,56 C 92,50 98,48 103,51"
        stroke={FUR_LIGHT}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.65}
      />
      <Path
        d="M 110,53 C 115,51 120,53 123,58"
        stroke={FUR_LIGHT}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />
      {/* Nose */}
      <Path
        d="M 100,108 C 96,108 93,105 94,102 C 95,100 105,100 106,102 C 107,105 104,108 100,108 Z"
        fill={FUR_DEEP}
      />
      {/* Mouth */}
      <Path
        d="M 100,108 C 100,113 95,116 91,113"
        stroke={INK_2}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M 100,108 C 100,113 105,116 109,113"
        stroke={INK_2}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
      {/* Whiskers */}
      {[
        'M 76,108 L 52,101',
        'M 75,112 L 50,111',
        'M 76,116 L 53,121',
        'M 124,108 L 148,101',
        'M 125,112 L 150,111',
        'M 124,116 L 147,121',
      ].map((d) => (
        <Path
          key={d}
          d={d}
          stroke={INK_2}
          strokeWidth={1.3}
          strokeLinecap="round"
          opacity={0.45}
        />
      ))}
    </Stage>
  );
}

function EarLayer({ w, h, side }: LayerProps & { side: 'left' | 'right' }) {
  const outer =
    side === 'left'
      ? 'M 62,64 C 56,50 58,36 66,33 C 76,36 86,46 90,56 C 80,58 68,60 62,64 Z'
      : 'M 138,64 C 144,50 142,36 134,33 C 124,36 114,46 110,56 C 120,58 132,60 138,64 Z';
  const inner =
    side === 'left'
      ? 'M 68,56 C 65,47 66,40 70,38 C 76,42 81,49 83,55 C 77,55 71,55 68,56 Z'
      : 'M 132,56 C 135,47 134,40 130,38 C 124,42 119,49 117,55 C 123,55 129,55 132,56 Z';

  return (
    <Stage w={w} h={h}>
      <Path d={outer} fill={FUR} />
      <Path d={inner} fill={EAR_INNER} />
    </Stage>
  );
}

function EyesLayer({ w, h }: LayerProps) {
  return (
    <Stage w={w} h={h}>
      {[83, 117].map((cx) => (
        <Ellipse key={cx} cx={cx} cy={88} rx={8} ry={8.5} fill={INK} />
      ))}
      {/* Catchlights — the difference between "eyes" and "two dark holes" */}
      <Circle cx={80.5} cy={85} r={2.6} fill={CREAM} opacity={0.9} />
      <Circle cx={114.5} cy={85} r={2.6} fill={CREAM} opacity={0.9} />
      <Circle cx={86} cy={91.5} r={1.3} fill={CREAM} opacity={0.4} />
      <Circle cx={120} cy={91.5} r={1.3} fill={CREAM} opacity={0.4} />
    </Stage>
  );
}

type CatMascotProps = {
  /** Rendered width in px. Height follows the canvas aspect ratio. */
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function CatMascot({ size = 180, style }: CatMascotProps) {
  const reducedMotion = useReducedMotion();

  const w = size;
  const h = (size * CANVAS_H) / CANVAS_W;
  /** Canvas units → px. */
  const S = w / CANVAS_W;

  /**
   * RN transforms pivot on a view's centre, so to pivot somewhere else we shift
   * by the centre-to-pivot offset, transform, then shift back. These are those
   * offsets in px, for each part's pivot point in canvas coordinates.
   *
   * They are computed here rather than by a helper called inside the animated
   * styles: worklets cannot call plain JS functions, so anything a worklet uses
   * has to already be a number by the time it closes over it.
   */
  const bodyPivotY = (187 - CANVAS_H / 2) * S; // planted haunches
  const headPivotX = (100 - CANVAS_W / 2) * S; // neck
  const headPivotY = (124 - CANVAS_H / 2) * S;
  const tailPivotX = (140 - CANVAS_W / 2) * S; // tail base
  const tailPivotY = (164 - CANVAS_H / 2) * S;
  const eyesPivotY = (88 - CANVAS_H / 2) * S; // eye line
  const earPivotY = (60 - CANVAS_H / 2) * S; // ear bases
  const earLPivotX = (78 - CANVAS_W / 2) * S;
  const earRPivotX = (122 - CANVAS_W / 2) * S;

  /** Seconds since mount, driven on the UI thread. */
  const clock = useSharedValue(0);
  const eyeOpen = useSharedValue(1);
  const earLFlick = useSharedValue(0);
  const earRFlick = useSharedValue(0);

  const frame = useFrameCallback((info) => {
    clock.value = info.timeSinceFirstFrame / 1000;
  }, false);

  useEffect(() => {
    frame.setActive(!reducedMotion);
  }, [frame, reducedMotion]);

  // Blinks land on a randomised interval, and sometimes come in pairs. A blink
  // on a fixed timer is one of the strongest "this is a loop" tells.
  useEffect(() => {
    if (reducedMotion) {
      eyeOpen.value = 1;
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    const blink = () => {
      eyeOpen.value = withSequence(
        withTiming(0.08, { duration: 70, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) })
      );
    };

    const schedule = () => {
      timers.push(
        setTimeout(
          () => {
            blink();
            if (Math.random() < 0.22) timers.push(setTimeout(blink, 260));
            schedule();
          },
          2400 + Math.random() * 4100
        )
      );
    };

    schedule();
    return () => timers.forEach(clearTimeout);
  }, [eyeOpen, reducedMotion]);

  // A rare, sharp ear twitch on one side. Cheap to add, and it does most of the
  // work of making the cat feel present rather than looping.
  useEffect(() => {
    if (reducedMotion) {
      earLFlick.value = 0;
      earRFlick.value = 0;
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = () => {
      timers.push(
        setTimeout(
          () => {
            const ear = Math.random() < 0.5 ? earLFlick : earRFlick;
            ear.value = withSequence(
              withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) }),
              withSpring(0, { damping: 7, stiffness: 220 })
            );
            schedule();
          },
          7000 + Math.random() * 9000
        )
      );
    };

    schedule();
    return () => timers.forEach(clearTimeout);
  }, [earLFlick, earRFlick, reducedMotion]);

  const shadowStyle = useAnimatedStyle(() => {
    const breath = Math.sin((clock.value / BREATH_S) * TWO_PI);
    return { transform: [{ scaleX: 1 + 0.01 * breath }] };
  });

  // Ribcage expansion, pivoting on the planted haunches so the cat doesn't
  // float. Expands on both axes — counter-scaling would read as a bounce.
  const bodyStyle = useAnimatedStyle(() => {
    const breath = Math.sin((clock.value / BREATH_S) * TWO_PI);
    return {
      transform: [
        { translateY: bodyPivotY },
        { scaleY: 1 + 0.02 * breath },
        { scaleX: 1 + 0.012 * breath },
        { translateY: -bodyPivotY },
      ],
    };
  });

  // Head rides the breath and drifts on a slower, unrelated cycle.
  const headStyle = useAnimatedStyle(() => {
    const breath = Math.sin((clock.value / BREATH_S) * TWO_PI);
    const sway = Math.sin((clock.value / SWAY_S) * TWO_PI + 0.9);
    return {
      transform: [
        { translateY: -1.8 * S * breath },
        { translateX: 1.2 * S * sway },
        { translateX: headPivotX },
        { translateY: headPivotY },
        { rotate: `${1.6 * sway}deg` },
        { translateX: -headPivotX },
        { translateY: -headPivotY },
      ],
    };
  });

  const tailStyle = useAnimatedStyle(() => {
    const base = Math.sin((clock.value / TAIL_S) * TWO_PI);
    const wobble = Math.sin((clock.value / TAIL_WOBBLE_S) * TWO_PI + 1.2);
    return {
      transform: [
        { translateX: tailPivotX },
        { translateY: tailPivotY },
        { rotate: `${4.5 * (base + 0.3 * wobble)}deg` },
        { translateX: -tailPivotX },
        { translateY: -tailPivotY },
      ],
    };
  });

  const eyesStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: eyesPivotY },
      { scaleY: eyeOpen.value },
      { translateY: -eyesPivotY },
    ],
  }));

  // Ears carry a trace of the breath so they never sit dead still, plus the
  // flick when one fires. Rotation is outward on each side.
  const earLStyle = useAnimatedStyle(() => {
    const breath = Math.sin((clock.value / BREATH_S) * TWO_PI);
    return {
      transform: [
        { translateX: earLPivotX },
        { translateY: earPivotY },
        { rotate: `${-(9 * earLFlick.value + 0.6 * breath)}deg` },
        { translateX: -earLPivotX },
        { translateY: -earPivotY },
      ],
    };
  });

  const earRStyle = useAnimatedStyle(() => {
    const breath = Math.sin((clock.value / BREATH_S) * TWO_PI);
    return {
      transform: [
        { translateX: earRPivotX },
        { translateY: earPivotY },
        { rotate: `${9 * earRFlick.value + 0.6 * breath}deg` },
        { translateX: -earRPivotX },
        { translateY: -earPivotY },
      ],
    };
  });

  const layer: ViewStyle = { position: 'absolute', left: 0, top: 0, width: w, height: h };

  return (
    <View pointerEvents="none" style={[{ width: w, height: h }, style]}>
      <Animated.View style={[layer, shadowStyle]}>
        <ShadowLayer w={w} h={h} />
      </Animated.View>

      <Animated.View style={[layer, tailStyle]}>
        <TailLayer w={w} h={h} />
      </Animated.View>

      <Animated.View style={[layer, bodyStyle]}>
        <BodyLayer w={w} h={h} />
      </Animated.View>

      <View style={layer}>
        <PawsLayer w={w} h={h} />
      </View>

      <Animated.View style={[layer, headStyle]}>
        <Animated.View style={[layer, earLStyle]}>
          <EarLayer w={w} h={h} side="left" />
        </Animated.View>
        <Animated.View style={[layer, earRStyle]}>
          <EarLayer w={w} h={h} side="right" />
        </Animated.View>
        <View style={layer}>
          <HeadLayer w={w} h={h} />
        </View>
        <Animated.View style={[layer, eyesStyle]}>
          <EyesLayer w={w} h={h} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
