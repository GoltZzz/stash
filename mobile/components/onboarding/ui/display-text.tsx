import type { ReactNode } from 'react';
import { Text } from '@/tw';

type DisplayTextProps = {
  children: ReactNode;
  className?: string;
  italic?: boolean;
};

export function DisplayText({
  children,
  className = '',
  italic = false,
}: DisplayTextProps) {
  return (
    <Text
      className={`text-fg-ink ${className}`}
      style={{
        fontFamily: italic ? 'Fraunces_400Regular_Italic' : 'Fraunces_600SemiBold',
      }}>
      {children}
    </Text>
  );
}
