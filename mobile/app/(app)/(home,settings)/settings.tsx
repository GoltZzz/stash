import AppScreen from '@/components/ui/app-screen';
import { Text, View } from '@/tw';

import { useDatabase } from '@/providers/database-provider';

export default function SettingsScreen() {
  const { status, error, onboardingComplete } = useDatabase();

  return (
    <AppScreen>
      <View className="overflow-hidden rounded-3xl bg-fg-orange-soft border border-fg-line/60">
        <View className="border-b border-fg-line/60 px-5 py-5">
          <Text className="text-base font-semibold text-fg-ink" selectable>
            Sync
          </Text>
          <Text className="mt-1 text-sm text-fg-ink-2" selectable>
            Coming soon
          </Text>
        </View>
        <View className="px-5 py-5">
          <Text className="text-base font-semibold text-fg-ink" selectable>
            About
          </Text>
          <Text className="mt-1 text-sm text-fg-ink-2" selectable>
            Stash v1.0.0
          </Text>
        </View>
      </View>

      <View className="rounded-3xl bg-fg-orange-soft border border-fg-line/60 px-5 py-5">
        <Text className="text-xs font-semibold uppercase tracking-wider text-fg-ink-2" selectable>
          Database
        </Text>
        <Text className="mt-1.5 text-base font-bold text-fg-ink" selectable>
          {status === 'ready'
            ? 'Ready'
            : status === 'error'
              ? `Error: ${error?.message ?? 'Unknown error'}`
              : 'Initializing...'}
        </Text>
        <Text className="mt-1.5 text-sm text-fg-ink-2" selectable>
          Onboarding: {onboardingComplete ? 'Complete' : 'Pending'}
        </Text>
      </View>
    </AppScreen>
  );
}
