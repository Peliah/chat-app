import { Container } from '@/components/ui/container';
import { useUserSearch } from '@/hooks/use-user-search';
import { colors, spacing, typography } from '@/lib/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { useConversationStore } from '@/stores/conversation-store';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function SearchScreen() {
    const [query, setQuery] = useState('');
    const { users, isLoading, error, searchUsers } = useUserSearch();
    const { user } = useAuthStore();
    const { createConversation } = useConversationStore();

    const handleSearch = (text: string) => {
        setQuery(text);
        searchUsers(text);
    };

    const handleUserPress = async (selectedUser: any) => {
        try {
            // Create a conversation with the selected user
            const conversation = await createConversation(
                null, // No name for 1-on-1 conversations
                false, // is_group = false
                [selectedUser.id] // Only the selected user
            );

            // Navigate to the chat screen
            router.push(`/chat-room/${conversation.id}`);
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    return (
        <Container>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={query}
                    onChangeText={handleSearch}
                    placeholder="Search users by username or email"
                    placeholderTextColor={colors.text.secondary}
                />
            </View>

            {isLoading && <Text style={styles.statusText}>Loading...</Text>}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={users.filter(u => u.id !== user?.id)} // Exclude current user
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem} onPress={() => handleUserPress(item)}>
                        {item.avatar_url ? (
                            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {item.username?.charAt(0) || item.email?.charAt(0) || 'U'}
                                </Text>
                            </View>
                        )}
                        <View style={styles.userInfo}>
                            <Text style={styles.username}>{item.username || item.email.split('@')[0]}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !isLoading && query ? <Text style={styles.statusText}>No users found</Text> : null
                }
            />
        </Container>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        padding: spacing.md,
        borderBottomWidth: 2,
        borderColor: colors.border,
    },
    searchInput: {
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 4,
        padding: spacing.sm,
        ...typography.body,
        color: colors.text.primary,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: spacing.md,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        color: colors.text.inverted,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        ...typography.body,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    email: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    statusText: {
        ...typography.caption,
        textAlign: 'center',
        marginTop: spacing.md,
        color: colors.text.secondary,
    },
    errorText: {
        ...typography.caption,
        textAlign: 'center',
        marginTop: spacing.md,
        color: colors.error,
    },
});