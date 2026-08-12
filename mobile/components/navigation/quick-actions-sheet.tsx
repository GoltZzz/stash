/* eslint-disable react-hooks/immutability */
import React, { useCallback, useEffect } from 'react';
import { Modal, Platform, View as RNView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';

import QuickActionRow from '@/components/home/quick-action-row';
import { QUICK_ACTIONS, type QuickAction } from '@/components/home/quick-actions';
import { PlusIcon } from '@/components/home/cat-icons';
import { Pressable, View } from '@/tw';
import { Animated } from '@/tw/animated';
import { Image } from '@/tw/image';
import { useSheetStack } from './sheet-stack-context';
import BudgetEditSheet from './budget-edit-sheet';

interface QuickActionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  onCloseStart?: () => void;
}

export default function QuickActionsSheet({ visible, onClose, onSaveSuccess, onCloseStart }: QuickActionsSheetProps) {
  const insets = useSafeAreaInsets();
  const { pushSheet, popSheet, isOpen, dismissAll } = useSheetStack();

  const itemProgress1 = useSharedValue(0); // Top item ('add_expense')
  const itemProgress2 = useSharedValue(0); // Middle item ('review_spending')
  const itemProgress3 = useSharedValue(0); // Bottom item ('adjust_budget')
  const backdropProgress = useSharedValue(0);
  const fabProgress = useSharedValue(0);
  const replicaScale = useSharedValue(1);

  const handleFabPressIn = () => {
    replicaScale.value = withTiming(0.90, { duration: 80 });
  };

  const handleFabPressOut = () => {
    replicaScale.value = withTiming(1, { duration: 100 });
  };

  useEffect(() => {
    if (visible) {
      pushSheet('quick_actions');
      
      // Reset values
      backdropProgress.value = 0;
      fabProgress.value = 0;
      replicaScale.value = 1;
      itemProgress1.value = 0;
      itemProgress2.value = 0;
      itemProgress3.value = 0;

      // Animate in
      backdropProgress.value = withTiming(0.4, { duration: 240 });
      fabProgress.value = withSpring(1, { damping: 15, stiffness: 150 });
      
      // Staggered entry from bottom to top
      itemProgress3.value = withDelay(0, withSpring(1, { damping: 15, stiffness: 120 }));
      itemProgress2.value = withDelay(60, withSpring(1, { damping: 15, stiffness: 120 }));
      itemProgress1.value = withDelay(120, withSpring(1, { damping: 15, stiffness: 120 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, pushSheet]);

  const animateAndClose = useCallback(() => {
    void Haptics.selectionAsync();

    // Animate out
    backdropProgress.value = withTiming(0, { duration: 200 });
    fabProgress.value = withSpring(0, { damping: 15, stiffness: 150 });

    itemProgress1.value = withTiming(0, { duration: 160 });
    itemProgress2.value = withTiming(0, { duration: 160 });
    itemProgress3.value = withTiming(0, { duration: 160 });

    if (onCloseStart) {
      onCloseStart();
    }

    // Close modal and dismiss sheet stack after animations finish
    setTimeout(() => {
      dismissAll();
      onClose();
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, onCloseStart, dismissAll]);

  const handleActionPress = useCallback((action: QuickAction) => {
    if (action.status === 'coming_soon') return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (action.id === 'adjust_budget') {
      animateAndClose();
      // Wait for exit transition, then open the budget sheet modal
      setTimeout(() => {
        pushSheet('adjust_budget');
      }, 200);
    }
  }, [pushSheet, animateAndClose]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropProgress.value,
  }));

  const replicaFabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: replicaScale.value }],
  }));

  const replicaCatStyle = useAnimatedStyle(() => ({
    opacity: interpolate(fabProgress.value, [0, 1], [1, 0]),
    transform: [{ scale: interpolate(fabProgress.value, [0, 1], [1, 0.6]) }],
  }));

  const replicaIconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(fabProgress.value, [0, 1], [0, 45]);
    return {
      opacity: interpolate(fabProgress.value, [0, 1], [0, 1]),
      transform: [
        { scale: interpolate(fabProgress.value, [0, 1], [0.6, 1]) },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const useItemStyle = (progressVal: any) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(progressVal.value, [0, 1], [40, 0]);
      const scale = interpolate(progressVal.value, [0, 1], [0.85, 1]);
      const opacity = interpolate(progressVal.value, [0, 1], [0, 1]);
      return {
        transform: [{ translateY }, { scale }],
        opacity,
      };
    });
  };

  const itemStyle1 = useItemStyle(itemProgress1);
  const itemStyle2 = useItemStyle(itemProgress2);
  const itemStyle3 = useItemStyle(itemProgress3);

  const isBudgetEditOpen = isOpen('adjust_budget');

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={animateAndClose}
      >
        <RNView style={{ flex: 1, backgroundColor: 'transparent' }}>
          {/* Backdrop Touch Target */}
          <Pressable
            className="absolute inset-0"
            onPress={animateAndClose}
            accessibilityLabel="Dismiss quick actions"
          />

          {/* Animated Backdrop Color */}
          <Animated.View
            className="absolute inset-0 bg-[#1c140e]"
            style={backdropAnimatedStyle}
            pointerEvents="none"
          />

          {/* Floating Action Menu Container */}
          <View
            className="absolute left-6 right-6 gap-3 items-center"
            style={{
              bottom: Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8) + 84 + 12,
            }}
          >
            {/* Item 1 (Top) */}
            <Animated.View style={[itemStyle1, { width: '100%', maxWidth: 320 }]}>
              <QuickActionRow action={QUICK_ACTIONS[0]} onPress={handleActionPress} />
            </Animated.View>

            {/* Item 2 (Middle) */}
            <Animated.View style={[itemStyle2, { width: '100%', maxWidth: 320 }]}>
              <QuickActionRow action={QUICK_ACTIONS[1]} onPress={handleActionPress} />
            </Animated.View>

            {/* Item 3 (Bottom) */}
            <Animated.View style={[itemStyle3, { width: '100%', maxWidth: 320 }]}>
              <QuickActionRow action={QUICK_ACTIONS[2]} onPress={handleActionPress} />
            </Animated.View>
          </View>

          {/* Replica FAB */}
          <Pressable
            onPress={animateAndClose}
            onPressIn={handleFabPressIn}
            onPressOut={handleFabPressOut}
            className="absolute items-center justify-center"
            style={{
              bottom: Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8) + 12,
              right: 16,
              minWidth: 56,
              zIndex: 50,
            }}
            accessibilityRole="button"
            accessibilityLabel="Close quick actions"
          >
            <Animated.View
              className="w-14 h-14 rounded-full border border-fg-line/80 bg-fg-cream items-center justify-center shadow-md"
              style={[
                {
                  elevation: 8,
                  borderCurve: 'continuous',
                  boxShadow: '0 8px 32px rgba(41, 28, 18, 0.12)',
                },
                replicaFabStyle,
              ]}
            >
              <Animated.View style={[{ position: 'absolute' }, replicaCatStyle]}>
                <Image
                  source={require('@/assets/images/fg/fg-home-idle.png')}
                  className="w-10 h-10"
                  contentFit="contain"
                />
              </Animated.View>

              <Animated.View style={[{ position: 'absolute' }, replicaIconStyle]}>
                <PlusIcon size={24} color="#ea580c" />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </RNView>
      </Modal>

      {/* Stacked sheet modal for Adjust Budget */}
      <BudgetEditSheet
        visible={isBudgetEditOpen}
        onClose={popSheet}
        onSaveSuccess={onSaveSuccess}
      />
    </>
  );
}
