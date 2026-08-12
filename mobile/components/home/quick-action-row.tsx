import * as Haptics from 'expo-haptics';

import { Pressable, Text, View } from '@/tw';
import type { QuickAction } from './quick-actions';

type QuickActionRowProps = {
  action: QuickAction;
  onPress: (action: QuickAction) => void;
};

export default function QuickActionRow({ action, onPress }: QuickActionRowProps) {
  const isAvailable = action.status === 'available';
  const isComingSoon = action.status === 'coming_soon';

  const handlePress = () => {
    if (isComingSoon) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress(action);
  };

  const Icon = action.icon;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={action.title}
      accessibilityHint={action.subtitle}
      accessibilityState={{ disabled: isComingSoon }}
      className={`flex-row items-center p-4 rounded-2xl border justify-between active:scale-[0.99] ${
        isAvailable
          ? 'bg-fg-orange-soft border-fg-line/75'
          : 'bg-fg-orange-soft/30 border-fg-line/45'
      }`}
      style={{ borderCurve: 'continuous' }}>
      <View className="flex-row items-center gap-3 flex-1 pr-2">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isAvailable ? 'bg-fg-orange' : 'bg-fg-line/50'
          }`}>
          <Icon size={18} color={isAvailable ? '#ffffff' : '#786252'} />
        </View>
        <View className="gap-0.5 flex-1">
          <Text className="text-base font-bold text-fg-ink">{action.title}</Text>
          <Text className="text-xs text-fg-ink-2">{action.subtitle}</Text>
        </View>
      </View>

      {isComingSoon ? (
        <Text className="text-[10px] font-bold text-fg-ink-2 bg-fg-line/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Soon
        </Text>
      ) : action.badgeLabel ? (
        <Text className="text-xs font-bold text-white bg-fg-orange px-3 py-1 rounded-full">
          {action.badgeLabel}
        </Text>
      ) : null}
    </Pressable>
  );
}
