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

  // Create a new conversation
  createConversation: async (name: string | null, isGroup: boolean, userId: string, memberIds: string[]) => {
    // First create the conversation
    const { data: conversationData, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        name,
        is_group: isGroup,
        created_by: userId,
      })
      .select()
      .single();

    if (conversationError) throw conversationError;

    // Add all members to the conversation (including the creator)
    const allMembers = [...new Set([userId, ...memberIds])]; // Ensure no duplicates
    const { error: membersError } = await supabase
      .from('conversation_members')
      .insert(
        allMembers.map(memberId => ({
          conversation_id: conversationData.id,
          user_id: memberId,
        }))
      );

    if (membersError) throw membersError;

    return conversationData;
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