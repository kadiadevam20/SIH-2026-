import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { mapCenter, safetyZones, userLocation, SafetyZone } from '@/data/mock';
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
  if (level === 'safe') return `${theme.safe}28`;
  if (level === 'moderate') return `${theme.moderate}40`;
  return `${theme.high}45`;
}

function PulseRing({ color }: { color: string }) {
  return (
    <View style={[styles.pulse, { borderColor: color, opacity: 0.45 }]} />
  );
}

function ZoneMarker({
  zone,
  theme,
  highlighted,
}: {
  zone: SafetyZone;
  theme: AppTheme;
  highlighted: boolean;
}) {
  const color = zoneColor(zone.level, theme);
  const isAlert = zone.level === 'high' || zone.level === 'moderate';

  return (
    <View style={styles.markerWrap}>
      {isAlert && highlighted ? <PulseRing color={color} /> : null}
      <View
        style={[
          styles.zonePin,
          {
            backgroundColor: isAlert ? color : theme.surface,
            borderColor: color,
            transform: [{ scale: highlighted ? 1.08 : 1 }],
          },
        ]}>
        <AppText weight="bold" style={{ color: isAlert ? '#fff' : color, fontSize: 9 }}>
          {zone.level === 'high' ? '!' : zone.level === 'moderate' ? '⚠' : '✓'}
        </AppText>
      </View>
    </View>
  );
}

export function SafetyMap({ theme, highlightedZoneId, selectedRoute: _selectedRoute, onZonePress }: Props) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      initialRegion={mapCenter}
      mapPadding={{ top: 120, right: 16, bottom: 180, left: 16 }}
      customMapStyle={theme.mode === 'dark' ? darkMap : lightMap}
      showsUserLocation={false}
      showsCompass={false}
      showsPointsOfInterest={false}>
      {safetyZones.map((zone) => (
        <Circle
          key={`circle-${zone.id}`}
          center={{ latitude: zone.latitude, longitude: zone.longitude }}
          radius={zone.radius}
          fillColor={zoneFill(zone.level, theme)}
          strokeColor={zoneColor(zone.level, theme)}
          strokeWidth={zone.level === 'high' ? 2 : 1.5}
          zIndex={zone.level === 'high' ? 3 : zone.level === 'moderate' ? 2 : 1}
        />
      ))}

      {safetyZones
        .filter((z) => z.level !== 'safe')
        .map((zone) => (
          <Marker
            key={`marker-${zone.id}`}
            coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
            title={zone.label}
            description={zone.reason ?? zone.alert}
            onPress={() => onZonePress?.(zone)}
            zIndex={zone.level === 'high' ? 10 : 5}>
            <ZoneMarker zone={zone} theme={theme} highlighted={highlightedZoneId === zone.id} />
          </Marker>
        ))}

      <Marker coordinate={userLocation} title="You" description="Current location" zIndex={20}>
        <View style={[styles.you, { borderColor: '#fff', backgroundColor: theme.primary }]}>
          <View style={[styles.youCore, { backgroundColor: '#fff' }]} />
        </View>
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  you: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youCore: { width: 6, height: 6, borderRadius: 3 },
  markerWrap: { alignItems: 'center', justifyContent: 'center', width: 44, height: 44 },
  pulse: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
  },
  zonePin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const lightMap = [
  { elementType: 'geometry', stylers: [{ color: '#F3F0FF' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4C1D95' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'water', stylers: [{ color: '#C4D8FF' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#DDD6FE' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#EDE9FE' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const darkMap = [
  { elementType: 'geometry', stylers: [{ color: '#12182C' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#C4B5FD' }] },
  { featureType: 'water', stylers: [{ color: '#1E293B' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1F2937' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];
