import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';

import AppScreen from '@/components/ui/app-screen';
import CatMascot from '@/components/mascot/cat-mascot';
import { Pressable, Text, View } from '@/tw';
import { Image } from '@/tw/image';

const ANIMATIONS = {
  idle: {
    label: 'Idle',
    source: require('@/assets/images/fg/anim/cat-idle.webp'),
    frames: 6,
    ms: 130,
    size: '18 KB',
  },
  special: {
    label: 'Special',
    source: require('@/assets/images/fg/anim/cat-special.webp'),
    frames: 8,
    ms: 110,
    size: '44 KB',
  },
} as const;

type AnimKey = keyof typeof ANIMATIONS;

// The WebP canvas is 256x256. Displaying at a size where
// 256 / displayPx is a whole number keeps pixels perfectly sharp.
const SIZES = [64, 128, 256] as const;

function SectionLabel({ kicker, title }: { kicker: string; title: string }) {
  return (
    <View>
      <Text className="text-[10px] font-bold text-fg-orange-deep uppercase tracking-wider">
        {kicker}
      </Text>
      <Text
        className="text-lg font-bold text-fg-ink"
        style={{ fontFamily: 'Fraunces_600SemiBold' }}>
        {title}
      </Text>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      className={`px-3.5 py-2 rounded-full border ${
        active ? 'bg-fg-orange border-fg-orange' : 'bg-fg-cream border-fg-line/80'
      }`}
      style={({ pressed }) => [{ borderCurve: 'continuous', opacity: pressed ? 0.85 : 1 }]}>
      <Text
        className={`text-[10px] font-bold uppercase tracking-wider ${
          active ? 'text-fg-cream' : 'text-fg-ink-2'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function LabScreen() {
  const [anim, setAnim] = useState<AnimKey>('idle');
  const [size, setSize] = useState<number>(128);
  const [playing, setPlaying] = useState(true);
  const [onDark, setOnDark] = useState(false);

  const current = ANIMATIONS[anim];
  const sharp = 256 % size === 0;

  return (
    <View className="flex-1 bg-fg-cream">
      <AppScreen contentClassName="gap-6 pb-10">
        <View className="px-6 gap-1">
          <SectionLabel kicker="Sprite Lab" title="Animated WebP" />
          <Text className="text-sm text-fg-ink-2 mt-1">
            Pixel-art cat rendered from a single animated WebP via expo-image. Full alpha
            channel, so edges composite cleanly on any background.
          </Text>
        </View>

        {/* Stage */}
        <View className="px-6">
          <View
            className={`items-center justify-center rounded-[24px] border border-fg-line/70 py-8 ${
              onDark ? 'bg-fg-ink' : 'bg-fg-orange-soft/20'
            }`}
            style={{ borderCurve: 'continuous' }}>
            <Image
              key={`${anim}-${playing}`}
              source={current.source}
              autoplay={playing}
              allowDownscaling={false}
              contentFit="contain"
              style={{ width: size, height: size }}
            />
          </View>
        </View>

        {/* Controls */}
        <View className="px-6 gap-4">
          <View className="gap-2">
            <Text className="text-[10px] font-bold text-fg-ink-2 uppercase tracking-widest">
              Animation
            </Text>
            <View className="flex-row gap-2">
              {(Object.keys(ANIMATIONS) as AnimKey[]).map((key) => (
                <Chip
                  key={key}
                  label={ANIMATIONS[key].label}
                  active={anim === key}
                  onPress={() => setAnim(key)}
                />
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-[10px] font-bold text-fg-ink-2 uppercase tracking-widest">
              Display size
            </Text>
            <View className="flex-row gap-2">
              {SIZES.map((s) => (
                <Chip
                  key={s}
                  label={`${s}px`}
                  active={size === s}
                  onPress={() => setSize(s)}
                />
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-[10px] font-bold text-fg-ink-2 uppercase tracking-widest">
              Options
            </Text>
            <View className="flex-row gap-2">
              <Chip
                label={playing ? 'Pause' : 'Play'}
                active={!playing}
                onPress={() => setPlaying((p) => !p)}
              />
              <Chip
                label="Dark bg"
                active={onDark}
                onPress={() => setOnDark((d) => !d)}
              />
            </View>
          </View>
        </View>

        {/* Vector mascot — the replacement */}
        <View className="px-6 gap-1 mt-2">
          <SectionLabel kicker="Vector" title="Code-drawn mascot" />
          <Text className="text-sm text-fg-ink-2 mt-1">
            Same cat as SVG paths, animated with Reanimated on the UI thread. Breathing, head
            drift, tail sway, randomised blinks and ear flicks — all at display framerate, no
            sprite frames, no native modules.
          </Text>
        </View>

        <View className="px-6">
          <View
            className={`items-center justify-center rounded-[24px] border border-fg-line/70 py-8 ${
              onDark ? 'bg-fg-ink' : 'bg-fg-orange-soft/20'
            }`}
            style={{ borderCurve: 'continuous' }}>
            <CatMascot size={size} />
          </View>
        </View>

        {/* Readout */}
        <View
          className="mx-6 p-4 bg-fg-cream border border-fg-line/60 rounded-[24px] gap-2"
          style={{ borderCurve: 'continuous' }}>
          <View className="flex-row justify-between">
            <Text className="text-xs text-fg-ink-2">Frames</Text>
            <Text className="text-xs text-fg-ink font-bold">{current.frames}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-fg-ink-2">Frame duration</Text>
            <Text className="text-xs text-fg-ink font-bold">{current.ms} ms</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-fg-ink-2">File size</Text>
            <Text className="text-xs text-fg-ink font-bold">{current.size}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-fg-ink-2">Source canvas</Text>
            <Text className="text-xs text-fg-ink font-bold">256 x 256</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-fg-ink-2">Pixel grid</Text>
            <Text className="text-xs text-fg-ink font-bold">128 x 128</Text>
          </View>
          <View className="h-px bg-fg-line/60 my-1" />
          <Text className="text-sm text-fg-ink-2 leading-5">
            {sharp
              ? `256 divides evenly into ${size}px — pixels stay sharp at this size.`
              : `256 does not divide evenly into ${size}px — expect slight softening. Re-export the WebP at a multiple of ${size} for a crisp result.`}
          </Text>
        </View>
      </AppScreen>
    </View>
  );
}
