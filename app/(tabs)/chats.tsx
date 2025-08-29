import { Container } from '@/components/ui/container';
import { useConversations } from '@/hooks/use-conversations';
import { colors, spacing, typography } from '@/lib/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'expo-router';
import { Crown, Plus } from 'lucide-react-native';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatsScreen() {
  const router = useRouter();
  const { conversations, isLoading } = useConversations();
  const { user } = useAuthStore();

  const getChatName = (conversation: any) => {
    if (conversation.name) return conversation.name;

    // For one-on-one chats, show the other user's name
    if (!conversation.is_group && conversation.members) {
      const otherMember = conversation.members.find((m: any) => m.id !== user?.id);
      return otherMember?.username || otherMember?.email || 'Unknown User';
    }

    return 'Group Chat';
  };

  const getLastMessage = (conversation: any) => {
    if (conversation.last_message) {
      return conversation.last_message.content;
    }
    return 'No messages yet';
  };

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push({ pathname: '/chat-room/[id]', params: { id: item.id } })}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{getChatName(item)}</Text>
        <Text style={styles.lastMessage}>{getLastMessage(item)}</Text>
      </View>
      {item.unread_count > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread_count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <Container>
        <ActivityIndicator size="large" color={colors.primary} />
      </Container>
    );
  }

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => router.push('/subscription')}
        >
          <Crown size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>My Chats</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => router.push('/search/search')}
        >
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.noChats}>No conversations yet. Start a new chat!</Text>
        }
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  newChatButton: {
    padding: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  chatInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  chatName: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  lastMessage: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  unreadText: {
    color: colors.text.inverted,
    fontSize: 12,
    fontWeight: '600',
  },
  noChats: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginTop: spacing.xl,
  },
});