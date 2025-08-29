// hooks/use-messages.ts
import { useCallback, useEffect, useState } from 'react';
import { messages } from '../lib/database/messages';
import { useAuthStore } from '../stores/auth-store';

export function useMessages(conversationId: string) {
    const [messagesList, setMessagesList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();

    const loadMessages = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await messages.getMessages(conversationId);
            setMessagesList(data.reverse()); // Reverse to show latest at bottom
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [conversationId]);

    const sendMessage = useCallback(async (content: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            const newMessage = await messages.sendMessage(conversationId, user.id, content);
            setMessagesList(prev => [...prev, newMessage]);
            return newMessage;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [conversationId, user]);

    // Subscribe to real-time messages
    useEffect(() => {
        if (!conversationId) return;

        loadMessages();

        const unsubscribe = messages.subscribeToMessages(conversationId, (newMessage) => {
            setMessagesList(prev => [...prev, newMessage]);
        });

        return unsubscribe;
    }, [conversationId, loadMessages]);

    return {
        messages: messagesList,
        isLoading,
        error,
        sendMessage,
        refresh: loadMessages,
    };
}