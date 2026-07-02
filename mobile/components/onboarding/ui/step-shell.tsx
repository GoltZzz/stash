import type { ReactNode } from 'react';
import { View } from '@/tw';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StepShellProps = {
  children: ReactNode;
  footer: ReactNode;
};

export default function StepShell({ children, footer }: StepShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-fg-cream"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1 justify-between px-6 pb-6 pt-4">
        <View className="flex-1">{children}</View>
        <View className="gap-2">{footer}</View>
      </View>
    </View>
  );
}
