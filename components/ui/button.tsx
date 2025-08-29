import { colors, spacing, typography } from '@/lib/constants/colors';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ title, variant = 'primary', style, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        props.disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.border,
  },
  primaryText: {
    color: colors.text.inverted,
  },
  secondary: {
    backgroundColor: colors.accent,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.text.inverted,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  outlineText: {
    color: colors.text.primary,
  },
  disabled: {
    opacity: 0.6,
  },
});