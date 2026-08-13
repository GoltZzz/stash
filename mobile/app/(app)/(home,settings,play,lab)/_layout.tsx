import { Stack } from 'expo-router/stack';

export const unstable_settings = {
  index: { anchor: 'index' },
  play: { anchor: 'play' },
  settings: { anchor: 'settings' },
  lab: { anchor: 'lab' },
};

const screenNames: Record<string, string> = {
  home: 'index',
  play: 'play',
  settings: 'settings',
  lab: 'lab',
};

export default function TabStackLayout({ segment }: { segment: string }) {
  const tab = segment.match(/\((.*)\)/)?.[1] ?? 'home';
  const screenName = screenNames[tab] ?? 'index';

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={screenName} />
    </Stack>
  );
}
