import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Mic, Send, Shield } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientBackground } from '@/components/ui/AmbientBackground';
import { AIMessageBubble, TypingBubble } from '@/components/ui/AIMessageBubble';
import { AppText } from '@/components/ui/AppText';
import { useApp } from '@/context/AppContext';
import { ChatMessage, quickPrompts } from '@/data/mock';
import { bottomChromeHeight } from '@/components/navigation/layoutMetrics';
import { TabIconEnterView } from '@/components/navigation/TabIconEnterView';
import { softShadow } from '@/theme/elevation';

/** DURGA chat — clean guardian messenger layout */
export default function DurgaScreen() {
  const {
    theme,
    messages,
    isTyping,
    sendMessage,
    startEmergency,
    setLocationSharing,
  } = useApp();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const list = useRef<FlatList<ChatMessage>>(null);
  const canSend = text.trim().length > 0 && !isTyping;

  useEffect(() => {
    const t = setTimeout(() => list.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(t);
  }, [messages, isTyping]);

  const onAction = (id: string) => {
    if (id === 'sos' || id === 'call' || id === 'alert') {
      startEmergency();
      router.push('/emergency');
    } else if (id === 'share' || id === 'share-all') {
      setLocationSharing(true);
    } else if (id === 'nav-police' || id === 'help') {
      router.push('/nearby-help');
    } else if (id === 'safe-place' || id === 'safest' || id === 'fastest') {
      router.push('/(tabs)/map');
    }
  };

  const submit = (value?: string) => {
    const next = (value ?? text).trim();
    if (!next || isTyping) return;
    sendMessage(next);
    setText('');
  };

  const bottomPad = bottomChromeHeight(true, insets.bottom);

  return (
    <TabIconEnterView tab="durga" style={{ backgroundColor: theme.bg }}>
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <AmbientBackground theme={theme} />

      <View style={[styles.safeTop, { paddingTop: insets.top + 6 }]}>
        <View style={[styles.header, softShadow(theme), { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <LinearGradient colors={[theme.primary, '#A13F3C']} style={styles.mark}>
            <Shield size={18} color="#fff" strokeWidth={2.3} />
          </LinearGradient>
          <View style={styles.headerCopy}>
            <AppText weight="extraBold" style={{ color: theme.text, fontSize: 18 }} numberOfLines={1}>
              DURGA AI
            </AppText>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: theme.safe }]} />
              <AppText style={{ color: theme.safe, fontSize: 12 }} numberOfLines={1}>
                {isTyping ? 'Responding…' : 'Safety monitoring active'}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}>
        <FlatList
          ref={list}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => <AIMessageBubble message={item} theme={theme} onAction={onAction} />}
          ListFooterComponent={isTyping ? <TypingBubble theme={theme} /> : <View style={{ height: 12 }} />}
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
        />

        <View style={[styles.dock, { paddingBottom: bottomPad, borderTopColor: theme.border, backgroundColor: theme.bg }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.prompts}>
            {quickPrompts.map((item) => (
              <Pressable
                key={item}
                onPress={() => submit(item)}
                disabled={isTyping}
                style={[
                  styles.prompt,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    opacity: isTyping ? 0.55 : 1,
                  },
                ]}>
                <AppText weight="semibold" style={{ color: theme.primary, fontSize: 12 }} numberOfLines={1}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.composer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable
              onPress={() => Alert.alert('Voice', 'Voice input is mocked in this demo. Tap a prompt or type instead.')}
              style={[styles.mic, { backgroundColor: theme.primary }]}
              accessibilityLabel="Voice input">
              <Mic size={18} color="#fff" />
            </Pressable>

            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Tell DURGA how you feel…"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
              multiline
              maxLength={500}
              editable={!isTyping}
              onSubmitEditing={() => submit()}
              blurOnSubmit={false}
              textAlignVertical="center"
            />

            <Pressable
              onPress={() => submit()}
              disabled={!canSend}
              style={[styles.send, { backgroundColor: canSend ? theme.primary : theme.surfaceMuted }]}
              accessibilityLabel="Send message">
              <Send size={16} color={canSend ? '#fff' : theme.textSecondary} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
    </TabIconEnterView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1, minHeight: 0 },
  safeTop: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, minWidth: 0 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  list: { flex: 1, minHeight: 0 },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
    flexGrow: 1,
  },
  dock: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  prompts: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  prompt: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 220,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 22,
    padding: 8,
    minHeight: 56,
  },
  mic: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 100,
    minHeight: 40,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 4,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
