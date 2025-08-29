import { SignupForm } from '@/components/auth/signup-form';
import { Container } from '@/components/ui/container';
import { colors, spacing, typography } from '@/lib/constants/colors';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <Container>
      <TouchableOpacity 
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the conversation</Text>
      </View>

      <SignupForm />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/auth/login" style={styles.link}>
          Sign in
        </Link>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: spacing.lg,
    padding: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
  },
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  link: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
});