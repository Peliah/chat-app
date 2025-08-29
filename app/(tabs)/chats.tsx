// app/(tabs)/chats.tsx
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container } from '../../components/ui/container';
import { colors, spacing, typography } from '../../lib/constants/colors';

const mockChats = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey there!', unread: 2 },
  { id: '2', name: 'Jane Smith', lastMessage: 'How are you?', unread: 0 },
  { id: '3', name: 'Team Chat', lastMessage: 'Meeting tomorrow', unread: 5 },
];

export default function ChatsScreen() {
  const router = useRouter();

  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat-room/${item.id}`)}
    >
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>My Chats</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
});