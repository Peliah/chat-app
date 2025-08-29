import { Container } from '@/components/ui/container';
import { colors, spacing, typography } from '@/lib/constants/colors';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'expo-router';
import { Search, User } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const { user } = useAuthStore();

    // const searchUsers = useCallback(async (searchQuery: string) => {
    //     if (!searchQuery.trim()) {
    //         setResults([]);
    //         return;
    //     }

    //     if (!user?.id) {
    //         setIsSearching(false);
    //         setResults([]);
    //         return;
    //     }
    //     setIsSearching(true);
    //     const { data, error } = await supabase
    //         .from('profiles')
    //         .select('id, username, email, avatar_url')
    //         .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
    //         .neq('id', user.id) // Exclude current user
    //         .limit(10);

    //     if (error) {
    //         console.error('Error searching users:', error);
    //     } else {
    //         setResults(data || []);
    //     }
    //     setIsSearching(false);
    // }, [user]);

    // app/search/search.tsx (final implementation)
    const searchUsers = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsSearching(true);

        try {
            // Try the direct approach first
            const queryBuilder = supabase
                .from('profiles')
                .select('id, username, email, avatar_url')
                .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
            if (user?.id) {
                queryBuilder.neq('id', user.id);
            }
            const { data, error } = await queryBuilder.limit(10);

            if (error) {
                console.error('Direct search failed:', error);

                // Fallback to RPC if direct search fails
                if (error.message.includes('row-level security')) {
                    const { data: rpcData, error: rpcError } = await supabase
                        .rpc('search_users', {
                            search_query: searchQuery,
                            current_user_id: user?.id ?? ''
                        });

                    if (rpcError) {
                        console.error('RPC search also failed:', rpcError);
                    } else {
                        setResults(rpcData || []);
                    }
                }
            } else {
                setResults(data || []);
            }
        } catch (err) {
            console.error('Unexpected error searching users:', err);
        } finally {
            setIsSearching(false);
        }
    }, [user]);

    // const startConversation = async (otherUser: any) => {
    //     if (!user) return;

    //     setIsLoading(true);
    //     try {
    //         // Check if conversation already exists
    //         // 1. Get all conversation IDs for the other user
    //         const { data: otherUserConversations, error: otherUserConvError } = await supabase
    //             .from('conversation_members')
    //             .select('conversation_id')
    //             .eq('user_id', otherUser.id);

    //         if (otherUserConvError) throw otherUserConvError;

    //         const otherUserConversationIds = (otherUserConversations || [])
    //             .map((row: any) => row.conversation_id)
    //             .filter(Boolean);

    //         // 2. Find if the current user is also a member of any of those conversations
    //         const { data: existingConversations, error: convError } = await supabase
    //             .from('conversation_members')
    //             .select('conversation_id')
    //             .eq('user_id', user.id)
    //             .in('conversation_id', otherUserConversationIds);

    //         if (convError) throw convError;

    //         let conversationId;

    //         if (existingConversations && existingConversations.length > 0) {
    //             // Use existing conversation
    //             conversationId = existingConversations[0].conversation_id;
    //         } else {
    //             // Create new conversation
    //             const { data: newConversation, error: createError } = await supabase
    //                 .from('conversations')
    //                 .insert({
    //                     is_group: false,
    //                     created_by: user.id,
    //                 })
    //                 .select()
    //                 .single();

    //             if (createError) throw createError;

    //             // Add both users to conversation
    //             const { error: membersError } = await supabase
    //                 .from('conversation_members')
    //                 .insert([
    //                     { conversation_id: newConversation.id, user_id: user.id },
    //                     { conversation_id: newConversation.id, user_id: otherUser.id },
    //                 ]);

    //             if (membersError) throw membersError;

    //             conversationId = newConversation.id;
    //         }

    //         // Navigate to chat room
    //         router.push({ pathname: '/chat-room/[id]', params: { id: conversationId } });
    //     } catch (error) {
    //         console.error('Error starting conversation:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // Update the startConversation function in app/search/search.tsx
    const startConversation = async (otherUser: any) => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Use a transaction to ensure data consistency
            const { data: conversationData, error: conversationError } = await supabase
                .rpc('create_conversation_with_members', {
                    p_user_id: user.id,
                    p_other_user_id: otherUser.id
                });

            if (conversationError) throw conversationError;

            // Navigate to chat room
            router.push({ pathname: '/chat-room/[id]', params: { id: conversationData } });
        } catch (error) {
            console.error('Error starting conversation:', error);

            // Fallback method if the RPC fails
            try {
                // Create new conversation
                const { data: newConversation, error: createError } = await supabase
                    .from('conversations')
                    .insert({
                        is_group: false,
                        created_by: user.id,
                    })
                    .select()
                    .single();

                if (createError) throw createError;

                // Add both users to conversation
                const { error: membersError } = await supabase
                    .from('conversation_members')
                    .insert([
                        { conversation_id: newConversation.id, user_id: user.id },
                        { conversation_id: newConversation.id, user_id: otherUser.id },
                    ]);

                if (membersError) throw membersError;

                // Navigate to chat room
                router.push({ pathname: '/chat-room/[id]', params: { id: newConversation.id } });
            } catch (fallbackError) {
                console.error('Fallback method also failed:', fallbackError);
            }
        } finally {
            setIsLoading(false);
        }
    };
    const renderUserItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => startConversation(item)}
            disabled={isLoading}
        >
            <View style={styles.avatarPlaceholder}>
                <User size={24} color={colors.text.secondary} />
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username || 'No username'}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Container>
            <View style={styles.searchContainer}>
                <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users by username or email..."
                    value={query}
                    onChangeText={(text) => {
                        setQuery(text);
                        searchUsers(text);
                    }}
                    placeholderTextColor={colors.text.secondary}
                />
            </View>

            {isSearching && (
                <View style={styles.center}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            )}

            <FlatList
                data={results}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    !isSearching && query ? (
                        <Text style={styles.noResults}>No users found</Text>
                    ) : null
                }
            />
        </Container>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: spacing.md,
        color: colors.text.primary,
        fontSize: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.surface,
        marginBottom: spacing.sm,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        borderWidth: 2,
        borderColor: colors.border,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    email: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    noResults: {
        textAlign: 'center',
        color: colors.text.secondary,
        marginTop: spacing.xl,
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
    },
});