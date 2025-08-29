import { colors, spacing, typography } from '@/lib/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

interface MessageItemProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
      username?: string;
      email?: string;
      avatar_url?: string;
    };
  };
  isOwn: boolean;
}

export function MessageItem({ message, isOwn }: MessageItemProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDisplayName = () => {
    if (isOwn) return 'You';
    return message.profiles?.username || message.profiles?.email?.split('@')[0] || 'Unknown';
  };

  return (
    <View style={[
      styles.container,
      isOwn ? styles.ownContainer : styles.otherContainer
    ]}>
      {!isOwn && (
        <Text style={styles.senderName}>{getDisplayName()}</Text>
      )}
      
      <View style={[
        styles.messageBubble,
        isOwn ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={[
          styles.messageText,
          isOwn ? styles.ownText : styles.otherText
        ]}>
          {message.content}
        </Text>
      </View>
      
      <Text style={[
        styles.timeText,
        isOwn ? styles.ownTime : styles.otherTime
      ]}>
        {formatTime(message.created_at)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...typography.body,
    lineHeight: 20,
  },
  ownText: {
    color: colors.text.inverted,
  },
  otherText: {
    color: colors.text.primary,
  },
  timeText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  ownTime: {
    color: colors.text.secondary,
    textAlign: 'right',
    marginRight: spacing.sm,
  },
  otherTime: {
    color: colors.text.secondary,
    textAlign: 'left',
    marginLeft: spacing.sm,
  },
});