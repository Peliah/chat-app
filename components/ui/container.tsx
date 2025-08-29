import { colors, spacing } from '@/lib/constants/colors';
import { KeyboardAvoidingView, StyleSheet, ViewProps } from 'react-native';

interface ContainerProps extends ViewProps {
    children: React.ReactNode;
}

export function Container({ children, style, ...props }: ContainerProps) {
    return (
        <KeyboardAvoidingView style={[styles.container, style]} {...props}>
            {children}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
});