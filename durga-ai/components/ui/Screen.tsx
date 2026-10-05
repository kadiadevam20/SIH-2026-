import { usePathname } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bottomChromeHeight, isOnTabs } from '@/components/navigation/layoutMetrics';
import { SOSBar } from '@/components/navigation/SOSBar';
import { AppTheme } from '@/theme';

import { AmbientBackground } from './AmbientBackground';

type Props = {
  theme: AppTheme;
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  padded?: boolean;
};

function shouldHideSos(pathname: string | null) {
  return !pathname || pathname === '/' || pathname.includes('onboarding') || pathname.includes('emergency');
}

export function Screen({ theme, children, scroll = true, style, padded = true }: Props) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const onTabs = isOnTabs(pathname);
  const showStackSos = !onTabs && !shouldHideSos(pathname);
  const bottomPad = bottomChromeHeight(onTabs, insets.bottom);

  const content = (
    <View style={[{ paddingTop: insets.top + 12, paddingBottom: bottomPad, paddingHorizontal: padded ? 20 : 0 }, style]}>
      {children}
    </View>
  );

  return (
    <View style={styles.fill}>
      <AmbientBackground theme={theme} />
      {scroll ? (
        <ScrollView style={styles.fill} contentContainerStyle={{ paddingBottom: bottomPad + 8 }} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {showStackSos ? (
        <View style={[styles.sosDock, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <SOSBar theme={theme} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  sosDock: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 0,
  },
});
