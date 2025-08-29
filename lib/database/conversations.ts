// lib/database/conversations.ts
import { supabase } from '../supabase/client';

export const conversations = {
  // Get user's conversations
  getUserConversations: async (userId: string) => {
    const { data, error } = await supabase
      .from('conversation_members')
      .select(`
        conversation:conversation_id (
          id,
          name,
          is_group,
          created_at,
          last_message:messages (
            content,
            created_at,
            profiles:user_id (
              username
            )
          )
        )
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Subscribe to conversation updates
  subscribeToConversations: (userId: string, callback: (conversation: any) => void) => {
    const channel = supabase
      .channel(`user-conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_members',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          // Get the full conversation data
          const { data } = await supabase
            .from('conversations')
            .select(`
              *,
              last_message:messages (
                content,
                created_at,
                profiles:user_id (
                  username
                )
              )
            `)
            .eq('id', payload.new.conversation_id)
            .single();

          if (data) callback(data);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'conversation_members',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback({ id: payload.old.conversation_id, deleted: true });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Subscribe to conversation updates (name changes, etc.)
  subscribeToConversationUpdates: (conversationId: string, callback: (conversation: any) => void) => {
    const channel = supabase
      .channel(`conversation-updates:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};