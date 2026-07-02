import type { StyleProp, ViewStyle } from 'react-native';

import { View } from '@/tw';

type ScratchEdgeProps = {
  side?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
};

const SCRATCHES = [
  { top: 4, rotate: '-32deg', width: 14 },
  { top: 10, rotate: '-18deg', width: 10 },
  { top: 16, rotate: '-40deg', width: 12 },
] as const;

export default function ScratchEdge({ side = 'left', style }: ScratchEdgeProps) {
  const isLeft = side === 'left';

  return (
    <View
      pointerEvents="none"
      className="absolute inset-y-0 w-5"
      style={[
        isLeft ? { left: -2 } : { right: -2 },
        style,
      ]}>
      {SCRATCHES.map((scratch, index) => (
        <View
          key={index}
          className="absolute rounded-full bg-fg-ink/25"
          style={{
            top: scratch.top,
            width: scratch.width,
            height: 2,
            ...(isLeft ? { left: 0 } : { right: 0 }),
            transform: [{ rotate: isLeft ? scratch.rotate : scratch.rotate.replace('-', '') }],
          }}
        />
      ))}
    </View>
  );
}
