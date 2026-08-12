import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CatTabIcon from '@/components/navigation/cat-tab-icon';
import { PlusIcon } from '@/components/home/cat-icons';
import QuickActionsSheet from '@/components/navigation/quick-actions-sheet';
import { Pressable, Text, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { Image } from '@/tw/image';
import { SheetStackProvider } from '@/components/navigation/sheet-stack-context';
import SuccessToast from '@/components/ui/success-toast';

type TabConfig = {
  label: string;
  icon: 'home' | 'play' | 'settings';
};

const TAB_CONFIG: Record<string, TabConfig> = {
  '(home)': { label: 'Stash', icon: 'home' },
  '(play)': { label: 'Play', icon: 'play' },
  '(settings)': { label: 'Den', icon: 'settings' },
};

function routeIcon(name: string): 'home' | 'play' | 'settings' {
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
  icon: 'home' | 'play' | 'settings';
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
        <CatTabIcon name={icon} selected={selected} />
        <Animated.View style={labelStyle}>
          <Text
            className={`mt-1 text-xs ${
              selected
                ? icon === 'home' || icon === 'play'
                  ? 'text-fg-orange'
                  : 'text-fg-ink'
                : 'text-fg-ink-2'
            }`}
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

function FabButton({ onPress, active }: { onPress: () => void; active: boolean }) {
  const scale = useSharedValue(1);
  const activeProgress = useSharedValue(0);

  useEffect(() => {
    activeProgress.value = withSpring(active ? 1 : 0, { damping: 15, stiffness: 150 });
  }, [active, activeProgress]);

  const handlePressIn = () => {
    scale.value = withTiming(0.90, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const catStyle = useAnimatedStyle(() => ({
    opacity: interpolate(activeProgress.value, [0, 1], [1, 0]),
    transform: [{ scale: interpolate(activeProgress.value, [0, 1], [1, 0.6]) }],
  }));

  const closeIconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(activeProgress.value, [0, 1], [0, 1]),
    transform: [
      { scale: interpolate(activeProgress.value, [0, 1], [0.6, 1]) },
      { rotate: `${interpolate(activeProgress.value, [0, 1], [0, 45])}deg` },
    ],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="items-center justify-center z-20"
    >
      <Animated.View
        className="w-14 h-14 rounded-full border border-fg-line/80 bg-fg-cream items-center justify-center shadow-md"
        style={[
          {
            borderCurve: 'continuous',
            boxShadow: '0 8px 32px rgba(41, 28, 18, 0.12)',
            elevation: 8,
          },
          animatedStyle,
        ]}
      >
        <Animated.View style={[{ position: 'absolute' }, catStyle]}>
          <Image
            source={require('@/assets/images/fg/fg-home-idle.png')}
            className="w-10 h-10"
            contentFit="contain"
          />
        </Animated.View>
        
        <Animated.View style={[{ position: 'absolute' }, closeIconStyle]}>
          <PlusIcon size={24} color="#ea580c" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export default function CatTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  const [fabActive, setFabActive] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleSaveSuccess = () => {
    setToastVisible(true);
  };

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

  const handleFabPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFabActive(true);
    setQuickActionsVisible(true);
  };

  return (
    <SheetStackProvider onDismissAll={() => {
      setFabActive(false);
      setQuickActionsVisible(false);
    }}>
      <View
        className="px-4 pt-2"
        style={{
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8) + 12,
          backgroundColor: 'transparent',
        }}>
        <View className="flex-row items-center gap-3">
          <View
            className="relative flex-1 flex-row rounded-[28px] border border-fg-line/80 bg-fg-cream px-1 py-1"
            style={{
              borderCurve: 'continuous',
              boxShadow: '0 8px 32px rgba(41, 28, 18, 0.12)',
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

          <FabButton onPress={handleFabPress} active={fabActive} />
        </View>

        {/* Sheet Modals */}
        <QuickActionsSheet
          visible={quickActionsVisible}
          onCloseStart={() => setFabActive(false)}
          onClose={() => {
            setFabActive(false);
            setQuickActionsVisible(false);
          }}
          onSaveSuccess={handleSaveSuccess}
        />
      </View>

      {toastVisible && (
        <SuccessToast
          message="Budget updated! 🍯"
          onDismiss={() => setToastVisible(false)}
        />
      )}
    </SheetStackProvider>
  );
}

