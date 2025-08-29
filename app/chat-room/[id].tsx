import { MessageInput } from '@/components/chat/message-input';
import { MessageItem } from '@/components/chat/message-item';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { SubscriptionGate } from '@/components/subscription/subscription-gate';
import { Container } from '@/components/ui/container';
import { useMessages } from '@/hooks/use-messages';
import { useSubscription } from '@/hooks/use-subscription';
import { colors, spacing } from '@/lib/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { hasReachedLimit } = useSubscription();
  const {
    messages,
    isLoading,
    typingUsers,
    sendMessage,
    addReaction,
    setTyping
  } = useMessages(id as string);
  const { user } = useAuthStore();

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error && (error as any).message === 'MESSAGE_LIMIT_REACHED') {
        router.push('/subscription/gate');
      } else {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  useEffect(() => {
    // Clean up typing indicator when leaving the chat
    return () => {
      if (user) {
        setTyping(false).catch(console.error);
      }
    };
  }, [user, setTyping]);

  if (isLoading) {
    return (
      <Container>
        <Text>Loading messages...</Text>
      </Container>
    );
  }

  return (
    <>
      {hasReachedLimit && <SubscriptionGate />}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <MessageItem
              message={item}
              isOwn={item.user_id === user?.id}
              onReaction={handleReaction}
            />
          )}
          keyExtractor={(item, index) => item.id ? item.id.toString() : `temp-${index}`}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          ListHeaderComponent={
            <TypingIndicator
              users={typingUsers}
              isVisible={typingUsers.length > 0}
            />
          }
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingStart={() => setTyping(true)}
          onTypingEnd={() => setTyping(false)}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesList: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});