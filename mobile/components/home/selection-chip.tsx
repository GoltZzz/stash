import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

import { Pressable, Text } from '@/tw';

type SelectionChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function SelectionChip({
  label,
  selected,
  onPress,
}: SelectionChipProps) {
  const handlePress = useCallback(() => {
    void Haptics.selectionAsync();
    onPress();
  }, [onPress]);

  return (
    <Pressable
      className={`rounded-full px-5 py-3 items-center justify-center min-h-[44px] ${
        selected
          ? 'bg-fg-orange shadow-sm shadow-fg-orange/10 border border-fg-orange'
          : 'bg-fg-orange-soft border border-fg-line/30'
      } active:scale-[0.95]`}
      style={{ borderCurve: 'continuous' }}
      onPress={handlePress}>
      <Text
        className={`text-sm font-semibold ${
          selected ? 'text-white' : 'text-fg-ink'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
