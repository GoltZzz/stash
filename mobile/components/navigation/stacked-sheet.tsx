/* eslint-disable react-hooks/immutability */
import React, { useCallback } from 'react';
import { Modal, KeyboardAvoidingView, Platform, View as RNView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LinearTransition,
  useReducedMotion,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Pressable, Text, View } from '@/tw';
import { Animated } from '@/tw/animated';

interface StackedSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function StackedSheet({ visible, onClose, title, children }: StackedSheetProps) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const translateY = useSharedValue(0);

  const handleClose = useCallback(() => {
    void Haptics.selectionAsync();
    onClose();
  }, [onClose]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150 || event.velocityY > 500) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 140 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <RNView style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <Pressable
          className="absolute inset-0"
          onPress={handleClose}
          accessibilityLabel={`Dismiss ${title}`}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
          style={{ justifyContent: 'flex-end', height: '90%' }}
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View
              layout={reducedMotion ? undefined : LinearTransition.springify().damping(20).stiffness(140)}
              className="w-full bg-fg-cream rounded-t-[32px] border-t border-x border-fg-line/80 px-6 pt-5 gap-4 relative overflow-hidden flex-col shadow-2xl h-full"
              style={[
                {
                  borderCurve: 'continuous',
                  paddingBottom: Math.max(24, insets.bottom),
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: -8 },
                  shadowOpacity: 0.15,
                  shadowRadius: 16,
                  elevation: 12,
                },
                animatedStyle,
              ]}
            >
              {/* Grab handle */}
              <View className="w-12 h-1.5 bg-fg-line/60 rounded-full self-center mb-1" />

              {/* Decorative whisker elements */}
              <View
                pointerEvents="none"
                className="absolute top-14 left-5 w-10 h-[1.5px] bg-fg-ink/10 rounded-full"
                style={{ transform: [{ rotate: '-8deg' }] }}
              />
              <View
                pointerEvents="none"
                className="absolute top-16 right-5 w-8 h-[1.5px] bg-fg-ink/10 rounded-full"
                style={{ transform: [{ rotate: '6deg' }] }}
              />

              {/* Header */}
              <View className="flex-row items-center justify-between pb-2 border-b border-fg-line/40">
                <Text
                  className="text-xl font-bold text-fg-ink"
                  style={{ fontFamily: 'Fraunces_600SemiBold' }}
                >
                  {title}
                </Text>

                <Pressable
                  onPress={handleClose}
                  className="px-3 py-1.5 bg-fg-orange-soft/80 rounded-full active:scale-[0.95]"
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                >
                  <Text className="text-xs font-semibold text-fg-ink">Cancel</Text>
                </Pressable>
              </View>

              {/* Body */}
              <View className="flex-1">
                {children}
              </View>
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      </RNView>
    </Modal>
  );
}
