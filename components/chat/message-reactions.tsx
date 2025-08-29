import { colors, spacing } from '@/lib/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

interface MessageReactionsProps {
  reactions: { [key: string]: string[] };
  isOwn: boolean;
}

export function MessageReactions({ reactions, isOwn }: MessageReactionsProps) {
  return (
    <View style={[
      styles.container,
      isOwn ? styles.ownContainer : styles.otherContainer
    ]}>
      {Object.entries(reactions).map(([emoji, users]) => (
        <View key={emoji} style={styles.reaction}>
          <Text style={styles.emoji}>{emoji}</Text>
          {users.length > 1 && (
            <Text style={styles.count}>{users.length}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  emoji: {
    fontSize: 14,
  },
  count: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 2,
  },
});