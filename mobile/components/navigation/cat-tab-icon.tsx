import { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';

import { View } from '@/tw';
import { Image } from '@/tw/image';

type CatTabIconProps = {
  name: 'home' | 'settings';
  selected: boolean;
  style?: StyleProp<ViewStyle>;
};

const CatHomeIconImage = require('@/assets/images/fg/fg-home-idle.png');

const ORANGE = 'rgb(234, 88, 12)';
const INK = 'rgb(41, 28, 18)';

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
  const jumpY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (name === 'home' && selected && !reducedMotion) {
      jumpY.value = 0;
      scaleX.value = 1;
      scaleY.value = 1;

      scaleY.value = withSequence(
        withTiming(0.94, { duration: 30 }),
        withTiming(1.04, { duration: 50 }),
        withSpring(1, { damping: 9, stiffness: 125 })
      );
      scaleX.value = withSequence(
        withTiming(1.06, { duration: 30 }),
        withTiming(0.96, { duration: 50 }),
        withSpring(1, { damping: 9, stiffness: 125 })
      );

      jumpY.value = withSequence(
        withTiming(-5, { duration: 70, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 80, easing: Easing.bounce })
      );
    }
  }, [selected, reducedMotion, name, jumpY, scaleX, scaleY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: jumpY.value },
        { scaleX: scaleX.value },
        { scaleY: scaleY.value },
      ],
    };
  });

  return (
    <View style={[style, { opacity: selected ? 1 : 0.4 }]}>
      {name === 'home' ? (
        <Animated.View style={animatedStyle}>
          <Image
            source={CatHomeIconImage}
            className="w-8 h-8"
            contentFit="contain"
          />
        </Animated.View>
      ) : (
        <WhiskersIcon color={selected ? ORANGE : INK} />
      )}
    </View>
  );
}
