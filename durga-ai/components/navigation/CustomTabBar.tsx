import { Contact, Home, Map, MessageCircle, Watch } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { softShadow } from '@/theme/elevation';

import { TAB_BAR_GAP, TAB_BAR_HEIGHT, TAB_BAR_TOTAL_HEIGHT } from './layoutMetrics';
import { ANIMATED_TABS, hasTabExit, runTabExit } from './tabIconTransition';
import { SOSBar } from './SOSBar';

export { TAB_BAR_TOTAL_HEIGHT };

const TABS = [
  { name: 'index', label: 'Home', Icon: Home },
  { name: 'map', label: 'Map', Icon: Map },
  { name: 'durga', label: 'DURGA', Icon: MessageCircle },
  { name: 'contacts', label: 'Contacts', Icon: Contact },
  { name: 'hardware', label: 'Device', Icon: Watch },
] as const;

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

export function CustomTabBar({ state, navigation }: TabBarProps) {
  const { theme } = useApp();
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index]?.name;
  const leaving = useRef(false);

  const go = (name: string) => {
    if (name === active || leaving.current) return;

    // Leave animated tab → shrink into its icon, then switch
    if (ANIMATED_TABS.has(active) && hasTabExit(active)) {
      leaving.current = true;
      runTabExit(active, () => {
        leaving.current = false;
        navigation.navigate(name);
      });
      return;
    }

    navigation.navigate(name);
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <SOSBar theme={theme} style={{ marginBottom: TAB_BAR_GAP }} />
      <View
        style={[
          styles.bar,
          softShadow(theme),
          {
            backgroundColor: theme.bgElevated,
            borderColor: theme.border,
            minHeight: TAB_BAR_HEIGHT,
          },
        ]}>
        {TABS.map((tab) => {
          const focused = active === tab.name;
          const color = focused ? theme.primary : '#A89888';
          const Icon = tab.Icon;
          return (
            <Pressable
              key={tab.name}
              onPress={() => go(tab.name)}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}>
              <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 1.9} />
              <AppText weight={focused ? 'bold' : 'medium'} style={{ color, fontSize: 10 }}>
                {tab.label}
              </AppText>
              <View style={[styles.dot, { backgroundColor: focused ? theme.primary : 'transparent' }]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
