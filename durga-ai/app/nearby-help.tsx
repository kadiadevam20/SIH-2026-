import { router } from 'expo-router';
import { MapPinned } from 'lucide-react-native';
import { Alert, Linking, StyleSheet, View } from 'react-native';

import { FadeIn } from '@/components/ui/FadeIn';
import { NearbyHelpCard } from '@/components/ui/NearbyHelpCard';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { SafetyMap } from '@/components/map/SafetyMap';
import { UnsafeZoneAlert } from '@/components/map/UnsafeZoneAlert';
import { useApp } from '@/context/AppContext';
import { nearestUnsafeZone, nearbyPlaces, userLocation } from '@/data/mock';
import { softShadow } from '@/theme/elevation';

export default function NearbyHelpScreen() {
  const { theme } = useApp();
  const nearestUnsafe = nearestUnsafeZone(userLocation.latitude, userLocation.longitude);

  return (
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={MapPinned}
          status="Nearby & open"
          title="Nearby Help"
          subtitle="Police, hospitals, pharmacies, and safe places around you."
          onBack={() => router.back()}
        />
      </FadeIn>

      <FadeIn delay={60}>
        <View style={[styles.mapPreview, softShadow(theme), { borderColor: theme.border }]}>
          <SafetyMap theme={theme} highlightedZoneId={nearestUnsafe?.id ?? null} />
        </View>
        {nearestUnsafe ? (
          <View style={{ marginTop: 10 }}>
            <UnsafeZoneAlert
              theme={theme}
              zone={nearestUnsafe}
              compact
              onPress={() => router.push('/(tabs)/map')}
            />
          </View>
        ) : null}
      </FadeIn>

      <FadeIn delay={100}>
        <SectionLabel theme={theme} title="Places near you" subtitle="Open the map or call in one tap" />
        <View style={styles.list}>
          {nearbyPlaces.map((place) => (
            <NearbyHelpCard
              key={place.id}
              place={place}
              theme={theme}
              onNavigate={() => {
                router.replace('/(tabs)/map');
              }}
              onCall={() => {
                if (!place.phone) {
                  Alert.alert('No phone', 'This place has no phone number on file.');
                  return;
                }
                Linking.openURL(`tel:${place.phone.replace(/\s/g, '')}`);
              }}
            />
          ))}
        </View>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    height: 220,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 4,
  },
  list: { gap: 12 },
});
