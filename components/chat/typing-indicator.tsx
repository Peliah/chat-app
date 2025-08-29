import { colors, spacing, typography } from '@/lib/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

interface TypingIndicatorProps {
  usersTyping: string[];
}

export function TypingIndicator({ usersTyping }: TypingIndicatorProps) {
  if (usersTyping.length === 0) return null;

  const getTypingText = () => {
    if (usersTyping.length === 1) {
      return `${usersTyping[0]} is typing...`;
    }
    if (usersTyping.length === 2) {
      return `${usersTyping[0]} and ${usersTyping[1]} are typing...`;
    }
    return `${usersTyping.length} people are typing...`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.indicatorBubble}>
        <Text style={styles.typingText}>{getTypingText()}</Text>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  indicatorBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  typingText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.secondary,
    marginHorizontal: 1,
  },
  dot1: {
    opacity: 0.4,
    transform: [{ scale: 0.8 }],
  },
  dot2: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
  dot3: {
    opacity: 0.8,
  },
});