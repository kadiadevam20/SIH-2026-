import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Phone, Shield, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { EmergencyTimeline } from '@/components/ui/EmergencyTimeline';
import { LivingPulse } from '@/components/ui/LivingPulse';
import { useApp } from '@/context/AppContext';

const native = Platform.OS !== 'web';

/** Full-screen emergency — scrollable with a clear stop control */
export default function EmergencyScreen() {
  const { theme, emergencySteps, stopEmergency, locationSharing, contacts } = useApp();
  const insets = useSafeAreaInsets();
  const [confirm, setConfirm] = useState(false);
  const primary = contacts.find((c) => c.primary);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const endEmergency = () => {
    stopEmergency();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.fill}>
      <LinearGradient colors={['#7F1D1D', '#450A0A', '#1C0508']} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weight="extraBold" style={styles.kicker}>
            EMERGENCY MODE
          </AppText>
          <AppText style={styles.sub}>Help is being coordinated. Scroll for details.</AppText>
        </View>
        <Pressable
          onPress={() => setConfirm(true)}
          style={({ pressed }) => [styles.endChip, { opacity: pressed ? 0.85 : 1 }]}>
          <X size={16} color="#fff" />
          <AppText weight="bold" style={{ color: '#fff', fontSize: 12 }}>
            End
          </AppText>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.sosOrb, { transform: [{ scale: pulse }] }]}>
          <Shield size={28} color="#fff" />
          <AppText weight="extraBold" style={styles.sosLabel}>
            SOS ACTIVE
          </AppText>
          <LivingPulse color="#FCA5A5" size={12} />
        </Animated.View>

        <View style={styles.grid}>
          <Status label="Live location" value={locationSharing ? 'Sharing' : 'Activating'} />
          <Status label="Trusted contacts" value={primary ? `${primary.name} notified` : 'Pending'} />
          <Status label="Police" value="Contacting 112" />
          <Status label="Ambulance" value="Ready · 108" />
        </View>

        <EmergencyTimeline
          theme={{
            ...theme,
            text: '#fff',
            textSecondary: 'rgba(255,255,255,0.7)',
            border: 'rgba(255,255,255,0.2)',
            safeSoft: 'rgba(16,185,129,0.25)',
            moderateSoft: 'rgba(251,191,36,0.2)',
            surfaceMuted: 'rgba(255,255,255,0.08)',
            safe: '#34D399',
            moderate: '#FBBF24',
          }}
          items={emergencySteps}
        />

        <View style={styles.actions}>
          <Big icon={Phone} label="Call Police" onPress={() => Linking.openURL('tel:112')} />
          <Big icon={Phone} label="Call Ambulance" onPress={() => Linking.openURL('tel:108')} />
        </View>

        <Pressable
          onPress={() => setConfirm(true)}
          style={({ pressed }) => [styles.inlineStop, { opacity: pressed ? 0.9 : 1 }]}>
          <AppText weight="bold" style={{ color: '#7F1D1D', fontSize: 16 }}>
            Stop SOS — I'm safe now
          </AppText>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          onPress={() => setConfirm(true)}
          style={({ pressed }) => [styles.footerStop, { opacity: pressed ? 0.92 : 1 }]}>
          <AppText weight="bold" style={{ color: '#7F1D1D', fontSize: 16 }}>
            Stop Emergency Mode
          </AppText>
          <AppText style={{ color: '#991B1B', fontSize: 12, marginTop: 2 }}>
            Tap if you no longer need help
          </AppText>
        </Pressable>
      </View>

      <Modal visible={confirm} transparent animationType="fade" onRequestClose={() => setConfirm(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modal}>
            <AppText weight="bold" style={{ fontSize: 18, color: '#0F1020' }}>
              Stop emergency mode?
            </AppText>
            <AppText style={{ marginTop: 8, color: '#6B6685', lineHeight: 20 }}>
              Contacts will be told that you are safe. Only stop if you no longer need help.
            </AppText>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
              <Pressable onPress={() => setConfirm(false)} style={[styles.modalBtn, { backgroundColor: '#EEEDF7' }]}>
                <AppText weight="bold" style={{ color: '#0F1020' }}>
                  Keep SOS on
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setConfirm(false);
                  endEmergency();
                }}
                style={[styles.modalBtn, { backgroundColor: '#0F1020' }]}>
                <AppText weight="bold" style={{ color: '#fff' }}>
                  Stop SOS
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.status}>
      <AppText style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{label}</AppText>
      <AppText weight="semibold" style={{ color: '#fff', marginTop: 4 }}>
        {value}
      </AppText>
    </View>
  );
}

function Big({ icon: Icon, label, onPress }: { icon: typeof Phone; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.big, { opacity: pressed ? 0.88 : 1 }]}>
      <Icon size={18} color="#fff" />
      <AppText weight="bold" style={{ color: '#fff', fontSize: 13 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  endChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  kicker: { color: '#fff', fontSize: 20, letterSpacing: 0.3 },
  sub: { color: 'rgba(255,255,255,0.78)', marginTop: 4, fontSize: 13 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  sosOrb: {
    marginTop: 8,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(220,38,38,0.55)',
    paddingHorizontal: 28,
    paddingVertical: 22,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,0.45)',
    minWidth: 160,
  },
  sosLabel: { color: '#fff', fontSize: 22, letterSpacing: 1.2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20, marginBottom: 12 },
  status: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8, marginBottom: 16 },
  big: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inlineStop: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'rgba(28,5,8,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  footerStop: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: '#fff', borderRadius: 22, padding: 20 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
});
