import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, type ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { registerTabExit, TAB_ICON_INDEX } from './tabIconTransition';

type Props = {
  tab: keyof typeof TAB_ICON_INDEX | string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Smooth rise from navbar — no full-screen scale (that caused Map lag) */
export function TabIconEnterView({ tab, children, style }: Props) {
  const progress = useSharedValue(1);

  useEffect(() => {
    registerTabExit(tab, (done) => {
      cancelAnimation(progress);
      progress.value = withTiming(
        0,
        { duration: 260, easing: Easing.in(Easing.cubic) },
        () => runOnJS(done)(),
      );
    });
    return () => {
      registerTabExit(tab, null);
      cancelAnimation(progress);
    };
  }, [progress, tab]);

  useFocusEffect(
    useCallback(() => {
      cancelAnimation(progress);
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 340,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      return () => cancelAnimation(progress);
    }, [progress]),
  );

  const animStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: interpolate(p, [0, 1], [0.4, 1]),
      transform: [{ translateY: interpolate(p, [0, 1], [36, 0]) }],
    };
  });

  return <Animated.View style={[styles.fill, animStyle, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
