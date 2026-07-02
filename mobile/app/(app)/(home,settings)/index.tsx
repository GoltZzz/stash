import { ScrollView, Text, View } from '@/tw';

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-sf-bg"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="flex-1 items-center justify-center gap-3 px-6">
      <View className="items-center gap-2">
        <Text className="text-4xl font-bold text-sf-text" selectable>
          Stash
        </Text>
        <Text className="text-center text-base text-sf-text-2" selectable>
          Offline-first budget tracker
        </Text>
      </View>
    </ScrollView>
  );
}
