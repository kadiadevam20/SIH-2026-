import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';

const AnimatedView = Animated.View;

const RIBBONS = [
  { top: '22%', delay: 0, dur: 10000, color: 'rgba(122,29,29,0.18)', amp: 14 },
  { top: '48%', delay: 700, dur: 13000, color: 'rgba(201,162,39,0.16)', amp: 18 },
  { top: '70%', delay: 1400, dur: 15000, color: 'rgba(161,63,60,0.14)', amp: 10 },
] as const;

const GLYPHS = [
  { ch: 'श', top: '10%', left: '8%', delay: 0, size: 28 },
  { ch: 'क्', top: '16%', left: '78%', delay: 400, size: 22 },
  { ch: 'ति', top: '72%', left: '12%', delay: 900, size: 24 },
  { ch: 'दु', top: '68%', left: '76%', delay: 1200, size: 26 },
] as const;

function Ribbon({
  top,
  delay,
  dur,
  color,
  amp,
  active,
}: {
  top: string;
  delay: number;
  dur: number;
  color: string;
  amp: number;
  active: boolean;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!active) {
      cancelAnimation(t);
      return;
    }
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: dur, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    return () => cancelAnimation(t);
  }, [active, delay, dur, t]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(t.value, [0, 1], [-amp, amp]) },
      { rotate: `${interpolate(t.value, [0, 1], [-6, 6])}deg` },
    ],
    opacity: interpolate(t.value, [0, 0.5, 1], [0.55, 0.9, 0.55]),
  }));

  return <AnimatedView style={[styles.ribbon, { top, backgroundColor: color }, style]} />;
}

function Glyph({
  ch,
  top,
  left,
  delay,
  size,
  maroon,
  active,
}: {
  ch: string;
  top: string;
  left: string;
  delay: number;
  size: number;
  maroon: string;
  active: boolean;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!active) {
      cancelAnimation(t);
      return;
    }
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    return () => cancelAnimation(t);
  }, [active, delay, t]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 0.5, 1], [0.08, 0.16, 0.08]),
    transform: [{ translateY: interpolate(t.value, [0, 1], [0, -8]) }],
  }));

  return (
    <AnimatedView style={[styles.glyph, { top, left }, style]}>
      <AppText weight="serifExtraBold" style={{ fontSize: size, color: maroon }}>
        {ch}
      </AppText>
    </AnimatedView>
  );
}

/** Soft animated quote stage — runs only while Home is focused. */
function QuoteBackdropInner({ maroon, active = true }: { maroon: string; active?: boolean }) {
  const glow = useSharedValue(0);
  const spin = useSharedValue(0);
  const blobA = useSharedValue(0);
  const blobB = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      cancelAnimation(glow);
      cancelAnimation(spin);
      cancelAnimation(blobA);
      cancelAnimation(blobB);
      return;
    }
    glow.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    spin.value = withRepeat(
      withTiming(1, { duration: 48000, easing: Easing.linear }),
      -1,
      false,
    );
    blobA.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    blobB.value = withDelay(
      900,
      withRepeat(withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    return () => {
      cancelAnimation(glow);
      cancelAnimation(spin);
      cancelAnimation(blobA);
      cancelAnimation(blobB);
    };
  }, [active, blobA, blobB, glow, spin]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.1 + glow.value * 0.14,
    transform: [{ scale: 0.92 + glow.value * 0.12 }],
  }));

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));

  const blobAStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(blobA.value, [0, 1], [0, 16]) },
      { translateY: interpolate(blobA.value, [0, 1], [0, 12]) },
    ],
  }));

  const blobBStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(blobB.value, [0, 1], [0, -14]) },
      { translateY: interpolate(blobB.value, [0, 1], [0, -10]) },
    ],
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#FBF6F0', '#F0DDD6', '#E5C8BE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedView style={[styles.blob, styles.blobTL, { backgroundColor: maroon }, blobAStyle]} />
      <AnimatedView style={[styles.blob, styles.blobBR, { backgroundColor: '#C9A227' }, blobBStyle]} />
      <View style={[styles.blob, styles.blobC, { backgroundColor: '#A13F3C' }]} />

      {RIBBONS.map((r) => (
        <Ribbon key={r.top} {...r} active={active} />
      ))}

      <AnimatedView style={[styles.pulseGlow, { backgroundColor: maroon }, glowStyle]} />

      <AnimatedView style={[styles.constellation, spinStyle]}>
        <Svg width="100%" height="100%" viewBox="0 0 300 300">
          <Circle cx="150" cy="150" r="70" stroke={maroon} strokeWidth="1" fill="none" opacity={0.22} />
          <Circle
            cx="150"
            cy="150"
            r="108"
            stroke="#C9A227"
            strokeWidth="0.9"
            strokeDasharray="4 9"
            fill="none"
            opacity={0.26}
          />
          <Path
            d="M80 120 L150 60 L220 120 L200 200 L100 200 Z"
            stroke={maroon}
            strokeWidth="1"
            fill="none"
            opacity={0.2}
          />
          <Circle cx="150" cy="60" r="3" fill="#C9A227" opacity={0.5} />
          <Circle cx="220" cy="120" r="3" fill={maroon} opacity={0.5} />
          <Circle cx="200" cy="200" r="3" fill="#C9A227" opacity={0.5} />
          <Circle cx="100" cy="200" r="3" fill={maroon} opacity={0.5} />
          <Circle cx="80" cy="120" r="3" fill="#C9A227" opacity={0.5} />
          <Circle cx="150" cy="150" r="4" fill={maroon} opacity={0.45} />
        </Svg>
      </AnimatedView>

      {GLYPHS.map((g) => (
        <Glyph key={g.ch} {...g} maroon={maroon} active={active} />
      ))}

      <LinearGradient
        colors={['rgba(251,246,240,0.25)', 'rgba(251,246,240,0.72)', 'rgba(251,246,240,0.28)']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export const QuoteBackdrop = memo(QuoteBackdropInner);

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.14,
  },
  blobTL: { width: 180, height: 180, top: -55, left: -45 },
  blobBR: { width: 160, height: 160, bottom: -50, right: -40, opacity: 0.11 },
  blobC: { width: 100, height: 100, top: '40%', right: '20%', opacity: 0.08 },
  ribbon: {
    position: 'absolute',
    left: '-10%',
    width: '120%',
    height: 28,
    borderRadius: 16,
  },
  pulseGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: '30%',
    alignSelf: 'center',
    left: '28%',
  },
  constellation: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.95,
  },
  glyph: {
    position: 'absolute',
  },
});
