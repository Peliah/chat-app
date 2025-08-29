import { colors, spacing, typography } from '@/lib/constants/colors';
import { Message } from '@/types/message-type';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FileAttachment } from './file-attachment';
import { MessageReactionPicker } from './message-reaction-picker';
import { MessageReactions } from './message-reactions';

interface MessageItemProps {
    message: Message;
    isOwn: boolean;
}

export function MessageItem({ message, isOwn }: MessageItemProps) {
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getDisplayName = () => {
        if (isOwn) return 'You';
        return message.profiles?.username || message.profiles?.email?.split('@')[0] || 'Unknown';
    };

    const statusIcons = {
        sent: '✓',
        delivered: '✓✓',
        read: '✓✓👁️'
    };

    const handleLongPress = () => {
        setShowReactionPicker(true);
    };

    return (
        <View style={[
            styles.container,
            isOwn ? styles.ownContainer : styles.otherContainer
        ]}>
            {!isOwn && (
                <Text style={styles.senderName}>{getDisplayName()}</Text>
            )}

            <TouchableOpacity
                onLongPress={handleLongPress}
                activeOpacity={0.7}
                style={[
                    styles.messageBubble,
                    isOwn ? styles.ownBubble : styles.otherBubble
                ]}
            >
                {message.attachments && message.attachments.length > 0 && (
                    <View style={styles.attachmentsContainer}>
                        {message.attachments.map(attachment => (
                            <FileAttachment key={attachment.id} attachment={attachment} />
                        ))}
                    </View>
                )}

                {message.content ? (
                    <Text style={[
                        styles.messageText,
                        isOwn ? styles.ownText : styles.otherText
                    ]}>
                        {message.content}
                    </Text>
                ) : null}
            </TouchableOpacity>

            <View style={[
                styles.footer,
                isOwn ? styles.ownFooter : styles.otherFooter
            ]}>
                <Text style={[
                    styles.timeText,
                    isOwn ? styles.ownTime : styles.otherTime
                ]}>
                    {formatTime(message.created_at)}
                </Text>

                {isOwn && message.status && (
                    <Text style={styles.statusText}>{statusIcons[message.status]}</Text>
                )}
            </View>

            {message.reactions && Object.keys(message.reactions).length > 0 && (
                <MessageReactions reactions={message.reactions} isOwn={isOwn} />
            )}

            {showReactionPicker && (
                <MessageReactionPicker
                    messageId={message.id}
                    onClose={() => setShowReactionPicker(false)}
                />
            )}
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
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    ownFooter: {
        justifyContent: 'flex-end',
    },
    otherFooter: {
        justifyContent: 'flex-start',
    },
    timeText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    ownTime: {
        marginRight: spacing.sm,
    },
    otherTime: {
        marginLeft: spacing.sm,
    },
    statusText: {
        ...typography.caption,
        color: colors.text.secondary,
        marginLeft: spacing.xs,
    },
    attachmentsContainer: {
        marginBottom: spacing.sm,
    },
});