import { Link as RouterLink } from 'expo-router';
import { useCssElement, useUnstableNativeVariable as useFunctionalVariable } from 'react-native-css';
import React from 'react';
import {
  ScrollView as RNScrollView,
  TouchableHighlight as RNTouchableHighlight,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

export { View, Text, Pressable, TextInput } from 'react-native-css/components';

export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  },
) => {
  return useCssElement(RNScrollView, props, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
  });
};
ScrollView.displayName = 'CSS(ScrollView)';

export const Link = (
  props: React.ComponentProps<typeof RouterLink> & { className?: string },
) => {
  return useCssElement(RouterLink, props, { className: 'style' });
};

Link.Trigger = RouterLink.Trigger;
Link.Menu = RouterLink.Menu;
Link.MenuAction = RouterLink.MenuAction;
Link.Preview = RouterLink.Preview;

export const useCSSVariable =
  process.env.EXPO_OS !== 'web'
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

function XXTouchableHighlight(
  props: React.ComponentProps<typeof RNTouchableHighlight>,
) {
  const flattened = StyleSheet.flatten(props.style) as ViewStyle & {
    underlayColor?: string;
  };
  const { underlayColor, ...style } = flattened || {};
  return (
    <RNTouchableHighlight
      underlayColor={underlayColor}
      {...props}
      style={style}
    />
  );
}

export const TouchableHighlight = (
  props: React.ComponentProps<typeof RNTouchableHighlight> & { className?: string },
) => {
  return useCssElement(XXTouchableHighlight, props, { className: 'style' });
};
TouchableHighlight.displayName = 'CSS(TouchableHighlight)';

export const AnimatedScrollView = (
  props: React.ComponentProps<typeof Animated.ScrollView> & {
    className?: string;
    contentClassName?: string;
    contentContainerClassName?: string;
  },
) => {
  // @ts-expect-error react-native-css nightly typing depth
  return useCssElement(Animated.ScrollView, props, {
    className: 'style',
    contentClassName: 'contentContainerStyle',
    contentContainerClassName: 'contentContainerStyle',
  });
};
