// hooks/use-messages.ts (updated)
import { messages } from '@/lib/database/messages';
import { typingIndicators } from '@/lib/database/typing-indicators';
import { useAuthStore } from '@/stores/auth-store';
import { useCallback, useEffect, useState } from 'react';
import { usePushNotifications } from './use-push-notifications';

export function useMessages(conversationId: string) {
    const [messagesList, setMessagesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const { user } = useAuthStore();
    const { sendPushNotification } = usePushNotifications();

    const loadMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await messages.getMessages(conversationId);
            setMessagesList(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId]);

    const sendMessage = useCallback(async (content: string, attachments?: any[]) => {
        if (!user) throw new Error('User not authenticated');

        try {
            const newMessage = await messages.sendMessage(conversationId, user.id, content, attachments);
            setMessagesList(prev => [...prev, newMessage]);

            // Send push notifications to other conversation members
            // You would need to implement this based on your notification service

            return newMessage;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [conversationId, user]);

    const addReaction = useCallback(async (messageId: string, emoji: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            await messages.addReaction(messageId, user.id, emoji);

            // Update local state
            setMessagesList(prev => prev.map(msg => {
                if (msg.id === messageId) {
                    const reactions = { ...msg.reactions };
                    if (!reactions[emoji]) {
                        reactions[emoji] = [user.id];
                    } else if (!reactions[emoji].includes(user.id)) {
                        reactions[emoji] = [...reactions[emoji], user.id];
                    }
                    return { ...msg, reactions };
                }
                return msg;
            }));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [user]);

    const removeReaction = useCallback(async (messageId: string, emoji: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            await messages.removeReaction(messageId, user.id, emoji);

            // Update local state
            setMessagesList(prev => prev.map(msg => {
                if (msg.id === messageId) {
                    const reactions = { ...msg.reactions };
                    if (reactions[emoji]) {
                        reactions[emoji] = reactions[emoji].filter(id => id !== user.id);
                        if (reactions[emoji].length === 0) {
                            delete reactions[emoji];
                        }
                    }
                    return { ...msg, reactions };
                }
                return msg;
            }));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [user]);

    const setTyping = useCallback(async (isTyping: boolean) => {
        if (!user) throw new Error('User not authenticated');

        try {
            await typingIndicators.setTypingStatus(conversationId, user.id, isTyping);
        } catch (err) {
            console.error('Error setting typing status:', err);
        }
    }, [conversationId, user]);

    // Subscribe to real-time messages and typing indicators
    useEffect(() => {
        if (!conversationId) return;

        loadMessages();

        const unsubscribeMessages = messages.subscribeToMessages(conversationId, (newMessage) => {
            setMessagesList(prev => [...prev, newMessage]);
        });

        const unsubscribeTyping = typingIndicators.subscribeToTypingIndicators(
            conversationId,
            (userIds) => {
                setTypingUsers(userIds);
            }
        );

        return () => {
            unsubscribeMessages();
            unsubscribeTyping();
        };
    }, [conversationId, loadMessages]);

    return {
        messages: messagesList,
        isLoading,
        error,
        typingUsers,
        sendMessage,
        addReaction,
        removeReaction,
        setTyping,
        refresh: loadMessages,
    };
}