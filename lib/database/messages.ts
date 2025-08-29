import { Message } from '@/types/message-type';
import { supabase } from '../supabase/client';

export const messages = {
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:user_id (
          username,
          email,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Transform the data to ensure no null values
    return (data || []).map(message => ({
      id: message.id,
      content: message.content || '',
      conversation_id: message.conversation_id || '',
      created_at: message.created_at || new Date().toISOString(),
      updated_at: message.updated_at || new Date().toISOString(),
      user_id: message.user_id || '',
      status: message.status || 'sent',
      reactions: message.reactions || {},
      attachments: message.attachments || [],
      profiles: message.profiles ? {
        username: message.profiles.username,
        email: message.profiles.email || '',
        avatar_url: message.profiles.avatar_url
      } : undefined
    })) as Message[];
  },

  // Send a message
  async sendMessage(conversationId: string, userId: string, content: string, attachments?: any[]): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        content,
        status: 'sent',
        attachments: attachments || null,
      })
      .select(`
        *,
        profiles:user_id (
          username,
          email,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Transform the data to ensure no null values
    return {
      id: data.id,
      content: data.content || '',
      conversation_id: data.conversation_id || '',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      user_id: data.user_id || '',
      status: data.status || 'sent',
      reactions: data.reactions || {},
      attachments: data.attachments || [],
      profiles: data.profiles ? {
        username: data.profiles.username,
        email: data.profiles.email || '',
        avatar_url: data.profiles.avatar_url
      } : undefined
    } as Message;
  },

  // Rest of the functions remain the same...
  // Update message status
  async updateMessageStatus(messageId: string, status: 'delivered' | 'read') {
    const { error } = await supabase
      .from('messages')
      .update({ status })
      .eq('id', messageId);

    if (error) {
      throw new Error(error.message);
    }
  },

  // Add reaction to a message
  async addReaction(messageId: string, userId: string, emoji: string) {
    // First get the current reactions
    const { data: message } = await supabase
      .from('messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    const currentReactions = message?.reactions || {};

    // Add the reaction
    if (!currentReactions[emoji]) {
      currentReactions[emoji] = [userId];
    } else if (!currentReactions[emoji].includes(userId)) {
      currentReactions[emoji].push(userId);
    }

    // Update the message
    const { error } = await supabase
      .from('messages')
      .update({ reactions: currentReactions })
      .eq('id', messageId);

    if (error) {
      throw new Error(error.message);
    }
  },

  // Remove reaction from a message
  async removeReaction(messageId: string, userId: string, emoji: string) {
    // First get the current reactions
    const { data: message } = await supabase
      .from('messages')
      .select('reactions')
      .eq('id', messageId)
      .single();

    const currentReactions = message?.reactions || {};

    // Remove the reaction
    if (currentReactions[emoji]) {
      currentReactions[emoji] = currentReactions[emoji].filter(id => id !== userId);

      // If no more reactions for this emoji, remove the key
      if (currentReactions[emoji].length === 0) {
        delete currentReactions[emoji];
      }
    }

    // Update the message
    const { error } = await supabase
      .from('messages')
      .update({ reactions: currentReactions })
      .eq('id', messageId);

    if (error) {
      throw new Error(error.message);
    }
  },

  // Subscribe to messages for a conversation
  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Get the full message with profile data
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              profiles:user_id (
                username,
                email,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            // Transform the data to ensure no null values
            const message: Message = {
              id: data.id,
              content: data.content || '',
              conversation_id: data.conversation_id || '',
              created_at: data.created_at || new Date().toISOString(),
              updated_at: data.updated_at || new Date().toISOString(),
              user_id: data.user_id || '',
              status: data.status || 'sent',
              reactions: data.reactions || {},
              attachments: data.attachments || [],
              profiles: data.profiles ? {
                username: data.profiles.username,
                email: data.profiles.email || '',
                avatar_url: data.profiles.avatar_url
              } : undefined
            };
            callback(message);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  },
};