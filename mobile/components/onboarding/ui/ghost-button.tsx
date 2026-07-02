import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { Pressable, Text } from '@/tw';

type GhostButtonProps = {
  label: string;
  onPress: () => void;
};

export default function GhostButton({ label, onPress }: GhostButtonProps) {
  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  return (
    <Pressable
      className="items-center rounded-full px-6 py-3"
      onPress={handlePress}>
      <Text className="text-base font-medium text-fg-ink-2">{label}</Text>
    </Pressable>
  );
}
