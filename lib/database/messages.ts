// lib/database/messages.ts
import { supabase } from '../supabase/client';

export const messages = {
  // Get messages for a conversation
  getMessages: async (conversationId: string, limit = 50) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          username,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Send a new message
  sendMessage: async (conversationId: string, userId: string, content: string) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content,
      })
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          username,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Subscribe to new messages in a conversation
  subscribeToMessages: (conversationId: string, callback: (message: any) => void) => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Get the full message with profile data
          supabase
            .from('messages')
            .select(`
              *,
              profiles:user_id (
                id,
                email,
                username,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) callback(data);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Subscribe to message updates (for read receipts, edits, etc.)
  subscribeToMessageUpdates: (conversationId: string, callback: (message: any) => void) => {
    const channel = supabase
      .channel(`message-updates:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
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