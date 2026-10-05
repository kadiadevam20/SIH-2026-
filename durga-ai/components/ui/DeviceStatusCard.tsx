import { Bluetooth, Watch } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { AppTheme } from '@/theme';
import { softShadow } from '@/theme/elevation';

import { AppText } from './AppText';
import { LivingPulse } from './LivingPulse';

type Props = {
  theme: AppTheme;
  connected: boolean;
  name: string;
  battery: number;
  connection: string;
};

/** Device status card — cream/maroon theme */
export function DeviceStatusCard({ theme, connected, name, battery, connection }: Props) {
  return (
    <View style={[styles.wrap, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <LinearGradient
        colors={connected ? [theme.primary, '#A13F3C'] : ['#A89888', '#8A8075']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.watchOrb}>
            <Watch size={28} color="#fff" />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={styles.statusRow}>
              <LivingPulse color={connected ? '#A7F3D0' : '#FCA5A5'} size={10} />
              <AppText weight="bold" style={{ color: '#fff', fontSize: 13 }}>
                {connected ? 'CONNECTED' : 'DISCONNECTED'}
              </AppText>
            </View>
            <AppText weight="extraBold" style={styles.name} numberOfLines={1}>
              {name}
            </AppText>
          </View>
        </View>
        <View style={styles.metaChip}>
          <Bluetooth size={13} color="#fff" />
          <AppText style={{ color: 'rgba(255,255,255,0.92)', fontSize: 12 }}>
            {connection} · Battery {battery}%
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  hero: {
    padding: 18,
    gap: 14,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  watchOrb: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: -4 },
  name: { color: '#fff', fontSize: 20, marginTop: 2 },
  metaChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
});
