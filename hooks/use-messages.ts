import { useSubscriptionStore } from '@/stores/subscription-store';
import { useCallback, useEffect, useState } from 'react';
import { messages } from '../lib/database/messages';
import { reactions } from '../lib/database/reactions';
import { typingIndicators } from '../lib/database/typing-indicators';
import { useAuthStore } from '../stores/auth-store';

export function useMessages(conversationId: string) {
    const [messagesList, setMessagesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const { user } = useAuthStore();

    const loadMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await messages.getMessages(conversationId);

            // Fetch reactions for each message
            const messagesWithReactions = await Promise.all(
                data.map(async (message) => {
                    const messageReactions = await reactions.getMessageReactions(message.id);
                    return { ...message, reactions: messageReactions };
                })
            );

            setMessagesList(messagesWithReactions);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            setIsLoading(false);
        }
    }, [conversationId]);

    const sendMessage = useCallback(async (content: string) => {
        if (!user) throw new Error('User not authenticated');
        const { canSendMessage, incrementMessageCount } = useSubscriptionStore.getState();

        if (!canSendMessage()) {
            throw new Error('MESSAGE_LIMIT_REACHED');
        }
        try {
            const newMessage = await messages.sendMessage(conversationId, user.id, content);
            console.log(newMessage);
            incrementMessageCount();

            // Add empty reactions array to new message
            const messageWithReactions = { ...newMessage, reactions: [] };

            // setMessagesList(prev => [...prev, messageWithReactions]);
            setMessagesList(prev => {
                // avoid duplicate by checking id
                const exists = prev.some(m => m.id === messageWithReactions.id);
                if (exists) return prev;
                return [...prev, messageWithReactions];
            });
            return messageWithReactions;
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            setIsLoading(false);
        }
    }, [conversationId, user]);

    const addReaction = useCallback(async (messageId: string, emoji: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            await reactions.addReaction(messageId, user.id, emoji);

            // Update local state optimistically
            setMessagesList(prev => prev.map(message =>
                message.id === messageId
                    ? {
                        ...message,
                        reactions: [...(message.reactions || []), { emoji, user_id: user.id }]
                    }
                    : message
            ));
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const setTyping = useCallback(async (isTyping: boolean) => {
        if (!user) return;

        try {
            await typingIndicators.setTyping(conversationId, user.id, isTyping);
        } catch (err) {
            console.error('Failed to set typing indicator:', err);
        }
    }, [conversationId, user]);

    // Subscribe to real-time messages and reactions
    useEffect(() => {
        if (!conversationId) return;

        loadMessages();

        // Subscribe to new messages
        const unsubscribeMessages = messages.subscribeToMessages(conversationId, async (newMessage) => {
            // Fetch reactions for the new message
            const messageReactions = await reactions.getMessageReactions(newMessage.id);
            const messageWithReactions = { ...newMessage, reactions: messageReactions };

            // setMessagesList(prev => [...prev, messageWithReactions]);
            setMessagesList(prev => {
                // avoid duplicate by checking id
                const exists = prev.some(m => m.id === messageWithReactions.id);
                if (exists) return prev;
                return [...prev, messageWithReactions];
            });
        });

        // Subscribe to reaction changes
        const unsubscribeReactions = reactions.subscribeToReactions(conversationId, (payload) => {
            setMessagesList(prev => prev.map(message => {
                if (message.id !== payload.new.message_id) return message;

                let updatedReactions = [...(message.reactions || [])];

                if (payload.eventType === 'INSERT') {
                    updatedReactions.push(payload.new);
                } else if (payload.eventType === 'DELETE') {
                    updatedReactions = updatedReactions.filter(
                        r => !(r.user_id === payload.old.user_id && r.emoji === payload.old.emoji)
                    );
                }

                return { ...message, reactions: updatedReactions };
            }));
        });

        // Subscribe to typing indicators
        const unsubscribeTyping = typingIndicators.subscribeToTyping(conversationId, async () => {
            const users = await typingIndicators.getTypingUsers(conversationId);
            setTypingUsers(users);
        });

        return () => {
            unsubscribeMessages();
            unsubscribeReactions();
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
        setTyping,
        refresh: loadMessages,
    };
}