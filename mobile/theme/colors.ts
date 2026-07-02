import { Platform, PlatformColor, type ColorValue } from 'react-native';

function color(ios: string, android: string, fallback: string): ColorValue {
  if (Platform.OS === 'ios') {
    return PlatformColor(ios);
  }
  if (Platform.OS === 'android') {
    return PlatformColor(android);
  }
  return fallback;
}

export const colors = {
  label: color('label', '?android:attr/textColorPrimary', '#000000'),
  secondaryLabel: color(
    'secondaryLabel',
    '?android:attr/textColorSecondary',
    '#3c3c43',
  ),
  separator: color('separator', '?android:attr/listDivider', '#c6c6c8'),
  systemBackground: color(
    'systemBackground',
    '?android:attr/colorBackground',
    '#ffffff',
  ),
  systemBlue: color('systemBlue', '?android:attr/colorAccent', '#007aff'),
};
