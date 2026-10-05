import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/context/AppContext';

type Props = {
  /** Cropped women illustration asset */
  source: number;
};

/** Women empowerment illustration pinned to the bottom of auth screens */
export function DesignFooterArt({ source }: Props) {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();
  const height = 190 + Math.max(insets.bottom, 8);

  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <LinearGradient
        colors={[theme.bg, `${theme.bg}CC`, `${theme.bg}00`]}
        style={styles.fade}
      />
      <Image source={source} style={styles.image} contentFit="contain" contentPosition="bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    zIndex: 2,
  },
});
