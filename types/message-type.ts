export interface Message {
    id: string;
    content: string;
    conversation_id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    status: 'sent' | 'delivered' | 'read';
    reactions?: { [emoji: string]: string[] };
    attachments?: Array<{
        id: string;
        url: string;
        type: 'image' | 'document';
        name?: string;
    }>;
    profiles?: {
        username: string | null;
        email: string;
        avatar_url: string | null;
    };
}