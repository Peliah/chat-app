import { useSafeNavigation } from '@/hooks/use-safe-navigation';
import { colors, spacing } from '@/lib/constants/colors';
import { loginSchema, type LoginFormData } from '@/schema/auth-schema';
import { useAuthStore } from '@/stores/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function LoginForm() {
    const router = useRouter();
    const signIn = useAuthStore((state) => state.signIn);
  const {navigateSafely} = useSafeNavigation();
    
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        email: '',
        password: '',
        },
    });


    const onSubmit = async (data: LoginFormData) => {
        const { error } = await signIn(data.email, data.password);
        
        if (error) {
        setError('root', { message: error.message });
        } else {
            navigateSafely('/(tabs)');
        }
    };

  return (
    <View style={styles.form}>
      <Input
        control={control}
        name="email"
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email?.message}
      />

      <Input
        control={control}
        name="password"
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        error={errors.password?.message}
      />

      {errors.root && (
        <Text style={styles.errorText}>{errors.root.message}</Text>
      )}

      <Button
        title={isSubmitting ? 'Signing in...' : 'Sign In'}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});