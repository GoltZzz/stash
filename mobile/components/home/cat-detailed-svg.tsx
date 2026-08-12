import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Path,
  Ellipse,
  Circle,
} from 'react-native-svg';

import { CatMood } from './cat-sprite';

const AnimatedG = Animated.createAnimatedComponent(G);

type CatDetailedSVGProps = {
  size?: number;
  mood?: CatMood;
  onTap?: () => void;
};

export default function CatDetailedSVG({ size = 200, mood = 'good', onTap }: CatDetailedSVGProps) {
  // Animation Shared Values
  const breathing = useSharedValue(1);
  const tailSway = useSharedValue(0);
  const eyeBlink = useSharedValue(1);
  const headBob = useSharedValue(0);

  // Idle Animations
  useEffect(() => {
    // Gentle breathing: scale y slightly
    breathing.value = withRepeat(
      withTiming(1.03, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    // Tail swaying: rotate slightly
    tailSway.value = withRepeat(
      withTiming(8, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    // Head bobbing: move up/down slightly out of sync with breathing
    headBob.value = withRepeat(
      withTiming(1.5, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, []);

  // Periodic Eye Blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      // Don't blink if sleeping
      if (mood === 'empty') return;
      eyeBlink.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 120 })
      );
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, [mood]);

  // Animated Props using translate/rotate/scale matrix strings (safe for react-native-svg G)
  const bodyProps = useAnimatedProps(() => {
    const scaleY = breathing.value;
    const scaleX = 1 + (breathing.value - 1) * 0.3;
    return {
      transform: `translate(76, 130) scale(${scaleX}, ${scaleY}) translate(-76, -130)`,
    };
  });

  const headProps = useAnimatedProps(() => {
    const scaleY = 1 + (breathing.value - 1) * 0.1;
    const dy = headBob.value;
    return {
      transform: `translate(76, 65) translate(0, ${dy}) scale(1, ${scaleY}) translate(-76, -65)`,
    };
  });

  const tailProps = useAnimatedProps(() => {
    const rot = tailSway.value;
    return {
      transform: `translate(115, 115) rotate(${rot}) translate(-115, -115)`,
    };
  });

  const eyeProps = useAnimatedProps(() => {
    const scaleY = eyeBlink.value;
    return {
      transform: `translate(80, 77) scale(1, ${scaleY}) translate(-80, -77)`,
    };
  });

  // Render eyes based on mood
  const renderEyes = () => {
    if (mood === 'empty') {
      // Sleeping / Closed happy curved eyes
      return (
        <G>
          {/* Left Sleeping Eye */}
          <Path
            d="M 52 76 C 56 81, 64 81, 68 76"
            fill="none"
            stroke="#291c12"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Right Sleeping Eye */}
          <Path
            d="M 92 76 C 96 81, 104 81, 108 76"
            fill="none"
            stroke="#291c12"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </G>
      );
    }

    if (mood === 'critical' || mood === 'warning') {
      // Angry / Squinting eyes looking down/inward
      return (
        <AnimatedG animatedProps={eyeProps}>
          {/* Left Eye */}
          <G transform="translate(60, 76)">
            {/* White/Yellow angry eyeball */}
            <Path d="M -10 -2 C -5 -6, 5 -4, 8 2 C 5 6, -5 6, -10 2 Z" fill="#f59e0b" stroke="#291c12" strokeWidth="2.5" />
            {/* Pupil */}
            <Ellipse cx="-1" cy="1" rx="2" ry="4" fill="#291c12" />
            {/* Angry Eyebrow Eyelid */}
            <Path d="M -12 -5 L 10 -1 L 8 -5 Z" fill="#b45309" />
          </G>
          {/* Right Eye */}
          <G transform="translate(100, 76)">
            {/* White/Yellow angry eyeball */}
            <Path d="M -8 2 C -5 -4, 5 -6, 10 -2 C 10 2, 5 6, -8 2 Z" fill="#f59e0b" stroke="#291c12" strokeWidth="2.5" />
            {/* Pupil */}
            <Ellipse cx="1" cy="1" rx="2" ry="4" fill="#291c12" />
            {/* Angry Eyebrow Eyelid */}
            <Path d="M -10 -1 L 12 -5 L 10 -5 Z" fill="#b45309" />
          </G>
        </AnimatedG>
      );
    }

    // Default Grumpy/Determined Persian Eyes (from fg-idle)
    return (
      <AnimatedG animatedProps={eyeProps}>
        {/* Left Eye */}
        <G transform="translate(58, 77)">
          <Path
            d="M -11 -1 C -6 -6, 6 -4, 9 3 C 4 7, -6 6, -11 1 Z"
            fill="#d97706"
            stroke="#291c12"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Big black pupil */}
          <Ellipse cx="-1" cy="1.5" rx="3.5" ry="4.5" fill="#1e1b4b" />
          {/* Highlight */}
          <Circle cx="-2" cy="-0.5" r="1.2" fill="#ffffff" />
          {/* Eyelid shadow/fold */}
          <Path d="M -13 -3 C -5 -8, 5 -6, 10 1" fill="none" stroke="#78350f" strokeWidth="1.5" />
        </G>

        {/* Right Eye */}
        <G transform="translate(102, 77)">
          <Path
            d="M -9 3 C -6 -4, 6 -6, 11 -1 C 11 1, 6 6, -9 3 Z"
            fill="#d97706"
            stroke="#291c12"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Big black pupil */}
          <Ellipse cx="1" cy="1.5" rx="3.5" ry="4.5" fill="#1e1b4b" />
          {/* Highlight */}
          <Circle cx="0" cy="-0.5" r="1.2" fill="#ffffff" />
          {/* Eyelid shadow/fold */}
          <Path d="M -10 1 C -5 -6, 5 -8, 13 -3" fill="none" stroke="#78350f" strokeWidth="1.5" />
        </G>
      </AnimatedG>
    );
  };

  return (
    <Pressable onPress={onTap} style={{ width: size, height: size }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 160 160"
        style={{ overflow: 'visible' }}
      >
        <Defs>
          {/* Fur Gradient - Orange */}
          <LinearGradient id="orangeFur" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#f97316" />
            <Stop offset="60%" stopColor="#ea580c" />
            <Stop offset="100%" stopColor="#c2410c" />
          </LinearGradient>

          {/* Highlight Orange for Face/Back */}
          <LinearGradient id="orangeHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#fdba74" />
            <Stop offset="50%" stopColor="#f97316" />
            <Stop offset="100%" stopColor="#ea580c" />
          </LinearGradient>

          {/* Shaded/Stripe Orange */}
          <LinearGradient id="orangeShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#ea580c" />
            <Stop offset="100%" stopColor="#9a3412" />
          </LinearGradient>

          {/* Chest Cream Patch */}
          <LinearGradient id="creamChest" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#fff7ed" />
            <Stop offset="100%" stopColor="#fed7aa" />
          </LinearGradient>

          {/* Eye Iris Gradient */}
          <RadialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#f59e0b" />
            <Stop offset="70%" stopColor="#d97706" />
            <Stop offset="100%" stopColor="#78350f" />
          </RadialGradient>

          {/* Drop Shadow under Cat */}
          <RadialGradient id="dropShadow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="rgba(15, 7, 2, 0.45)" />
            <Stop offset="100%" stopColor="rgba(15, 7, 2, 0)" />
          </RadialGradient>
        </Defs>

        {/* 1. Drop Shadow */}
        <Ellipse cx="76" cy="142" rx="48" ry="8" fill="url(#dropShadow)" />

        {/* 2. Fluffy Tail (Animates separately behind body) */}
        <AnimatedG animatedProps={tailProps}>
          {/* Main tail shape - very fluffy with nested fur textures */}
          <Path
            d="M 115 110 
               C 125 115, 145 105, 148 85 
               C 152 65, 142 50, 132 45 
               C 118 38, 105 48, 108 65 
               C 110 78, 122 82, 122 92
               C 122 102, 115 108, 110 110 Z"
            fill="url(#orangeFur)"
            stroke="#291c12"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Tail Fur Details / Stripes */}
          <Path
            d="M 135 52 C 128 55, 122 62, 125 70"
            fill="none"
            stroke="#78350f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Path
            d="M 144 68 C 138 72, 134 80, 138 88"
            fill="none"
            stroke="#78350f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Path
            d="M 142 85 C 134 90, 130 96, 132 102"
            fill="none"
            stroke="#78350f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Tail highlights */}
          <Path
            d="M 125 43 C 132 41, 140 46, 143 55"
            fill="none"
            stroke="#fdba74"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </AnimatedG>

        {/* 3. Fluffy Body (Breathing scale) */}
        <AnimatedG animatedProps={bodyProps}>
          {/* Main chubby body outline & fill */}
          <Path
            d="M 36 128 
               C 22 120, 20 95, 30 80 
               C 36 72, 45 68, 55 68
               C 70 68, 82 68, 97 68
               C 107 68, 116 72, 122 80
               C 132 95, 130 120, 116 128
               C 106 134, 46 134, 36 128 Z"
            fill="url(#orangeFur)"
            stroke="#291c12"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Fluffy Cream Chest Patch */}
          <Path
            d="M 52 75 
               C 42 85, 42 105, 52 118 
               C 62 126, 90 126, 100 118
               C 110 105, 110 85, 100 75
               C 88 85, 64 85, 52 75 Z"
            fill="url(#creamChest)"
            stroke="#291c12"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Body Stripes (Sides and Back) */}
          {/* Left side stripes */}
          <Path d="M 28 92 C 34 94, 38 98, 38 104" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <Path d="M 26 102 C 32 104, 36 108, 36 114" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          {/* Right side stripes */}
          <Path d="M 124 92 C 118 94, 114 98, 114 104" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <Path d="M 126 102 C 120 104, 116 108, 116 114" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />

          {/* Back Paws (Sitting stance) */}
          {/* Left Back Paw */}
          <G transform="translate(36, 126)">
            <Path d="M 0 0 C -8 0, -12 8, -6 12 C 0 14, 10 12, 10 4 Z" fill="url(#orangeShade)" stroke="#291c12" strokeWidth="3" />
            <Path d="M -2 12 L -2 6" stroke="#291c12" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 3 12 L 3 6" stroke="#291c12" strokeWidth="2.5" strokeLinecap="round" />
          </G>
          {/* Right Back Paw */}
          <G transform="translate(106, 126)">
            <Path d="M 0 4 C 0 12, 10 14, 16 12 C 22 8, 18 0, 10 0 Z" fill="url(#orangeShade)" stroke="#291c12" strokeWidth="3" />
            <Path d="M 7 12 L 7 6" stroke="#291c12" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M 12 12 L 12 6" stroke="#291c12" strokeWidth="2.5" strokeLinecap="round" />
          </G>

          {/* Front Paws (Folded over belly, very cute and stubby) */}
          {/* Left Front Paw */}
          <G transform="translate(48, 92)">
            <Path d="M -5 -12 C -6 -4, -4 6, 2 8 C 8 10, 13 4, 11 -4 C 9 -12, -2 -14, -5 -12 Z" fill="url(#orangeHighlight)" stroke="#291c12" strokeWidth="3" />
            <Path d="M 3 8 C 3 4, 5 2, 7 2" fill="none" stroke="#291c12" strokeWidth="2" strokeLinecap="round" />
            <Path d="M 6 8 C 6 6, 8 4, 9 4" fill="none" stroke="#291c12" strokeWidth="2" strokeLinecap="round" />
          </G>
          {/* Right Front Paw */}
          <G transform="translate(90, 92)">
            <Path d="M 5 -12 C 6 -4, 4 6, -2 8 C -8 10, -13 4, -11 -4 C -9 -12, 2 -14, 5 -12 Z" fill="url(#orangeHighlight)" stroke="#291c12" strokeWidth="3" />
            <Path d="M -3 8 C -3 4, -5 2, -7 2" fill="none" stroke="#291c12" strokeWidth="2" strokeLinecap="round" />
            <Path d="M -6 8 C -6 6, -8 4, -9 4" fill="none" stroke="#291c12" strokeWidth="2" strokeLinecap="round" />
          </G>
        </AnimatedG>

        {/* 4. Extremely Fluffy Head & Face (Bobbing animation) */}
        <AnimatedG animatedProps={headProps}>
          {/* Ears */}
          {/* Left Ear */}
          <G transform="translate(32, 26)">
            {/* Outer Ear */}
            <Path d="M -2 24 L -12 -8 C -10 -10, 4 -6, 12 12 Z" fill="url(#orangeShade)" stroke="#291c12" strokeWidth="3.5" strokeLinejoin="round" />
            {/* Inner Ear Pink */}
            <Path d="M -4 20 L -8 -2 C -7 -3, 2 -1, 6 11 Z" fill="#f87171" />
            {/* Fur tufts in ears */}
            <Path d="M -5 12 Q 2 12, 6 6 M -4 8 Q 1 7, 3 3" fill="none" stroke="#fff7ed" strokeWidth="2" strokeLinecap="round" />
          </G>
          {/* Right Ear */}
          <G transform="translate(104, 26)">
            {/* Outer Ear */}
            <Path d="M 2 24 L 12 -8 C 10 -10, -4 -6, -12 12 Z" fill="url(#orangeShade)" stroke="#291c12" strokeWidth="3.5" strokeLinejoin="round" />
            {/* Inner Ear Pink */}
            <Path d="M 4 20 L 8 -2 C 7 -3, -2 -1, -6 11 Z" fill="#f87171" />
            {/* Fur tufts in ears */}
            <Path d="M 5 12 Q -2 12, -6 6 M 4 8 Q -1 7, -3 3" fill="none" stroke="#fff7ed" strokeWidth="2" strokeLinecap="round" />
          </G>

          {/* Main Face Fluff / Mane (The hallmark of Persian cat) */}
          <Path
            d="M 76 22
               C 105 22, 122 35, 128 50 
               C 134 65, 132 82, 122 92
               C 112 102, 95 105, 76 105
               C 57 105, 40 102, 30 92
               C 20 82, 18 65, 24 50
               C 30 35, 47 22, 76 22 Z"
            fill="url(#orangeHighlight)"
            stroke="#291c12"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Fluffy cheek layering curves for 3D feel */}
          {/* Left cheek overlay */}
          <Path
            d="M 28 65 C 22 75, 30 90, 48 95 C 42 85, 34 75, 28 65 Z"
            fill="#ea580c"
            opacity="0.3"
          />
          {/* Right cheek overlay */}
          <Path
            d="M 124 65 C 130 75, 122 90, 104 95 C 110 85, 118 75, 124 65 Z"
            fill="#ea580c"
            opacity="0.3"
          />

          {/* Face details / Stripes */}
          {/* Forehead stripes */}
          <Path d="M 70 28 Q 76 34, 82 28" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M 66 34 Q 76 40, 86 34" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
          <Path d="M 72 40 Q 76 44, 80 40" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

          {/* Eyes rendering */}
          {renderEyes()}

          {/* Nose - small pink triangle */}
          <Path
            d="M 77 82 L 83 82 L 80 85 Z"
            fill="#f87171"
            stroke="#291c12"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Grumpy Mouth - downward double curve */}
          <Path
            d="M 73 89 Q 77 91, 80 87 Q 83 91, 87 89"
            fill="none"
            stroke="#291c12"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Cheeks blush (glowing slightly if good mood) */}
          {mood === 'good' && (
            <G opacity="0.45">
              <Circle cx="44" cy="85" r="5" fill="#f43f5e" />
              <Circle cx="108" cy="85" r="5" fill="#f43f5e" />
            </G>
          )}

          {/* Whiskers - 3 on each side */}
          {/* Left Whiskers */}
          <Path d="M 44 86 C 26 86, 12 90, 8 92" fill="none" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M 43 89 C 24 92, 10 98, 6 102" fill="none" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M 44 92 C 26 97, 14 106, 10 110" fill="none" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" />
          {/* Right Whiskers */}
          <Path d="M 108 86 C 126 86, 140 90, 144 92" fill="none" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M 109 89 C 128 92, 142 98, 146 102" fill="none" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M 108 92 Q 126 97, 142 110" fill="none" stroke="#fff7ed" strokeWidth="1.8" strokeLinecap="round" />
        </AnimatedG>
      </Svg>
    </Pressable>
  );
}
