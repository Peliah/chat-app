import { colors, spacing } from '@/lib/constants/colors';
import { Paperclip, Send, Smile } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface MessageInputProps {
    onSendMessage: (content: string) => Promise<void>;
    onTypingStart?: () => void;
    onTypingEnd?: () => void;
    disabled?: boolean;
}

export function MessageInput({ onSendMessage, onTypingStart, onTypingEnd, disabled }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSend = async () => {
        if (message.trim() && !disabled) {
            const content = message.trim();
            setMessage('');
            Keyboard.dismiss();
            await onSendMessage(content);

            // Notify typing ended
            if (onTypingEnd) {
                onTypingEnd();
            }
        }
    };

    const handleChangeText = (text: string) => {
        setMessage(text);

        // Notify typing started
        if (text.length > 0 && onTypingStart) {
            onTypingStart();
        }

        // Clear previous timeout and set new one for typing end
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (text.length > 0 && onTypingEnd) {
            typingTimeoutRef.current = setTimeout(() => {
                onTypingEnd();
            }, 1000); // 1 second after stopping typing
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (onTypingEnd) {
            onTypingEnd();
        }
    };

    return (
        <View style={[styles.container, isFocused && styles.containerFocused]}>
            <TouchableOpacity style={styles.button} disabled={disabled}>
                <Paperclip size={24} color={colors.text.secondary} />
            </TouchableOpacity>

            <TextInput
                ref={inputRef}
                style={styles.input}
                value={message}
                onChangeText={handleChangeText}
                placeholder="Type a message..."
                placeholderTextColor={colors.text.secondary}
                multiline
                maxLength={500}
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                onSubmitEditing={handleSend}
            />

            <TouchableOpacity style={styles.button} disabled={disabled}>
                <Smile size={24} color={colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.sendButton, (!message.trim() || disabled) && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!message.trim() || disabled}
            >
                <Send size={20} color={colors.text.inverted} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: spacing.sm,
        borderTopWidth: 2,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
        gap: spacing.sm,
    },
    containerFocused: {
        backgroundColor: colors.background,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 120,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 20,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
        color: colors.text.primary,
        fontSize: 16,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderWidth: 2,
        borderColor: colors.border,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
    },
    sendButtonDisabled: {
        backgroundColor: colors.text.secondary,
        opacity: 0.5,
    },
});