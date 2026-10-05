import { router, useFocusEffect } from 'expo-router';
import {
  BookOpen,
  MapPinned,
  Menu,
  MessageCircle,
  Navigation,
  Shield,
  Users,
  Watch,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bottomChromeHeight } from '@/components/navigation/layoutMetrics';
import { AppText } from '@/components/ui/AppText';
import { QuoteBackdrop } from '@/components/ui/QuoteBackdrop';
import { useApp } from '@/context/AppContext';

const QUOTES = [
  'A girl with a voice can change the world.',
  'She is not just a girl — she is strength, courage, and fire.',
  'Girls are not meant to be quiet. They are meant to lead.',
  'Every girl deserves to walk free, speak loud, and dream big.',
  'Her power is not borrowed — it was always hers.',
  'Raise her, don’t restrict her. She will rise anyway.',
  'A brave girl is a light for every girl who comes after her.',
  'She doesn’t wait for permission. She creates her own path.',
  'Strong girls build safer worlds.',
  'Be the girl who never dims her light for anyone.',
] as const;

const SAFETY_TIPS = [
  'Share your live route when traveling alone at night.',
  'Keep your trusted circle updated — even one guardian helps.',
  'If something feels wrong, trust it. DURGA is one hold away.',
  'Safe spots on the map are marked for you — learn a few nearby.',
  'Test your SOS once, so muscle memory is ready when it matters.',
] as const;

