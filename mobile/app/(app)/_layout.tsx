import { Tabs } from 'expo-router';

import CatTabBar from '@/components/navigation/cat-tab-bar';

export default function AppTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CatTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Stash',
        }}
      />
      <Tabs.Screen
        name="(play)"
        options={{
          title: 'Play',
        }}
      />
      <Tabs.Screen
        name="(settings)"
        options={{
          title: 'Den',
        }}
      />
    </Tabs>
  );
}
