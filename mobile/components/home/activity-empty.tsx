import { Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

export default function ActivityEmpty() {
  return (
    <Animated.View className="gap-3 rounded-3xl border border-fg-line bg-fg-cream p-6">
      <Text
        className="text-lg font-bold text-fg-ink"
        style={{ fontFamily: 'Fraunces_600SemiBold' }}>
        Recent activity
      </Text>
      <View className="items-center gap-2 py-4">
        <Text className="text-3xl opacity-30">🧾</Text>
        <Text className="text-center text-base font-medium text-fg-ink">
          No transactions yet
        </Text>
        <Text className="text-center text-sm leading-relaxed text-fg-ink-2">
          When expense tracking lands, everything you log will show up here—and
          the cat will react as your stash shrinks.
        </Text>
      </View>
    </Animated.View>
  );
}
