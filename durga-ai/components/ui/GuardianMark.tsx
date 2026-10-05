import { Shield } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

import { AppText } from '../ui/AppText';

export function GuardianMark({ theme, compact }: { theme: AppTheme; compact?: boolean }) {
  const breathe = useRef(new Animated.Value(1)).current;
  const native = Platform.OS !== 'web';

  useEffect(() => {
    if (compact) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.05,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: native,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: native,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breathe, compact, native]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale: compact ? 1 : breathe }] }}>
        <View style={[styles.halo, { backgroundColor: theme.primarySoft }, compact && styles.haloSm]}>
          <View style={[styles.glow, { backgroundColor: `${theme.primary}22` }, compact && styles.glowSm]} />
          <View style={[styles.orb, { backgroundColor: theme.primary }, compact && styles.orbSm]}>
            <Shield size={compact ? 18 : 28} color="#fff" strokeWidth={2.2} />
          </View>
        </View>
      </Animated.View>
      {!compact ? (
        <AppText weight="extraBold" style={[styles.word, { color: theme.text }]}>
          DURGA AI
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 12 },
  halo: {
    padding: 14,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloSm: { padding: 4, borderRadius: 18 },
  glow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 999,
  },
  glowSm: { width: 44, height: 44 },
  orb: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbSm: { width: 40, height: 40, borderRadius: 14 },
  word: { fontSize: 30, letterSpacing: 0.4 },
});
