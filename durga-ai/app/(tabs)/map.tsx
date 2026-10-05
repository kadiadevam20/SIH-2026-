import { router } from 'expo-router';
import { Search, ShieldCheck, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SafetyMap } from '@/components/map/SafetyMap';
import { NavigationBottomBar, NavigationTurnHud } from '@/components/map/NavigationHud';
import { UnsafeZoneAlert } from '@/components/map/UnsafeZoneAlert';
import { bottomChromeHeight } from '@/components/navigation/layoutMetrics';
import { TabIconEnterView } from '@/components/navigation/TabIconEnterView';
import { AppText } from '@/components/ui/AppText';
import { RouteCard } from '@/components/ui/RouteCard';
import { SafetyZoneLegend } from '@/components/ui/SafetyZoneLegend';
import { useApp } from '@/context/AppContext';
import { destinations, nearestUnsafeZone, routeOptions, SafetyZone, userLocation } from '@/data/mock';
import { cardShadow, softShadow } from '@/theme/elevation';

export default function MapScreen() {
  const { theme, safetyScore } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [route, setRoute] = useState<'safest' | 'fastest'>('safest');
  const [navigating, setNavigating] = useState(false);
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const results = destinations.filter(
    (d) => d.name.toLowerCase().includes(query.toLowerCase()) || d.address.toLowerCase().includes(query.toLowerCase()),
  );

  const nearestUnsafe = useMemo(
    () => nearestUnsafeZone(userLocation.latitude, userLocation.longitude),
    [],
  );

  const activeZone = selectedZone ?? nearestUnsafe;
  const bottomInset = bottomChromeHeight(true, insets.bottom);
  const pickedPlace = destinations.find((d) => d.name === picked);
  const activeRoute = route === 'safest' ? routeOptions.safest : routeOptions.fastest;

  const clearPick = () => {
    setPicked(null);
    setQuery('');
    setRoute('safest');
    setNavigating(false);
  };

  return (
    <TabIconEnterView tab="map">
      <View style={styles.fill}>
        <SafetyMap
          theme={theme}
          selectedRoute={picked || navigating ? route : null}
          highlightedZoneId={activeZone?.id ?? null}
          onZonePress={(zone) => setSelectedZone(zone)}
        />

        <View style={[styles.top, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
          {navigating ? (
            <NavigationTurnHud
              theme={theme}
              instruction={route === 'safest' ? 'Keep left onto CG Road' : 'Continue on Ashram Road'}
              detail={
                route === 'safest'
                  ? 'Safer path · then straight for 400 m'
                  : 'Faster path · higher risk stretch ahead'
              }
              minutes={activeRoute.minutes}
              eta={`${activeRoute.minutes} min`}
            />
          ) : (
            <>
              <View
                style={[
                  styles.demoChip,
                  softShadow(theme),
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}>
                <AppText weight="semibold" style={{ color: theme.primary, fontSize: 11 }}>
                  Safety zones · Ahmedabad
                </AppText>
              </View>

              <View
                style={[
                  styles.search,
                  softShadow(theme),
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}>
                <Search size={16} color={theme.textSecondary} />
                <TextInput
                  value={query}
                  onChangeText={(v) => {
                    setQuery(v);
                    setPicked(null);
                    setNavigating(false);
                  }}
                  placeholder="Search a place"
                  placeholderTextColor={theme.textSecondary}
                  style={{ flex: 1, color: theme.text, paddingVertical: 8 }}
                />
                {query ? (
                  <Pressable onPress={clearPick}>
                    <X size={16} color={theme.textSecondary} />
                  </Pressable>
                ) : null}
              </View>

              {showLegend ? (
                <View style={styles.legendRow}>
                  <View style={{ flex: 1 }}>
                    <SafetyZoneLegend theme={theme} />
                  </View>
                  <Pressable onPress={() => setShowLegend(false)} style={styles.legendClose}>
                    <X size={14} color={theme.textSecondary} />
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={() => setShowLegend(true)}
                  style={[
                    styles.legendToggle,
                    softShadow(theme),
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}>
                  <AppText weight="semibold" style={{ color: theme.textSecondary, fontSize: 11 }}>
                    Show legend
                  </AppText>
                </Pressable>
              )}
            </>
          )}
        </View>

        {query && !picked && !navigating ? (
          <View
            style={[
              styles.sheet,
              cardShadow(theme, true),
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                bottom: bottomInset,
              },
            ]}>
            <ScrollView style={{ maxHeight: 220 }} keyboardShouldPersistTaps="handled">
              {results.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setPicked(item.name);
                    setQuery(item.name);
                    setRoute('safest');
                  }}
                  style={styles.result}>
                  <AppText weight="semibold" style={{ color: theme.text }}>
                    {item.name}
                  </AppText>
                  <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>{item.address}</AppText>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {picked && !navigating ? (
          <View
            style={[
              styles.sheet,
              cardShadow(theme, true),
              {
                backgroundColor: theme.bgElevated,
                borderColor: theme.border,
                bottom: bottomInset,
              },
            ]}>
            <View style={styles.zoneDetailHeader}>
              <AppText weight="bold" style={{ color: theme.text, fontSize: 18, flex: 1 }}>
                {picked}
              </AppText>
              <Pressable onPress={clearPick}>
                <X size={18} color={theme.textSecondary} />
              </Pressable>
            </View>
            {pickedPlace ? (
              <AppText style={{ color: theme.textSecondary, marginBottom: 4 }}>{pickedPlace.address}</AppText>
            ) : null}

            <View style={[styles.recommendBanner, { backgroundColor: theme.primarySoft }]}>
              <ShieldCheck size={16} color={theme.primary} strokeWidth={2.4} />
              <View style={{ flex: 1 }}>
                <AppText weight="bold" style={{ color: theme.primary, fontSize: 12 }}>
                  Safest route recommended
                </AppText>
                <AppText style={{ color: theme.textSecondary, fontSize: 11, marginTop: 2, lineHeight: 15 }}>
                  Demo pick for Ahmedabad — lower risk, a few minutes longer.
                </AppText>
              </View>
            </View>

            {route === 'fastest' && nearestUnsafe ? (
              <View style={{ marginBottom: 4 }}>
                <UnsafeZoneAlert
                  theme={theme}
                  zone={nearestUnsafe}
                  compact
                  onPress={() => setSelectedZone(nearestUnsafe)}
                />
              </View>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <RouteCard
                theme={theme}
                title={routeOptions.safest.label}
                minutes={routeOptions.safest.minutes}
                risk={routeOptions.safest.risk}
                detail={routeOptions.safest.detail}
                recommended
                selected={route === 'safest'}
                onPress={() => setRoute('safest')}
              />
              <RouteCard
                theme={theme}
                title={routeOptions.fastest.label}
                minutes={routeOptions.fastest.minutes}
                risk={routeOptions.fastest.risk}
                detail={routeOptions.fastest.detail}
                selected={route === 'fastest'}
                onPress={() => setRoute('fastest')}
              />
            </View>

            <Pressable
              onPress={() => setNavigating(true)}
              style={[styles.cta, { backgroundColor: theme.primary }]}>
              <AppText weight="bold" style={{ color: '#fff' }}>
                Start {route === 'safest' ? 'Safest' : 'Fastest'} Route
              </AppText>
            </Pressable>
          </View>
        ) : null}

        {navigating ? (
          <View style={[styles.navBottom, { bottom: bottomInset }]}>
            <NavigationBottomBar
              theme={theme}
              destination={picked}
              safetyScore={safetyScore}
              routeRisk={route === 'safest' ? 'Low' : 'Moderate'}
              riskColor={route === 'safest' ? theme.safe : theme.moderate}
              onEnd={() => {
                setNavigating(false);
                setRoute('safest');
              }}
              onReport={() => router.push('/report')}
            />
          </View>
        ) : null}

        {!navigating && !picked && !(query && !picked) && !selectedZone ? (
          <View style={[styles.alertStack, { bottom: bottomInset }]} pointerEvents="box-none">
            {activeZone ? (
              <UnsafeZoneAlert
                theme={theme}
                zone={activeZone}
                onPress={() => setSelectedZone(activeZone)}
                onAvoid={() => {
                  setPicked('Alpha One Mall');
                  setQuery('Alpha One Mall');
                  setRoute('safest');
                }}
              />
            ) : null}
            <Pressable
              onPress={() => router.push('/report')}
              style={[
                styles.report,
                softShadow(theme),
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}>
              <AppText weight="bold" style={{ color: theme.text }}>
                Report Unsafe Area
              </AppText>
            </Pressable>
          </View>
        ) : null}

        {selectedZone && !picked && !navigating ? (
          <View
            style={[
              styles.zoneDetail,
              cardShadow(theme, true),
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                bottom: bottomInset,
              },
            ]}>
            <View style={styles.zoneDetailHeader}>
              <AppText weight="bold" style={{ color: theme.text, fontSize: 16 }}>
                Zone details
              </AppText>
              <Pressable onPress={() => setSelectedZone(null)}>
                <X size={18} color={theme.textSecondary} />
              </Pressable>
            </View>
            <UnsafeZoneAlert
              theme={theme}
              zone={selectedZone}
              onAvoid={() => {
                setSelectedZone(null);
                setPicked('Alpha One Mall');
                setQuery('Alpha One Mall');
                setRoute('safest');
              }}
            />
          </View>
        ) : null}
      </View>
    </TabIconEnterView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  top: { position: 'absolute', left: 16, right: 16, gap: 10, zIndex: 2 },
  demoChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendClose: { padding: 8 },
  legendToggle: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    borderRadius: 26,
    borderWidth: 1,
    padding: 18,
    gap: 10,
    zIndex: 3,
  },
  recommendBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  result: { paddingVertical: 10 },
  cta: {
    marginTop: 4,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 15,
  },
  navBottom: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 4,
  },
  alertStack: {
    position: 'absolute',
    left: 12,
    right: 12,
    gap: 10,
    zIndex: 2,
  },
  report: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  zoneDetail: {
    position: 'absolute',
    left: 12,
    right: 12,
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    zIndex: 4,
  },
  zoneDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});
