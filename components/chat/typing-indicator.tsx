import { colors, spacing, typography } from '@/lib/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

interface TypingIndicatorProps {
  users: string[];
  isVisible: boolean;
}

export function TypingIndicator({ users, isVisible }: TypingIndicatorProps) {
  if (!isVisible || users.length === 0) return null;

  const text = users.length === 1
    ? `${users[0]} is typing...`
    : `${users.length} people are typing...`;

  return (
    <View style={styles.container}>
      <View style={styles.indicator}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    paddingBottom: 0,
  },
  indicator: {
    flexDirection: 'row',
    marginRight: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.secondary,
    marginHorizontal: 1,
  },
  text: {
    ...typography.caption,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});