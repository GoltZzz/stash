export type QuestType = 'daily' | 'weekly';

export interface Quest {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  type: QuestType;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface LevelConfig {
  level: number;
  title: string;
  minXP: number;
  maxXP: number; // For level 10, maxXP is Infinity
}

export const LEVELS: LevelConfig[] = [
  { level: 1, title: 'Cute Kitten', minXP: 0, maxXP: 50 },
  { level: 2, title: 'Curious Crawler', minXP: 50, maxXP: 120 },
  { level: 3, title: 'Playful Pawer', minXP: 120, maxXP: 220 },
  { level: 4, title: 'Budget Hunter', minXP: 220, maxXP: 350 },
  { level: 5, title: 'Stash Scout', minXP: 350, maxXP: 500 },
  { level: 6, title: 'Silver Purrer', minXP: 500, maxXP: 680 },
  { level: 7, title: 'Gold Vault Guardian', minXP: 680, maxXP: 880 },
  { level: 8, title: 'Diamond Collector', minXP: 880, maxXP: 1100 },
  { level: 9, title: 'Cosmic Companion', minXP: 1100, maxXP: 1350 },
  { level: 10, title: 'Astral Overlord', minXP: 1350, maxXP: Infinity },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'feed-kitty',
    title: 'Feed the Kitty',
    description: 'Log an expense today to keep your companion well fed.',
    emoji: '🐟',
    xpReward: 20,
    type: 'daily',
    isCompleted: true, // Completed and ready to claim
    isClaimed: false,
  },
  {
    id: 'budget-guardian',
    title: 'Budget Guardian',
    description: 'Keep your spending below your daily allowance today.',
    emoji: '🛡️',
    xpReward: 30,
    type: 'daily',
    isCompleted: false, // In-progress
    isClaimed: false,
  },
  {
    id: 'savings-sprint',
    title: 'Savings Sprint',
    description: 'Spend less than 50% of your daily allowance across 3 days.',
    emoji: '⚡',
    xpReward: 75,
    type: 'weekly',
    isCompleted: true, // Completed and ready to claim (bonus)
    isClaimed: false,
  },
];

export function getLevelConfig(xp: number): LevelConfig {
  const current = LEVELS.find((l) => xp >= l.minXP && xp < l.maxXP);
  return current || LEVELS[LEVELS.length - 1];
}

export const DIALOGUES = {
  welcome: [
    'Greetings, human! Complete daily tasks to earn stardust and unlock new titles.',
    'Ready to align the cosmic ledgers? Show me your financial discipline!',
    'A penny saved is a treat earned. What shall we achieve today?',
  ],
  completed: [
    'Oho! A task is completed. Tap it to claim my stardust blessing.',
    'I sense completed cosmic objectives! Tap to claim your stardust.',
    'Excellent discipline! The stardust is waiting to be claimed.',
  ],
  claimed: [
    'Delicious stardust! I feel my cosmic power growing...',
    'Ah, the sweet taste of smart financial decisions!',
    'Synchronization complete. Let us keep this streak alive!',
  ],
  levelUp: [
    'MEOW-GICAL! I have transcended to a new level of cosmic awareness!',
    'Behold! My power grows, and so does my financial trust in you!',
    'A new title! I am now officially more magnificent than before.',
  ],
};
