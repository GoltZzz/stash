import React from 'react';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { Text, View, Pressable } from '@/tw';
import { Quest } from './quest-data';
import { StarIcon, CheckCircleIcon } from '@/components/home/cat-icons';

interface QuestCardProps {
  quest: Quest;
  onClaim: (questId: string) => void;
  index: number;
}

export default function QuestCard({ quest, onClaim, index }: QuestCardProps) {
  const { id, title, description, emoji, xpReward, type, isCompleted, isClaimed } = quest;
  
  // Claim button bounce scale
  const scale = useSharedValue(1);

  const handleClaim = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withSpring(1.1, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    onClaim(id);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Card opacity and background styling based on state
  let bgStyle = 'bg-fg-orange-soft/20 border-fg-line';
  let cardOpacity = 'opacity-100';

  if (isClaimed) {
    bgStyle = 'bg-fg-cream border-fg-line/50';
    cardOpacity = 'opacity-50';
  } else if (isCompleted) {
    bgStyle = 'bg-fg-orange-soft/45 border-fg-orange/30';
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 100).duration(500)}
      className={`rounded-[24px] border-[0.5px] p-4 flex-row items-center gap-4 ${bgStyle} ${cardOpacity} relative`}
      style={{ borderCurve: 'continuous', boxShadow: isCompleted && !isClaimed ? '0 4px 12px rgba(234, 88, 12, 0.08)' : 'none' }}
    >
      {/* Type Badge at top right */}
      <View className="absolute top-3 right-4 flex-row items-center gap-1">
        <View className={`px-2 py-0.5 rounded-full ${type === 'weekly' ? 'bg-purple-100 border border-purple-200' : 'bg-fg-orange-soft border border-fg-line/50'}`}>
          <Text className={`text-[8px] font-black uppercase tracking-wider ${type === 'weekly' ? 'text-purple-700' : 'text-fg-orange-deep'}`}>
            {type}
          </Text>
        </View>
      </View>

      {/* Emoji Circle */}
      <View className="w-12 h-12 rounded-full items-center justify-center bg-fg-cream border border-fg-line shadow-sm" style={{ borderCurve: 'continuous' }}>
        <Text className="text-2xl">{emoji}</Text>
      </View>

      {/* Title / Description / Reward Details */}
      <View className="flex-1 pr-1">
        <Text
          className={`text-base text-fg-ink ${isClaimed ? 'line-through opacity-60' : ''}`}
          style={{ fontFamily: 'Fraunces_600SemiBold' }}
        >
          {title}
        </Text>
        <Text className="text-xs font-medium text-fg-ink-2 mt-1 leading-relaxed" numberOfLines={2}>
          {description}
        </Text>

        {/* XP Reward Chip */}
        {!isClaimed && (
          <View className="flex-row items-center gap-1 mt-2 bg-fg-orange/10 border border-fg-orange/15 px-2 py-0.5 rounded-full self-start">
            <StarIcon size={10} color="#ea580c" />
            <Text className="text-[9px] font-black text-fg-orange-deep tracking-wider">
              +{xpReward} XP
            </Text>
          </View>
        )}
      </View>

      {/* Right Column: Status / Claim CTA */}
      <View className="items-end justify-center min-w-[70px]">
        {isClaimed ? (
          <View className="flex-row items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-full">
            <CheckCircleIcon size={12} color="#22c55e" />
            <Text className="text-[9px] font-black text-green-700 uppercase tracking-widest">Claimed</Text>
          </View>
        ) : isCompleted ? (
          <Animated.View style={animatedStyle}>
            <Pressable
              onPress={handleClaim}
              className="bg-fg-orange border border-fg-orange-deep px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow-sm"
              style={{ borderCurve: 'continuous', boxShadow: '0 2px 6px rgba(234, 88, 12, 0.2)' }}
            >
              <Text className="text-[10px] font-black text-fg-cream uppercase tracking-widest">Claim</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <View className="px-2.5 py-1.5 bg-fg-cream/60 border border-fg-line/60 rounded-full">
            <Text className="text-[9px] font-bold text-fg-ink-2 uppercase tracking-wider">Active</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
