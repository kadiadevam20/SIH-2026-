import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadeIn } from '@/components/ui/FadeIn';
import { AppText } from '@/components/ui/AppText';
import { LivingPulse } from '@/components/ui/LivingPulse';
import { useApp } from '@/context/AppContext';
import { buildFullName } from '@/data/mock';
import { softShadow } from '@/theme/elevation';

export default function AccountDetailsScreen() {
  const { theme, updateUserProfile } = useApp();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Ahmedabad');
  const [state, setState] = useState('Gujarat');
  const [area, setArea] = useState('');

  const phoneDigits = phone.replace(/\D/g, '');
  const canContinue = firstName.trim().length >= 2 && phoneDigits.length >= 10;

  const onContinue = () => {
    if (!canContinue) {
      Alert.alert('Complete your details', 'Please enter your first name and a valid phone number.');
      return;
    }

    updateUserProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: buildFullName(firstName, lastName),
      phone: phone.trim(),
      city: city.trim() || 'Ahmedabad',
      state: state.trim() || 'Gujarat',
      area: area.trim() || `${city.trim()}, ${state.trim()}`,
    });

    router.push('/onboarding/permissions');
  };

  return (
    <View style={styles.fill}>
      <LinearGradient colors={['#DBEAFE', '#EEF4FF', theme.bg]} style={StyleSheet.absoluteFill} />
      <ScrollView
        style={styles.fill}
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <FadeIn>
          <View style={styles.progress}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <View style={[styles.dot, { backgroundColor: theme.border }]} />
            <View style={[styles.dot, { backgroundColor: theme.border }]} />
          </View>
          <View style={styles.statusLine}>
            <LivingPulse color={theme.primary} size={9} />
            <AppText weight="semibold" style={{ color: theme.primary, fontSize: 11 }}>
              Step 2 of 4
            </AppText>
          </View>
          <AppText weight="extraBold" style={[styles.title, { color: theme.text }]}>
            Your account details
          </AppText>
          <AppText style={[styles.lead, { color: theme.textSecondary }]}>
            Tell DURGA who you are so we can personalize your safety experience and emergency alerts.
          </AppText>
        </FadeIn>

        <FadeIn delay={90}>
          <Field theme={theme} label="First name *" value={firstName} onChange={setFirstName} placeholder="Ananya" />
          <Field theme={theme} label="Last name" value={lastName} onChange={setLastName} placeholder="Shah" />
          <Field
            theme={theme}
            label="Phone number *"
            value={phone}
            onChange={setPhone}
            placeholder="+91 98765 43210"
            keyboard="phone-pad"
          />
          <Field theme={theme} label="City" value={city} onChange={setCity} placeholder="Ahmedabad" />
          <Field theme={theme} label="State" value={state} onChange={setState} placeholder="Gujarat" />
          <Field
            theme={theme}
            label="Home area"
            value={area}
            onChange={setArea}
            placeholder="Navrangpura, Ahmedabad"
          />

          <View style={[styles.note, { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}>
            <AppText style={{ color: theme.primary, fontSize: 12, lineHeight: 18 }}>
              Your details stay on this device for the demo. They help DURGA greet you and show the right location on Home.
            </AppText>
          </View>
        </FadeIn>

        <FadeIn delay={160}>
          <Pressable
            onPress={onContinue}
            disabled={!canContinue}
            style={[
              styles.primary,
              softShadow(theme),
              {
                backgroundColor: canContinue ? theme.primary : theme.border,
                opacity: canContinue ? 1 : 0.7,
              },
            ]}>
            <AppText weight="bold" style={{ color: '#fff', fontSize: 16 }}>
              Continue
            </AppText>
          </Pressable>
        </FadeIn>
      </ScrollView>
    </View>
  );
}

function Field({
  theme,
  label,
  value,
  onChange,
  placeholder,
  keyboard,
}: {
  theme: ReturnType<typeof useApp>['theme'];
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboard?: 'phone-pad';
}) {
  return (
    <View style={{ marginTop: 16 }}>
      <AppText weight="semibold" style={{ color: theme.text, marginBottom: 8 }}>
        {label}
      </AppText>
      <View
        style={[
          styles.inputShell,
          softShadow(theme),
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          keyboardType={keyboard}
          style={[styles.input, { color: theme.text }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  progress: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  dot: { width: 28, height: 4, borderRadius: 2 },
  statusLine: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: -4, marginBottom: 8 },
  title: { fontSize: 28 },
  lead: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  note: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  primary: {
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  inputShell: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
});
