import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import type { AppTheme } from '@/theme';

type Props = { theme: AppTheme };

/** Brand splash — logo + name while app finishes loading */
export function BrandSplash({ theme }: Props) {
  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
  }, [fade]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ scale: 0.94 + fade.value * 0.06 }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  return (
    <View style={[styles.fill, { backgroundColor: theme.bg }]}>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <View style={[styles.logoRing, { borderColor: theme.primarySoft }]}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.copy, textStyle]}>
        <AppText weight="serifExtraBold" style={[styles.brand, { color: theme.primary }]}>
          दुर्गा
        </AppText>
        <AppText weight="extraBold" style={[styles.name, { color: theme.text }]}>
          DURGA AI
        </AppText>
        <AppText weight="serif" style={[styles.tag, { color: theme.primary }]}>
          ~ She is Enough
        </AppText>
      </Animated.View>

      <AppText weight="medium" style={[styles.hint, { color: theme.textSecondary }]}>
        Preparing your safety space…
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  logoWrap: { marginBottom: 28 },
  logoRing: {
    width: 112,
    height: 112,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  logo: { width: 96, height: 96 },
  copy: { alignItems: 'center', gap: 6 },
  brand: { fontSize: 44, letterSpacing: 1 },
  name: { fontSize: 20, letterSpacing: 2 },
  tag: { fontSize: 16, fontStyle: 'italic', marginTop: 4 },
  hint: { position: 'absolute', bottom: 56, fontSize: 12 },
});
