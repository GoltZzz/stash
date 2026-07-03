import PrimaryButton from '@/components/onboarding/ui/primary-button';
import { Text, View } from '@/tw';

export default function HomeActions() {
  return (
    <View className="gap-3">
      <PrimaryButton label="Add Expense" onPress={() => {}} disabled />
      <Text className="text-center text-xs text-fg-ink-2">
        Expense tracking is coming soon
      </Text>

      <View className="flex-row items-center justify-center gap-4 pt-1">
        <Text className="text-sm text-fg-ink-2 opacity-50">Review spending</Text>
        <Text className="text-fg-line">·</Text>
        <Text className="text-sm text-fg-ink-2 opacity-50">Adjust budget</Text>
      </View>
    </View>
  );
}
