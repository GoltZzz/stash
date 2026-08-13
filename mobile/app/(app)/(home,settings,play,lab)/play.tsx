import React, { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

import AppScreen from '@/components/ui/app-screen';
import SuccessToast from '@/components/ui/success-toast';
import QuestHero from '@/components/play/quest-hero';
import QuestCard from '@/components/play/quest-card';
import { 
  INITIAL_QUESTS, 
  getLevelConfig, 
  DIALOGUES, 
  Quest 
} from '@/components/play/quest-data';
import { Text, View } from '@/tw';

export default function PlayScreen() {
  // State
  const [totalXP, setTotalXP] = useState<number>(120); // Starts at Level 3: Playful Pawer
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [dialogue, setDialogue] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Derived configurations
  const levelConfig = getLevelConfig(totalXP);

  // Pick initial dialogue
  useEffect(() => {
    const randomWelcome = DIALOGUES.welcome[Math.floor(Math.random() * DIALOGUES.welcome.length)];
    setDialogue(randomWelcome);
  }, []);

  // Handle quest claim
  const handleClaim = useCallback((questId: string) => {
    setQuests((prevQuests) => {
      const updated = prevQuests.map((q) => {
        if (q.id === questId) {
          return { ...q, isClaimed: true };
        }
        return q;
      });

      const claimedQuest = prevQuests.find((q) => q.id === questId);
      if (claimedQuest) {
        const addedXP = claimedQuest.xpReward;
        const newXP = totalXP + addedXP;
        
        // Check for level up
        const oldLevelConfig = getLevelConfig(totalXP);
        const newLevelConfig = getLevelConfig(newXP);
        
        setTotalXP(newXP);

        if (newLevelConfig.level > oldLevelConfig.level) {
          // Level up celebration!
          const randomLevelUpMsg = DIALOGUES.levelUp[Math.floor(Math.random() * DIALOGUES.levelUp.length)];
          setDialogue(randomLevelUpMsg);
          setToastMessage(`🎉 Level Up! Your companion is now a "${newLevelConfig.title}"!`);
        } else {
          // Regular claim reaction
          const randomClaimMsg = DIALOGUES.claimed[Math.floor(Math.random() * DIALOGUES.claimed.length)];
          setDialogue(randomClaimMsg);
          setToastMessage(`Claimed +${addedXP} XP reward! ✨`);
        }
      }
      return updated;
    });
  }, [totalXP]);

  // Handle cat click/meow
  const handleTapCat = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const randomWelcome = DIALOGUES.welcome[Math.floor(Math.random() * DIALOGUES.welcome.length)];
    setDialogue(randomWelcome);
  }, []);

  // Quests grouped by type
  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const weeklyQuests = quests.filter((q) => q.type === 'weekly');

  return (
    <View className="flex-1 bg-fg-cream">
      {toastMessage && (
        <SuccessToast
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
          duration={3000}
        />
      )}

      <AppScreen noTopPadding contentClassName="gap-6 pb-10">
        {/* Top Hero Banner & Cat Status bubble */}
        <QuestHero
          xp={totalXP}
          levelConfig={levelConfig}
          message={dialogue}
          onTapCat={handleTapCat}
        />

        {/* Daily Quests Section */}
        <View className="gap-3 px-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-bold text-fg-orange-deep uppercase tracking-wider">
                Daily Tasks
              </Text>
              <Text
                className="text-lg font-bold text-fg-ink"
                style={{ fontFamily: 'Fraunces_600SemiBold' }}
              >
                Today&apos;s Missions
              </Text>
            </View>
            <View className="bg-fg-orange/10 px-2.5 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-fg-orange-deep uppercase">
                {dailyQuests.filter(q => q.isClaimed).length} / {dailyQuests.length} Done
              </Text>
            </View>
          </View>

          <View className="gap-3">
            {dailyQuests.map((quest, idx) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={handleClaim}
                index={idx}
              />
            ))}
          </View>
        </View>

        {/* Weekly Quests Section */}
        <View className="gap-3 px-6 mt-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                Weekly Bonus
              </Text>
              <Text
                className="text-lg font-bold text-fg-ink"
                style={{ fontFamily: 'Fraunces_600SemiBold' }}
              >
                Special Objectives
              </Text>
            </View>
          </View>

          <View className="gap-3">
            {weeklyQuests.map((quest, idx) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={handleClaim}
                index={dailyQuests.length + idx}
              />
            ))}
          </View>
        </View>

        {/* Daily Progress Overview Footer */}
        <View className="mx-6 p-4 bg-fg-orange-soft/10 border border-fg-line/60 rounded-[24px] items-center" style={{ borderCurve: 'continuous' }}>
          <Text className="text-[10px] font-bold text-fg-ink-2 uppercase tracking-widest">
            Objective Completion
          </Text>
          <Text 
            className="text-base text-fg-ink mt-1"
            style={{ fontFamily: 'Fraunces_600SemiBold' }}
          >
            {quests.filter(q => q.isClaimed).length} of {quests.length} rewards collected
          </Text>
        </View>
      </AppScreen>
    </View>
  );
}
