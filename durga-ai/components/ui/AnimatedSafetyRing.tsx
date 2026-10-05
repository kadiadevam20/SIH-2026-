import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Stop } from 'react-native-svg';

import { AppTheme } from '@/theme';

import { AppText } from './AppText';

type Props = {
  theme: AppTheme;
  score: number;
  accent: string;
  size?: number;
};

export function AnimatedSafetyRing({ theme, score, accent, size = 148 }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(1)).current;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [dashOffset, setDashOffset] = useState(circumference);
  const useNativeDriver = Platform.OS !== 'web';

  useEffect(() => {
    const id = progress.addListener(({ value }) => {
      setDashOffset(circumference * (1 - value));
    });
    Animated.timing(progress, {
      toValue: Math.max(0, Math.min(100, score)) / 100,
      duration: 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => progress.removeListener(id);
  }, [circumference, progress, score]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.06,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breathe, useNativeDriver]);

  return (
    <Animated.View style={[styles.wrap, { width: size, height: size, transform: [{ scale: breathe }] }]}>
      <View style={[styles.glow, { backgroundColor: `${accent}22`, width: size * 0.78, height: size * 0.78 }]} />
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={accent} />
            <Stop offset="100%" stopColor={theme.primary} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.surfaceMuted}
          strokeWidth={stroke}
          fill="none"
        />
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#ringGrad)"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.center}>
        <AppText weight="extraBold" style={[styles.score, { color: theme.text }]}>
          {score}
        </AppText>
        <AppText style={[styles.sub, { color: theme.textSecondary }]}>Safety</AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    borderRadius: 999,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: { fontSize: 36, lineHeight: 40 },
  sub: { fontSize: 12, marginTop: -2 },
});
