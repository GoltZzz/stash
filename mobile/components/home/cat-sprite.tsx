import { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import Cat3D from './cat-3d';
import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

export type CatMood = 'good' | 'warning' | 'critical' | 'empty' | 'walking';

type CatSpriteProps = {
  size?: number;
  mood?: CatMood;
  onTap?: () => void;
};

const MEOW_SOUNDS = [
  'Meow!',
  'Mew~',
  'Purr...',
  'Mrrp!',
  'Nya!',
  'Meow-ment!',
  '🐾',
];

export default function CatSprite({ size = 150, mood = 'good', onTap }: CatSpriteProps) {
  const [meowText, setMeowText] = useState<string | null>(null);

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const randomMeow = MEOW_SOUNDS[Math.floor(Math.random() * MEOW_SOUNDS.length)];
    setMeowText(randomMeow);
    onTap?.();
  };

  // Sound/text timer helper
  useEffect(() => {
    if (!meowText) return;
    const timer = setTimeout(() => setMeowText(null), 1600);
    return () => clearTimeout(timer);
  }, [meowText]);

  return (
    <View className="items-center relative overflow-visible" style={{ width: size, height: size }}>
      {meowText ? (
        <Animated.View
          className="absolute -top-6 bg-fg-ink px-2.5 py-1 rounded-full border border-fg-line/20 shadow-sm"
          style={{
            zIndex: 50,
            boxShadow: '0 2px 8px rgba(41, 28, 18, 0.15)',
          }}>
          <Text className="text-[11px] font-bold text-fg-cream">{meowText}</Text>
          <View
            className="absolute bottom-[-3px] left-1/2 -ml-1 w-2 h-2 bg-fg-ink rotate-45"
            style={{ zIndex: -1 }}
          />
        </Animated.View>
      ) : null}

      <Cat3D size={size} mood={mood} onTap={handlePress} />
    </View>
  );
}