/** Home — scrollable quote stage + safety content */
export default function HomeScreen() {
  const { theme, contacts, userName, locationSharing, device, setLocationSharing } = useApp();
  const insets = useSafeAreaInsets();
  const [homeFocused, setHomeFocused] = useState(true);
  const maroon = theme.primary;
  const bottomPad = bottomChromeHeight(true, insets.bottom);
  const [index, setIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const nextQuote = useCallback(() => {
    setIndex((i) => (i + 1) % QUOTES.length);
  }, []);

  // Only tick timers while Home is focused — saves battery/CPU on other tabs
  useFocusEffect(
    useCallback(() => {
      setHomeFocused(true);
      const q = setInterval(nextQuote, 9000);
      const t = setInterval(() => setTipIndex((i) => (i + 1) % SAFETY_TIPS.length), 12000);
      return () => {
        setHomeFocused(false);
        clearInterval(q);
        clearInterval(t);
      };
    }, [nextQuote]),
  );

  const circle = contacts.slice(0, 4);
  const extra = Math.max(0, contacts.length - 4);
  const greeting = userName !== 'there' ? `Hi, ${userName}` : 'Welcome';

  return (
    <View style={[styles.fill, { backgroundColor: theme.bg, paddingTop: insets.top + 6 }]}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <AppText weight="serifExtraBold" style={[styles.devanagari, { color: maroon }]}>
            दुर्गा
          </AppText>
          <AppText weight="serif" style={[styles.tag, { color: maroon }]}>
            ~ She is Enough
          </AppText>
        </View>
        <Pressable onPress={() => router.push('/settings')} style={styles.menuBtn} hitSlop={12}>
          <Menu size={26} color="#8A8075" strokeWidth={1.6} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 12 }]}
        bounces>
        <AppText weight="semibold" style={[styles.greeting, { color: theme.textSecondary }]}>
          {greeting}
        </AppText>
        <AppText weight="serifBold" style={[styles.greetingTitle, { color: theme.text }]}>
          Your safety space
        </AppText>

        {/* Tall quote stage */}
        <Pressable
          style={[styles.quoteCard, { borderColor: 'rgba(122,29,29,0.14)' }]}
          onPress={nextQuote}
          accessibilityLabel="Next quote">
          <QuoteBackdrop maroon={maroon} active={homeFocused} />
          <View style={styles.quoteContent}>
            <AppText weight="serif" style={[styles.mark, { color: maroon }]}>
              “
            </AppText>
            <Animated.View
              key={index}
              entering={FadeIn.duration(420)}
              exiting={FadeOut.duration(220)}
              style={styles.quoteBlock}>
              <AppText weight="serifMedium" style={[styles.quoteText, { color: theme.text }]}>
                {QUOTES[index]}
              </AppText>
            </Animated.View>
          </View>
        </Pressable>

        {/* Status */}
        <View style={[styles.statusRow, { backgroundColor: theme.primarySoft }]}>
          <View style={[styles.shieldCore, { backgroundColor: maroon }]}>
            <Shield size={16} color="#FFF8F2" strokeWidth={2.4} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText weight="semibold" style={{ color: theme.text, fontSize: 14 }}>
              {userName !== 'there' ? `${userName}, you’re covered` : 'You’re covered'}
            </AppText>
            <AppText weight="medium" style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
              DURGA is watching with you
            </AppText>
          </View>
        </View>

        {/* Safety circle */}
        <Pressable
          onPress={() => router.push('/(tabs)/contacts')}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: theme.bgElevated,
              borderColor: theme.border,
              opacity: pressed ? 0.92 : 1,
            },
          ]}>
          <View style={styles.cardHeader}>
            <Users size={16} color={maroon} strokeWidth={2.2} />
            <AppText weight="bold" style={{ color: theme.text, fontSize: 14, flex: 1 }}>
              Your safety circle
            </AppText>
            <AppText weight="medium" style={{ color: theme.textSecondary, fontSize: 12 }}>
              {contacts.length} ready
            </AppText>
          </View>
          <View style={styles.avatars}>
            {circle.length === 0 ? (
              <AppText weight="medium" style={{ color: theme.textSecondary, fontSize: 13 }}>
                Add trusted contacts so help reaches faster
              </AppText>
            ) : (
              <>
                {circle.map((c, i) => (
                  <View
                    key={c.id}
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: c.color || maroon,
                        marginLeft: i === 0 ? 0 : -10,
                        zIndex: circle.length - i,
                      },
                    ]}>
                    <AppText weight="bold" style={styles.avatarText}>
                      {c.initials}
                    </AppText>
                  </View>
                ))}
                {extra > 0 ? (
                  <View style={[styles.avatar, styles.avatarMore, { marginLeft: -10 }]}>
                    <AppText weight="bold" style={{ color: maroon, fontSize: 11 }}>
                      +{extra}
                    </AppText>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </Pressable>

        {/* Quick tools */}
        <AppText weight="bold" style={[styles.sectionLabel, { color: theme.text }]}>
          Quick tools
        </AppText>
        <View style={styles.toolsRow}>
          <Tool
            label="Safety map"
            Icon={MapPinned}
            color={maroon}
            soft={theme.primarySoft}
            border={theme.border}
            onPress={() => router.push('/(tabs)/map')}
          />
          <Tool
            label="Instructions"
            Icon={BookOpen}
            color={maroon}
            soft={theme.primarySoft}
            border={theme.border}
            onPress={() => router.push('/settings/tutorials')}
          />
          <Tool
            label="Nearby help"
            Icon={Navigation}
            color={maroon}
            soft={theme.primarySoft}
            border={theme.border}
            onPress={() => router.push('/nearby-help')}
          />
        </View>

        {/* Location sharing */}
        <Pressable
          onPress={() => setLocationSharing(!locationSharing)}
          style={[
            styles.card,
            {
              backgroundColor: locationSharing ? theme.primarySoft : theme.bgElevated,
              borderColor: locationSharing ? maroon : theme.border,
            },
          ]}>
          <View style={styles.cardHeader}>
            <Navigation size={16} color={maroon} strokeWidth={2.2} />
            <View style={{ flex: 1 }}>
              <AppText weight="bold" style={{ color: theme.text, fontSize: 14 }}>
                Live location sharing
              </AppText>
              <AppText weight="medium" style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                {locationSharing ? 'On — trusted contacts can follow you' : 'Off — tap to share with your circle'}
              </AppText>
            </View>
            <View
              style={[
                styles.pill,
                { backgroundColor: locationSharing ? maroon : theme.surfaceMuted },
              ]}>
              <AppText weight="bold" style={{ color: locationSharing ? '#FFF8F2' : theme.textSecondary, fontSize: 11 }}>
                {locationSharing ? 'ON' : 'OFF'}
              </AppText>
            </View>
          </View>
        </Pressable>

        {/* Device strip */}
        <Pressable
          onPress={() => router.push('/(tabs)/hardware')}
          style={[styles.card, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Watch size={16} color={maroon} strokeWidth={2.2} />
            <View style={{ flex: 1 }}>
              <AppText weight="bold" style={{ color: theme.text, fontSize: 14 }}>
                {device.name}
              </AppText>
              <AppText weight="medium" style={{ color: theme.textSecondary, fontSize: 12, marginTop: 2 }}>
                {device.connected ? `Connected · ${device.battery}% battery` : 'Not connected · tap to manage'}
              </AppText>
            </View>
            <View
              style={[
                styles.dotStatus,
                { backgroundColor: device.connected ? theme.safe : theme.moderate },
              ]}
            />
          </View>
        </Pressable>

        {/* Tip of the moment */}
        <View style={[styles.tipCard, { backgroundColor: theme.primarySoft, borderColor: 'rgba(122,29,29,0.12)' }]}>
          <AppText weight="bold" style={{ color: maroon, fontSize: 12, letterSpacing: 0.4 }}>
            SAFETY TIP
          </AppText>
          <View key={tipIndex}>
            <AppText weight="medium" style={{ color: theme.text, fontSize: 14, lineHeight: 21, marginTop: 6 }}>
              {SAFETY_TIPS[tipIndex]}
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/(tabs)/durga')}
          style={({ pressed }) => [styles.askBtn, { backgroundColor: maroon, opacity: pressed ? 0.9 : 1 }]}>
          <MessageCircle size={18} color="#FFF8F2" strokeWidth={2.2} />
          <AppText weight="bold" style={{ color: '#FFF8F2', fontSize: 15 }}>
            Talk to DURGA
          </AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Tool({
  label,
  Icon,
  color,
  soft,
  border,
  onPress,
}: {
  label: string;
  Icon: typeof MapPinned;
  color: string;
  soft: string;
  border: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tool,
        { backgroundColor: soft, borderColor: border, opacity: pressed ? 0.88 : 1 },
      ]}>
      <Icon size={20} color={color} strokeWidth={2.2} />
      <AppText weight="semibold" style={{ color, fontSize: 12, textAlign: 'center' }}>
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
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexWrap: 'wrap',
    flex: 1,
    paddingRight: 8,
  },
  devanagari: { fontSize: 40, letterSpacing: 0.5 },
  tag: { fontSize: 17, fontStyle: 'italic' },
  menuBtn: { padding: 6, marginTop: 6 },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  greeting: { fontSize: 13, marginLeft: 2 },
  greetingTitle: { fontSize: 22, marginTop: -4, marginBottom: 4, marginLeft: 2 },
  quoteCard: {
    height: 360,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
  },
  quoteContent: {
    flex: 1,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 24,
  },
  mark: {
    fontSize: 48,
    lineHeight: 48,
    marginBottom: -8,
    opacity: 0.3,
  },
  quoteBlock: { width: '100%' },
  quoteText: {
    fontSize: 22,
    lineHeight: 32,
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  shieldCore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 34,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F5F1E8',
  },
  avatarMore: { backgroundColor: '#F3E4E0' },
  avatarText: { color: '#FFF8F2', fontSize: 10 },
  sectionLabel: { fontSize: 15, marginTop: 4, marginLeft: 2 },
  toolsRow: { flexDirection: 'row', gap: 10 },
  tool: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dotStatus: { width: 10, height: 10, borderRadius: 5 },
  tipCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  askBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 2,
  },
});
