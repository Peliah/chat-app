import { supabase } from '../supabase/client';

export const reactions = {
    // Add reaction to a message
    addReaction: async (messageId: string, userId: string, emoji: string) => {
        const { data, error } = await supabase
            .from('message_reactions')
            .upsert(
                { message_id: messageId, user_id: userId, emoji },
                { onConflict: 'message_id,user_id,emoji' }
            )
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Remove reaction from a message
    removeReaction: async (messageId: string, userId: string, emoji: string) => {
        const { error } = await supabase
            .from('message_reactions')
            .delete()
            .eq('message_id', messageId)
            .eq('user_id', userId)
            .eq('emoji', emoji);

        if (error) throw error;
    },

    // Get reactions for a message
    getMessageReactions: async (messageId: string) => {
        const { data, error } = await supabase
            .from('message_reactions')
            .select('*')
            .eq('message_id', messageId);

        if (error) throw error;
        return data;
    },

    // Subscribe to reaction changes
    subscribeToReactions: (messageId: string, callback: (reaction: any) => void) => {
        const channel = supabase
            .channel(`reactions:${messageId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'message_reactions',
                    filter: `message_id=eq.${messageId}`,
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