import { useConversations } from '@/hooks/use-conversations';
import { create } from 'zustand';

interface ConversationStore {
    conversations: any[];
    isLoading: boolean;
    error: string | null;
    createConversation: (name: string | null, isGroup: boolean, memberIds: string[]) => Promise<any>;
    refreshConversations: () => void;
}

export const useConversationStore = create<ConversationStore>((set, get) => {
    return {
        conversations: [],
        isLoading: false,
        error: null,
        createConversation: async (name, isGroup, memberIds) => {
            throw new Error('Not implemented - use useInitializeConversationStore');
        },
        refreshConversations: () => {
            throw new Error('Not implemented - use useInitializeConversationStore');
        },
    };
});

// Hook to initialize the store with the useConversations hook
export const useInitializeConversationStore = () => {
    const { conversations, isLoading, error, createConversation, refresh } = useConversations();

    useConversationStore.setState({
        conversations,
        isLoading,
        error,
        createConversation,
        refreshConversations: refresh,
    });
};