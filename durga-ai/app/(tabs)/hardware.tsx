import { router } from 'expo-router';
import { Watch } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Switch, View } from 'react-native';

import { TabIconEnterView } from '@/components/navigation/TabIconEnterView';
import { DeviceStatusCard } from '@/components/ui/DeviceStatusCard';
import { FadeIn } from '@/components/ui/FadeIn';
import { PageHeader, SectionLabel } from '@/components/ui/PageHeader';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { deviceActivity } from '@/data/mock';
import { softShadow } from '@/theme/elevation';

/** Device — cream/maroon theme */
export default function HardwareScreen() {
  const { theme, device, toggleDeviceSetting, setDeviceConnected, startEmergency } = useApp();
  const [confirm, setConfirm] = useState(false);
  const batteryLabel = device.battery > 50 ? 'Good' : device.battery > 20 ? 'Moderate' : 'Low';

  return (
    <TabIconEnterView tab="hardware">
    <Screen theme={theme}>
      <FadeIn>
        <PageHeader
          theme={theme}
          icon={Watch}
          status={device.connected ? 'Connected' : 'Not connected'}
          statusColor={device.connected ? theme.safe : theme.high}
          title="Device"
          subtitle="Your DURGA Safety Device — battery, protections, and activity."
        />
      </FadeIn>

      <FadeIn delay={70}>
        <DeviceStatusCard
          theme={theme}
          connected={device.connected}
          name={device.name}
          battery={device.battery}
          connection={device.connection}
        />
      </FadeIn>

      <FadeIn delay={110}>
        <SectionLabel theme={theme} title="Battery" subtitle={`Status: ${batteryLabel}`} />
        <View style={[styles.card, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.track, { backgroundColor: theme.surfaceMuted }]}>
            <View
              style={[
                styles.fill,
                { width: `${device.battery}%`, backgroundColor: device.battery > 30 ? theme.safe : theme.high },
              ]}
            />
          </View>
          <AppText style={{ color: theme.textSecondary, marginTop: 10, fontSize: 13 }}>
            {device.battery}% remaining
          </AppText>
        </View>
      </FadeIn>

      <FadeIn delay={150}>
        <SectionLabel theme={theme} title="Protections" subtitle="Toggle what the device should watch for" />
        <View style={[styles.card, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <ToggleRow theme={theme} label="SOS Button" value={device.sosButton} onChange={() => toggleDeviceSetting('sosButton')} />
          <ToggleRow theme={theme} label="Fall Detection" value={device.fallDetection} onChange={() => toggleDeviceSetting('fallDetection')} />
          <ToggleRow
            theme={theme}
            label="Location Tracking"
            value={device.locationTracking}
            onChange={() => toggleDeviceSetting('locationTracking')}
          />
          <ToggleRow
            theme={theme}
            label="Emergency Alerts"
            value={device.emergencyAlert}
            onChange={() => toggleDeviceSetting('emergencyAlert')}
            last
          />
        </View>
      </FadeIn>

      <FadeIn delay={190}>
        <SectionLabel theme={theme} title="Device actions" />
        <View style={styles.actions}>
          <Action theme={theme} label="Sync Device" onPress={() => Alert.alert('Synced', 'Location and health data are up to date.')} />
          <Action
            theme={theme}
            label="Locate Device"
            onPress={() => Alert.alert('Device located', 'Last seen near Navrangpura, 40m away.')}
          />
          <Action theme={theme} label="Test SOS" danger onPress={() => setConfirm(true)} />
          <Action
            theme={theme}
            label={device.connected ? 'Disconnect' : 'Connect'}
            onPress={() => setDeviceConnected(!device.connected)}
          />
        </View>
      </FadeIn>

      <FadeIn delay={230}>
        <SectionLabel theme={theme} title="Device activity" subtitle="Recent events from your band" />
        <View style={[styles.card, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border, paddingVertical: 4 }]}>
          {deviceActivity.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.activity,
                index < deviceActivity.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}>
              <AppText weight="semibold" style={{ color: theme.textSecondary, width: 92, fontSize: 12 }}>
                {item.time}
              </AppText>
              <AppText style={{ color: theme.text, flex: 1 }}>✓ {item.title}</AppText>
            </View>
          ))}
        </View>
      </FadeIn>

      <Modal visible={confirm} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modal, softShadow(theme), { backgroundColor: theme.surface }]}>
            <AppText weight="bold" style={{ color: theme.text, fontSize: 18 }}>
              Test SOS?
            </AppText>
            <AppText style={{ color: theme.textSecondary, marginTop: 8, lineHeight: 20 }}>
              This simulates an emergency alert. Trusted contacts will not be notified in test mode.
            </AppText>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
              <Pressable onPress={() => setConfirm(false)} style={[styles.modalBtn, { backgroundColor: theme.surfaceMuted }]}>
                <AppText weight="bold" style={{ color: theme.text }}>
                  Cancel
                </AppText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setConfirm(false);
                  startEmergency();
                  router.push('/emergency');
                }}
                style={[styles.modalBtn, { backgroundColor: theme.high }]}>
                <AppText weight="bold" style={{ color: '#fff' }}>
                  Run test
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
    </TabIconEnterView>
  );
}

function ToggleRow({
  theme,
  label,
  value,
  onChange,
  last,
}: {
  theme: ReturnType<typeof useApp>['theme'];
  label: string;
  value: boolean;
  onChange: () => void;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.border,
      }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <AppText weight="semibold" style={{ color: theme.text }}>
          {label}
        </AppText>
        <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>{value ? 'Enabled' : 'Disabled'}</AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

function Action({
  theme,
  label,
  onPress,
  danger,
}: {
  theme: ReturnType<typeof useApp>['theme'];
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        softShadow(theme),
        {
          backgroundColor: danger ? theme.high : theme.surface,
          borderColor: danger ? theme.high : theme.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <AppText weight="bold" style={{ color: danger ? '#fff' : theme.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 22, padding: 16 },
  track: { height: 12, borderRadius: 8, overflow: 'hidden' },
  fill: { height: 12, borderRadius: 8 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  activity: { flexDirection: 'row', gap: 8, paddingVertical: 12, paddingHorizontal: 4 },
  modalBg: { flex: 1, backgroundColor: 'rgba(15,16,32,0.45)', justifyContent: 'center', padding: 24 },
  modal: { borderRadius: 22, padding: 20 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
});
