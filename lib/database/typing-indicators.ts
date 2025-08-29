// lib/supabase/typing-indicators.ts
import { supabase } from '../supabase/client';

export const typingIndicators = {
    // Set typing status for a user in a conversation
    async setTypingStatus(conversationId: string, userId: string, isTyping: boolean) {
        const { error } = await supabase
            .from('typing_indicators')
            .upsert({
                conversation_id: conversationId,
                user_id: userId,
                is_typing: isTyping,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            throw new Error(error.message);
        }
    },

    // Get typing users for a conversation
    async getTypingUsers(conversationId: string) {
        const { data, error } = await supabase
            .from('typing_indicators')
            .select('user_id')
            .eq('conversation_id', conversationId)
            .eq('is_typing', true)
            .gt('updated_at', new Date(Date.now() - 3000).toISOString()); // Only consider recent typing

        if (error) {
            throw new Error(error.message);
        }

        return data.map(item => item.user_id);
    },

    // Subscribe to typing indicators for a conversation
    subscribeToTypingIndicators(conversationId: string, callback: (userIds: string[]) => void) {
        const subscription = supabase
            .channel(`typing:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'typing_indicators',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                async () => {
                    const typingUsers = await this.getTypingUsers(conversationId);
                    callback(typingUsers);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },
};