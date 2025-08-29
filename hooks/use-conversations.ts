// hooks/use-conversations.ts
import { useCallback, useEffect, useState } from 'react';
import { conversations } from '../lib/database/conversations';
import { useAuthStore } from '../stores/auth-store';

export function useConversations() {
  const [conversationsList, setConversationsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await conversations.getUserConversations(user.id);
      setConversationsList(data.map((item: any) => item.conversation));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Subscribe to real-time conversation updates
  useEffect(() => {
    if (!user) return;

    loadConversations();

    const unsubscribe = conversations.subscribeToConversations(user.id, (update) => {
      if (update.deleted) {
        // Remove deleted conversation
        setConversationsList(prev => prev.filter(conv => conv.id !== update.id));
      } else {
        // Add or update conversation
        setConversationsList(prev => {
          const existingIndex = prev.findIndex(conv => conv.id === update.id);
          if (existingIndex >= 0) {
            // Update existing
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], ...update };
            return updated;
          } else {
            // Add new
            return [update, ...prev];
          }
        });
      }
    });

    return unsubscribe;
  }, [user, loadConversations]);

  return {
    conversations: conversationsList,
    isLoading,
    error,
    refresh: loadConversations,
  };
}