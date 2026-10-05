import { Pressable, StyleSheet, View } from 'react-native';
import { AlertTriangle, ShieldAlert } from 'lucide-react-native';

import { safetyZones, SafetyZone } from '@/data/mock';
import { AppTheme } from '@/theme';

import { AppText } from '../ui/AppText';

type Props = {
  theme: AppTheme;
  highlightedZoneId?: string | null;
  selectedRoute?: 'safest' | 'fastest' | null;
  onZonePress?: (zone: SafetyZone) => void;
};

function zoneColor(level: string, theme: AppTheme) {
  if (level === 'safe') return theme.safe;
  if (level === 'moderate') return theme.moderate;
  return theme.high;
}

function zoneFill(level: string, theme: AppTheme) {
  if (level === 'safe') return `${theme.safe}30`;
  if (level === 'moderate') return `${theme.moderate}45`;
  return `${theme.high}50`;
}

function Pulse({ color }: { color: string }) {
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: `${color}33` }} />
      <View style={{ position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
    </View>
  );
}

export function SafetyMap({ theme, highlightedZoneId, selectedRoute, onZonePress }: Props) {
  const showRoute = selectedRoute === 'safest' || selectedRoute === 'fastest';
  const safest = selectedRoute === 'safest';

  return (
    <View style={[styles.canvas, { backgroundColor: '#E8E4F8' }]}>
      <View style={styles.roads} pointerEvents="none">
        <View style={[styles.roadH, { top: '34%', backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.roadH, { top: '58%', backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.roadH, { top: '76%', backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.roadV, { left: '28%', backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.roadV, { left: '52%', backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.roadV, { left: '72%', backgroundColor: '#FFFFFF' }]} />
        <View style={[styles.roadDiag, { backgroundColor: '#FFFFFF' }]} />
      </View>

      {showRoute ? (
        <View
          pointerEvents="none"
          style={[
            styles.routeLine,
            {
              backgroundColor: safest ? theme.safe : theme.moderate,
              top: safest ? '28%' : '48%',
              left: safest ? '40%' : '46%',
              height: safest ? '38%' : '28%',
              transform: [{ rotate: safest ? '18deg' : '-12deg' }],
            },
          ]}
        />
      ) : null}

      {safetyZones.map((zone) => {
        const color = zoneColor(zone.level, theme);
        const isAlert = zone.level === 'high' || zone.level === 'moderate';
        const highlighted = highlightedZoneId === zone.id;
        const Icon = zone.level === 'high' ? ShieldAlert : AlertTriangle;

        return (
          <Pressable
            key={zone.id}
            onPress={() => onZonePress?.(zone)}
            style={[
              styles.zone,
              {
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
                backgroundColor: zoneFill(zone.level, theme),
                borderColor: color,
                borderWidth: zone.level === 'high' ? 2 : 1,
              },
            ]}>
            {isAlert && highlighted ? <Pulse color={color} /> : null}
            <View style={styles.zoneLabelRow}>
              {isAlert ? <Icon size={12} color={color} strokeWidth={2.4} /> : null}
              <AppText weight="bold" style={{ color, fontSize: 11 }}>
                {zone.label}
              </AppText>
            </View>
            {isAlert ? (
              <AppText style={{ color: theme.textSecondary, fontSize: 9, marginTop: 2 }}>
                {zone.level === 'high' ? 'Not safe' : 'Use caution'}
              </AppText>
            ) : null}
          </Pressable>
        );
      })}

      <View style={[styles.user, { backgroundColor: theme.primary, borderColor: '#fff' }]}>
        <View style={styles.userCore} />
      </View>

      <View style={[styles.mapBadge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <AppText weight="semibold" style={{ color: theme.textSecondary, fontSize: 10 }}>
          Ahmedabad safety map
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  roads: { ...StyleSheet.absoluteFillObject },
  roadH: { position: 'absolute', left: 0, right: 0, height: 10, opacity: 0.95 },
  roadV: { position: 'absolute', top: 0, bottom: 0, width: 10, opacity: 0.95 },
  roadDiag: {
    position: 'absolute',
    left: '18%',
    top: '30%',
    width: 8,
    height: '42%',
    borderRadius: 4,
    transform: [{ rotate: '24deg' }],
    opacity: 0.9,
  },
  zone: {
    position: 'absolute',
    borderRadius: 24,
    padding: 10,
    justifyContent: 'center',
  },
  zoneLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  user: {
    position: 'absolute',
    left: '46%',
    top: '42%',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  userCore: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  routeLine: {
    position: 'absolute',
    width: 8,
    borderRadius: 8,
    opacity: 0.9,
    zIndex: 15,
  },
  mapBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
