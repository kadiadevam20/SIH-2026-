import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, Platform, ViewStyle } from 'react-native';

type Props = {
  children: ReactNode;
  delay?: number;
  style?: ViewStyle;
};

export function FadeIn({ children, delay = 0, style }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const native = Platform.OS !== 'web';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: native,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 520,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: native,
      }),
    ]).start();
  }, [delay, native, opacity, translateY]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}
