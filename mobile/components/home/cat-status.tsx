import CatSprite from '@/components/home/cat-sprite';
import { Text, View } from '@/tw';

type CatStatusProps = {
  message: string;
  size?: number;
};

export default function CatStatus({ message, size = 72 }: CatStatusProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-3xl border border-fg-line/60 bg-fg-orange-soft p-4">
      <View className="shrink-0">
        <CatSprite size={size} />
      </View>
      <Text
        className="flex-1 text-base leading-relaxed text-fg-ink"
        style={{ fontFamily: 'Fraunces_400Regular_Italic' }}>
        {message}
      </Text>
    </View>
  );
}
