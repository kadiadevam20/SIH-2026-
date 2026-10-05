import { Shield } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';

type Props = {
  theme: AppTheme;
  size?: number;
};

export function WelcomeAura({ theme, size = 168 }: Props) {
  const ringA = useRef(new Animated.Value(0)).current;
  const ringB = useRef(new Animated.Value(0)).current;
  const ringC = useRef(new Animated.Value(0)).current;
  const core = useRef(new Animated.Value(1)).current;
  const native = Platform.OS !== 'web';

  useEffect(() => {
    const makeRing = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 2400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: native,
          }),
          Animated.timing(value, { toValue: 0, duration: 0, useNativeDriver: native }),
        ])
      );

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(core, {
          toValue: 1.06,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: native,
        }),
        Animated.timing(core, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: native,
        }),
      ])
    );

    const a = makeRing(ringA, 0);
    const b = makeRing(ringB, 800);
    const c = makeRing(ringC, 1600);
    a.start();
    b.start();
    c.start();
    breathe.start();
    return () => {
      a.stop();
      b.stop();
      c.stop();
      breathe.stop();
    };
  }, [core, native, ringA, ringB, ringC]);

  const ringStyle = (value: Animated.Value) => ({
    opacity: value.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
    transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.55] }) }],
  });

  return (
    <View style={{ width: size * 1.7, height: size * 1.7, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: theme.primary,
          },
          ringStyle(ringA),
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: '#60A5FA',
          },
          ringStyle(ringB),
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: '#93C5FD',
          },
          ringStyle(ringC),
        ]}
      />
      <Animated.View style={{ transform: [{ scale: core }] }}>
        <View style={[styles.halo, { backgroundColor: 'rgba(255,255,255,0.35)' }]}>
          <View style={[styles.orb, { width: size * 0.52, height: size * 0.52, backgroundColor: theme.primary }]}>
            <Shield size={size * 0.22} color="#fff" strokeWidth={2.2} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  halo: {
    padding: 18,
    borderRadius: 999,
  },
  orb: {
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
