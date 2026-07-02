import { ScrollView, Text, View } from '@/tw';

import { useDatabase } from '@/providers/database-provider';

export default function SettingsScreen() {
  const { status, error, onboardingComplete } = useDatabase();

  return (
    <ScrollView
      className="flex-1 bg-sf-bg"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="gap-6 px-4 py-4">
      <View className="overflow-hidden rounded-2xl bg-sf-bg-2">
        <View className="border-b border-sf-gray/20 px-4 py-4">
          <Text className="text-base font-medium text-sf-text" selectable>
            Sync
          </Text>
          <Text className="mt-1 text-sm text-sf-text-2" selectable>
            Coming soon
          </Text>
        </View>
        <View className="px-4 py-4">
          <Text className="text-base font-medium text-sf-text" selectable>
            About
          </Text>
          <Text className="mt-1 text-sm text-sf-text-2" selectable>
            Stash v1.0.0
          </Text>
        </View>
      </View>

      <View className="rounded-2xl bg-sf-bg-2 px-4 py-4">
        <Text className="text-sm font-medium text-sf-text-2" selectable>
          Database
        </Text>
        <Text className="mt-1 text-base text-sf-text" selectable>
          {status === 'ready'
            ? 'Ready'
            : status === 'error'
              ? `Error: ${error?.message ?? 'Unknown error'}`
              : 'Initializing...'}
        </Text>
        <Text className="mt-2 text-sm text-sf-text-2" selectable>
          Onboarding: {onboardingComplete ? 'Complete' : 'Pending'}
        </Text>
      </View>
    </ScrollView>
  );
}
