import { colors, spacing, typography } from '@/lib/constants/colors';
import { Send } from 'lucide-react-native';
import { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending || disabled) return;

    const messageToSend = message.trim();
    setMessage('');
    setIsSending(true);
    Keyboard.dismiss();

    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally, you could show an error message to the user
      setMessage(messageToSend); // Restore the message if sending failed
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmitEditing = () => {
    handleSend();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.text.secondary}
          multiline
          maxLength={500}
          editable={!disabled && !isSending}
          onSubmitEditing={handleSubmitEditing}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || isSending || disabled) && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!message.trim() || isSending || disabled}
        >
          <Send 
            size={20} 
            color={
              !message.trim() || isSending || disabled 
                ? colors.text.secondary 
                : colors.text.inverted
            } 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingTop: spacing.sm,
    maxHeight: 100,
    backgroundColor: colors.background,
    color: colors.text.primary,
    ...typography.body,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  sendButtonDisabled: {
    backgroundColor: colors.background,
  },
});