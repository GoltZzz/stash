import type { StyleProp, ViewStyle } from 'react-native';

import { View } from '@/tw';

type CatTabIconProps = {
  name: 'home' | 'settings';
  selected: boolean;
  style?: StyleProp<ViewStyle>;
};

const ORANGE = 'rgb(234, 88, 12)';
const INK = 'rgb(41, 28, 18)';
const INK_2 = 'rgb(120, 98, 82)';

function PawIcon({ color }: { color: string }) {
  return (
    <View className="items-center justify-center" style={{ width: 26, height: 26 }}>
      {/* Main pad */}
      <View
        className="rounded-full"
        style={{ width: 12, height: 10, backgroundColor: color, marginTop: 8 }}
      />
      {/* Toe beans */}
      <View className="absolute flex-row gap-0.5" style={{ top: 2 }}>
        <View className="rounded-full" style={{ width: 5, height: 6, backgroundColor: color }} />
        <View className="rounded-full" style={{ width: 5, height: 6, backgroundColor: color, marginTop: -2 }} />
        <View className="rounded-full" style={{ width: 5, height: 6, backgroundColor: color }} />
      </View>
    </View>
  );
}

function WhiskersIcon({ color }: { color: string }) {
  return (
    <View className="items-center justify-center" style={{ width: 26, height: 26 }}>
      {/* Cat head silhouette */}
      <View
        className="rounded-full"
        style={{ width: 16, height: 14, backgroundColor: color }}
      />
      {/* Ears */}
      <View
        className="absolute rounded-sm"
        style={{
          width: 6,
          height: 6,
          backgroundColor: color,
          top: 3,
          left: 4,
          transform: [{ rotate: '-28deg' }],
        }}
      />
      <View
        className="absolute rounded-sm"
        style={{
          width: 6,
          height: 6,
          backgroundColor: color,
          top: 3,
          right: 4,
          transform: [{ rotate: '28deg' }],
        }}
      />
      {/* Whiskers */}
      <View
        className="absolute rounded-full bg-fg-line"
        style={{ width: 8, height: 1.5, left: -1, top: 14, transform: [{ rotate: '-8deg' }] }}
      />
      <View
        className="absolute rounded-full bg-fg-line"
        style={{ width: 8, height: 1.5, right: -1, top: 14, transform: [{ rotate: '8deg' }] }}
      />
    </View>
  );
}

export default function CatTabIcon({ name, selected, style }: CatTabIconProps) {
  const color = selected ? ORANGE : INK_2;

  return (
    <View style={style}>
      {name === 'home' ? <PawIcon color={color} /> : <WhiskersIcon color={selected ? ORANGE : INK} />}
    </View>
  );
}
