import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CatTabIcon from '@/components/navigation/cat-tab-icon';
import ScratchEdge from '@/components/navigation/scratch-edge';
import { Pressable, Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

type TabConfig = {
  label: string;
  icon: 'home' | 'settings';
};

const TAB_CONFIG: Record<string, TabConfig> = {
  '(home)': { label: 'Stash', icon: 'home' },
  '(settings)': { label: 'Den', icon: 'settings' },
};

function routeIcon(name: string): 'home' | 'settings' {
  return TAB_CONFIG[name]?.icon ?? 'home';
}

function routeLabel(name: string): string {
  return TAB_CONFIG[name]?.label ?? name;
}

function TabItem({
  label,
  icon,
  selected,
  onPress,
  onLongPress,
  reducedMotion,
}: {
  label: string;
  icon: 'home' | 'settings';
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  reducedMotion: boolean;
}) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, {
      duration: reducedMotion ? 0 : 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [selected, reducedMotion, progress]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.92, 1]) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 1.04]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, -2])}deg` },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      className="min-h-11 flex-1 items-center justify-center px-2 py-2"
      style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1 }]}>
      <View className="relative items-center justify-center">
        <Animated.View
          className="absolute inset-0 rounded-2xl bg-fg-orange-soft border border-fg-line/70"
          style={[
            { top: -4, bottom: -4, left: -8, right: -8, borderCurve: 'continuous' },
            pillStyle,
          ]}
        />
        {selected ? (
          <>
            <ScratchEdge side="left" style={{ left: -6 }} />
            <ScratchEdge side="right" style={{ right: -6 }} />
          </>
        ) : null}
        <CatTabIcon name={icon} selected={selected} />
        <Animated.View style={labelStyle}>
          <Text
            className={`mt-1 text-xs ${selected ? 'text-fg-orange' : 'text-fg-ink-2'}`}
            style={
              selected
                ? {
                    fontFamily: 'Fraunces_400Regular_Italic',
                    letterSpacing: 0.3,
                  }
                : {
                    fontWeight: '600',
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    fontSize: 10,
                  }
            }>
            {label}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

export default function CatTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  const handlePress = (routeKey: string, routeName: string, isFocused: boolean) => {
    void Haptics.selectionAsync();

    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const handleLongPress = (routeKey: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.emit({ type: 'tabLongPress', target: routeKey });
  };

  return (
    <View
      className="px-4 pt-2"
      style={{
        paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8),
        backgroundColor: 'transparent',
      }}>
      <View
        className="relative flex-row overflow-hidden rounded-[28px] border border-fg-line/80 bg-fg-cream px-1 py-1"
        style={{
          borderCurve: 'continuous',
          boxShadow: '0 4px 24px rgba(41, 28, 18, 0.08)',
        }}>
        {/* Bar-level scratch accents */}
        <View
          pointerEvents="none"
          className="absolute rounded-full bg-fg-ink/15"
          style={{ width: 18, height: 2, top: 6, left: 14, transform: [{ rotate: '-24deg' }] }}
        />
        <View
          pointerEvents="none"
          className="absolute rounded-full bg-fg-ink/12"
          style={{ width: 14, height: 2, top: 10, left: 10, transform: [{ rotate: '-12deg' }] }}
        />
        <View
          pointerEvents="none"
          className="absolute rounded-full bg-fg-ink/15"
          style={{ width: 16, height: 2, top: 8, right: 12, transform: [{ rotate: '20deg' }] }}
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const icon = routeIcon(route.name);
          const label = routeLabel(route.name);

          return (
            <TabItem
              key={route.key}
              label={label}
              icon={icon}
              selected={isFocused}
              reducedMotion={reducedMotion ?? false}
              onPress={() => handlePress(route.key, route.name, isFocused)}
              onLongPress={() => handleLongPress(route.key)}
            />
          );
        })}
      </View>
    </View>
  );
}
