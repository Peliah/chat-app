import { colors, spacing } from '@/lib/constants/colors';
import { signupSchema, type SignupFormData } from '@/schema/auth-schema';
import { useAuthStore } from '@/stores/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function SignupForm() {
  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    const { error } = await signUp(data.email, data.password);
    
    if (error) {
      setError('root', { message: error.message });
    } else {
      router.replace('/(tabs)');
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
        placeholder="Create a password"
        secureTextEntry
        error={errors.password?.message}
      />

      <Input
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        secureTextEntry
        error={errors.confirmPassword?.message}
      />

      {errors.root && (
        <Text style={styles.errorText}>{errors.root.message}</Text>
      )}

      <Button
        title={isSubmitting ? 'Creating account...' : 'Create Account'}
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