import { colors, spacing, typography } from '@/lib/constants/colors';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MessageItemProps {
    message: any;
    isOwn: boolean;
    onReaction?: (messageId: string, emoji: string) => void;
}

export function MessageItem({ message, isOwn, onReaction }: MessageItemProps) {
    const [showReactions, setShowReactions] = useState(false);
    const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const handleLongPress = () => {
        setShowReactions(true);
        setTimeout(() => setShowReactions(false), 3000);
    };

    const handleReaction = (emoji: string) => {
        if (onReaction) {
            onReaction(message.id, emoji);
            setShowReactions(false);
        }
    };

    return (
        <View style={[styles.container, isOwn && styles.containerOwn]}>
            {!isOwn && message.profiles && (
                <Text style={styles.senderName}>{message.profiles.username}</Text>
            )}

            <TouchableOpacity
                onLongPress={handleLongPress}
                activeOpacity={0.7}
            >
                <View style={[styles.messageBubble, isOwn && styles.messageBubbleOwn]}>
                    <Text style={[styles.messageText, isOwn && styles.messageTextOwn]}>
                        {message.content}
                    </Text>
                    <Text style={[styles.timeText, isOwn && styles.timeTextOwn]}>
                        {formattedTime}
                    </Text>
                </View>
            </TouchableOpacity>

            {message.reactions && message.reactions.length > 0 && (
                <View style={[styles.reactionsContainer, isOwn && styles.reactionsContainerOwn]}>
                    {message.reactions.map((reaction: any, index: number) => (
                        <Text key={index} style={styles.reaction}>
                            {reaction.emoji}
                        </Text>
                    ))}
                </View>
            )}

            {showReactions && (
                <View style={[styles.reactionPicker, isOwn && styles.reactionPickerOwn]}>
                    {['❤️', '😂', '😮', '😢', '👍'].map(emoji => (
                        <TouchableOpacity
                            key={emoji}
                            style={styles.reactionOption}
                            onPress={() => handleReaction(emoji)}
                        >
                            <Text style={styles.reactionEmoji}>{emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
        alignItems: 'flex-start',
    },
    containerOwn: {
        alignItems: 'flex-end',
    },
    senderName: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
        marginLeft: spacing.sm,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: spacing.md,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        backgroundColor: colors.surface,
    },
    messageBubbleOwn: {
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 4,
    },
    messageText: {
        ...typography.body,
        color: colors.text.primary,
    },
    messageTextOwn: {
        color: colors.text.inverted,
    },
    timeText: {
        ...typography.caption,
        color: colors.text.secondary,
        fontSize: 10,
        marginTop: spacing.xs,
        alignSelf: 'flex-end',
    },
    timeTextOwn: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    reactionsContainer: {
        flexDirection: 'row',
        marginTop: spacing.xs,
        marginLeft: spacing.sm,
        gap: spacing.xs,
    },
    reactionsContainerOwn: {
        marginLeft: 0,
        marginRight: spacing.sm,
        justifyContent: 'flex-end',
    },
    reaction: {
        fontSize: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 12,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
    },
    reactionPicker: {
        position: 'absolute',
        bottom: '100%',
        left: 0,
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 20,
        padding: spacing.xs,
        marginBottom: spacing.xs,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reactionPickerOwn: {
        left: 'auto',
        right: 0,
    },
    reactionOption: {
        padding: spacing.xs,
    },
    reactionEmoji: {
        fontSize: 16,
    },
});