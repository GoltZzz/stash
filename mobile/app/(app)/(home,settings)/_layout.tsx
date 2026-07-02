import { Stack } from 'expo-router/stack';

import { colors } from '@/theme/colors';

export const unstable_settings = {
  index: { anchor: 'index' },
  settings: { anchor: 'settings' },
};

const titles: Record<string, string> = {
  home: 'Home',
  settings: 'Settings',
};

const screenNames: Record<string, string> = {
  home: 'index',
  settings: 'settings',
};

export default function TabStackLayout({ segment }: { segment: string }) {
  const tab = segment.match(/\((.*)\)/)?.[1] ?? 'home';
  const screenName = screenNames[tab] ?? 'index';

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: { backgroundColor: 'transparent' },
        headerTitleStyle: { color: colors.label as unknown as string },
        headerLargeTitle: true,
        headerBlurEffect: 'none',
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Screen name={screenName} options={{ title: titles[tab] ?? 'Home' }} />
    </Stack>
  );
}
