// lib/database/typing-indicators.ts (updated)
import { supabase } from '../supabase/client';

export const typingIndicators = {
    // Set user as typing in a conversation
    setTyping: async (conversationId: string, userId: string, isTyping: boolean) => {
        // Use the secure function instead of direct table access
        const { error } = await supabase
            .rpc('set_typing_indicator', {
                p_user_id: userId,
                p_conversation_id: conversationId,
                p_is_typing: isTyping
            });

        if (error) throw error;
    },

    // Get typing users in a conversation
    getTypingUsers: async (conversationId: string) => {
        const { data, error } = await supabase
            .from('typing_indicators')
            .select('profiles:user_id(username)')
            .eq('conversation_id', conversationId)
            .eq('is_typing', true);

        if (error) throw error;
        return data.map((item: any) => item.profiles.username);
    },

    // Subscribe to typing indicators
    subscribeToTyping: (conversationId: string, callback: (typingData: any) => void) => {
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
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },
};