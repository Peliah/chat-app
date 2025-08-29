// hooks/use-user-search.ts
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';

export function useUserSearch() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchUsers = async (query: string) => {
        if (!query) {
            setUsers([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, avatar_url, email')
                .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
                .limit(10);

            if (error) {
                setError(error.message);
                return;
            }

            setUsers(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { users, isLoading, error, searchUsers };
}