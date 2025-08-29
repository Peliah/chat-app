// app/(tabs)/index.tsx
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { colors, spacing, typography } from '@/lib/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          {user?.email ? `Hello, ${user.email}` : 'Hello there!'}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Start chatting with your friends or create new conversations.
        </Text>

        <Button
          title="Start Chatting"
          onPress={() => router.push('/(tabs)/chats')}
          style={styles.button}
        />

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.button}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    width: '100%',
    marginBottom: spacing.md,
  },
});