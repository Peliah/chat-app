import { supabase } from '../supabase/client';

export const conversations = {
  // Get user's conversations with last message and members
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
            created_at
          ),
          members:conversation_members (
            profiles:user_id (
              id,
              username,
              email,
              avatar_url
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
                created_at
              ),
              members:conversation_members (
                profiles:user_id (
                  id,
                  username,
                  email,
                  avatar_url
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

  // ... other functions ...
};