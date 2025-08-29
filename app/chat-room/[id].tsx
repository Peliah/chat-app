import { MessageInput } from '@/components/chat/message-input';
import { MessageItem } from '@/components/chat/message-item';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { Container } from '@/components/ui/container';
import { useMessages } from '@/hooks/use-messages';
import { spacing } from '@/lib/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const { messages, isLoading, sendMessage } = useMessages(id as string);
  const { user } = useAuthStore();
  
  // Mock typing users - you'll implement real typing detection later
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Text>Loading messages...</Text>
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <MessageItem
            message={item}
            isOwn={item.user_id === user?.id}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
        ListFooterComponent={
          <TypingIndicator usersTyping={typingUsers} />
        }
      />
      
      <MessageInput onSendMessage={handleSendMessage} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  messagesList: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});