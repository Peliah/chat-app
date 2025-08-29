// hooks/use-typing-indicator.ts
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase/client';

export function useTypingIndicator(conversationId: string, userId: string) {
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Subscribe to typing events
        const channel = supabase
            .channel(`typing:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'typing_indicators',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    // Handle typing events
                    if (payload.eventType === 'INSERT') {
                        const { user_id, is_typing } = payload.new;
                        if (is_typing && !typingUsers.includes(user_id)) {
                            setTypingUsers(prev => [...prev, user_id]);
                        } else if (!is_typing) {
                            setTypingUsers(prev => prev.filter(id => id !== user_id));
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [conversationId]);

    const setTyping = (isTyping: boolean) => {
        // Update typing status in database
        supabase
            .from('typing_indicators')
            .upsert({
                conversation_id: conversationId,
                user_id: userId,
                is_typing: isTyping,
                updated_at: new Date().toISOString(),
            })
            .then(({ error }) => {
                if (error) console.error('Error setting typing status:', error);
            });

        // Clear previous timeout if exists
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to automatically set typing to false after 3 seconds
        if (isTyping) {
            typingTimeoutRef.current = setTimeout(() => {
                setTyping(false);
            }, 3000);
        }
    };

    return { typingUsers, setTyping };
}