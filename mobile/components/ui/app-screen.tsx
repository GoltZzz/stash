import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScrollView } from '@/tw';

// Cat tab bar: pill (~56pt) + pt-2 (8pt) + icon/label stack (~44pt min-h-11)
const TAB_BAR_ESTIMATED_HEIGHT = 76;

type AppScreenProps = {
  children: ReactNode;
  contentClassName?: string;
};

export default function AppScreen({ children, contentClassName }: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8);
  const bottomPad = TAB_BAR_ESTIMATED_HEIGHT + bottomInset + 16;

  return (
    <ScrollView
      className="flex-1 bg-fg-cream"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName={contentClassName ? `gap-6 px-6 ${contentClassName}` : 'gap-6 px-6'}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: bottomPad,
      }}>
      {children}
    </ScrollView>
  );
}
