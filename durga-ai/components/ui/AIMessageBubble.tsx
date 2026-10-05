import { Shield } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChatMessage } from '@/data/mock';
import { AppTheme } from '@/theme';

import { AppText } from './AppText';

type Props = {
  message: ChatMessage;
  theme: AppTheme;
  onAction?: (id: string) => void;
};

export function AIMessageBubble({ message, theme, onAction }: Props) {
  const mine = message.role === 'user';

  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
      {!mine ? (
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Shield size={13} color="#fff" strokeWidth={2.4} />
        </View>
      ) : (
        <View style={styles.avatarSpacer} />
      )}

      <View style={[styles.col, mine ? styles.colMine : styles.colTheirs]}>
        {!mine ? (
          <AppText weight="bold" style={[styles.sender, { color: theme.primary }]}>
            DURGA
          </AppText>
        ) : null}

        <View
          style={[
            styles.bubble,
            mine
              ? { backgroundColor: theme.primary, borderBottomRightRadius: 6 }
              : { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1, borderBottomLeftRadius: 6 },
          ]}>
          <AppText style={[styles.text, { color: mine ? '#fff' : theme.text }]}>{message.text}</AppText>
          <AppText style={[styles.time, { color: mine ? 'rgba(255,255,255,0.7)' : theme.textSecondary }]}>
            {message.time}
          </AppText>
        </View>

        {!mine && message.actions?.length ? (
          <View style={styles.actions}>
            {message.actions.map((action) => {
              const danger = action.variant === 'emergency';
              return (
                <Pressable
                  key={action.id}
                  onPress={() => onAction?.(action.id)}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    {
                      backgroundColor: danger ? theme.highSoft : theme.primarySoft,
                      borderColor: danger ? theme.high : theme.primary,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}>
                  <AppText
                    weight="bold"
                    style={{ color: danger ? theme.high : theme.primary, fontSize: 12, textAlign: 'center' }}
                    numberOfLines={2}>
                    {action.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function TypingBubble({ theme }: { theme: AppTheme }) {
  return (
    <View style={[styles.row, styles.rowTheirs]}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Shield size={13} color="#fff" strokeWidth={2.4} />
      </View>
      <View style={styles.col}>
        <AppText weight="bold" style={[styles.sender, { color: theme.primary }]}>
          DURGA
        </AppText>
        <View style={[styles.bubble, styles.typingBubble, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: theme.textSecondary }]} />
            <View style={[styles.dot, { backgroundColor: theme.textSecondary, opacity: 0.7 }]} />
            <View style={[styles.dot, { backgroundColor: theme.textSecondary, opacity: 0.45 }]} />
          </View>
          <AppText style={{ color: theme.textSecondary, fontSize: 12, marginLeft: 8 }}>thinking…</AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginRight: 8,
  },
  avatarSpacer: {
    width: 0,
  },
  col: {
    flexShrink: 1,
    maxWidth: '78%',
    gap: 6,
  },
  colMine: { alignItems: 'flex-end' },
  colTheirs: { alignItems: 'flex-start', flex: 1, maxWidth: '84%' },
  sender: { fontSize: 11, letterSpacing: 0.5, marginLeft: 2 },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    alignSelf: 'stretch',
  },
  text: { fontSize: 15, lineHeight: 22 },
  time: { fontSize: 11, marginTop: 8, alignSelf: 'flex-end' },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '48%',
    flexGrow: 1,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  dots: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
