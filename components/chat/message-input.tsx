import { colors, spacing, typography } from '@/lib/constants/colors';
import { PinIcon, Send } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface MessageInputProps {
    onSendMessage: (content: string, attachments?: any[]) => void;
    onTypingStart: () => void;
    onTypingEnd: () => void;
}

export function MessageInput({ onSendMessage, onTypingStart, onTypingEnd }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            setIsTyping(false);
            onTypingEnd();
        }
    };

    const handleChangeText = (text: string) => {
        setMessage(text);

        if (text.length > 0 && !isTyping) {
            setIsTyping(true);
            onTypingStart();
        } else if (text.length === 0 && isTyping) {
            setIsTyping(false);
            onTypingEnd();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.button}>
                    <PinIcon size={24} color={colors.text.primary} />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={handleChangeText}
                    placeholder="Type a message..."
                    placeholderTextColor={colors.text.secondary}
                    multiline
                    maxLength={500}
                />

                <TouchableOpacity
                    onPress={handleSend}
                    style={[styles.button, !message.trim() && styles.buttonDisabled]}
                    disabled={!message.trim()}
                >
                    <Send size={24} color={message.trim() ? colors.text.primary : colors.text.secondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.background,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
    },
    input: {
        flex: 1,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginHorizontal: spacing.sm,
        maxHeight: 100,
        ...typography.body,
        color: colors.text.primary,
    },
    button: {
        padding: spacing.xs,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});