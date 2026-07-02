import * as Haptics from 'expo-haptics';
import { Pressable, Text } from '@/tw';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: PrimaryButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      className={`items-center rounded-full px-6 py-4 ${
        disabled ? 'bg-fg-line' : 'bg-fg-orange'
      }`}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        { transform: [{ scale: pressed && !disabled ? 0.97 : 1 }] },
      ]}>
      <Text
        className={`text-base font-semibold ${
          disabled ? 'text-fg-ink-2' : 'text-white'
        }`}>
        {label}
      </Text>
    </Pressable>
  );
}
