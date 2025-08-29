import { colors, spacing } from '@/lib/constants/colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😠'];

interface MessageReactionPickerProps {
  messageId: string;
  onClose: () => void;
}

export function MessageReactionPicker({ messageId, onClose }: MessageReactionPickerProps) {
  const handleReactionSelect = async (emoji: string) => {
    // Add reaction to message using Supabase
    // This would call a function that updates the reactions object in the message
    console.log(`Adding reaction ${emoji} to message ${messageId}`);
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.picker}>
        {commonReactions.map(emoji => (
          <TouchableOpacity
            key={emoji}
            onPress={() => handleReactionSelect(emoji)}
            style={styles.emojiButton}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  picker: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  emojiButton: {
    padding: spacing.xs,
  },
  emoji: {
    fontSize: 20,
  },
});