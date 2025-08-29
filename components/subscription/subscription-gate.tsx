// components/subscription/subscription-gate.tsx
import { useRouter } from 'expo-router';
import { CheckCircle, Crown, X } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSubscription } from '../../hooks/use-subscription';
import { colors, spacing, typography } from '../../lib/constants/colors';
import { Button } from '../ui/button';
import { Container } from '../ui/container';

export function SubscriptionGate() {
    const router = useRouter();
    const { simulateSubscription, hasReachedLimit } = useSubscription();

    const handleSubscribe = async () => {
        try {
            // For demo purposes, we're using the Premium plan ID
            // In a real app, you'd get this from your database
            await simulateSubscription('premium-plan-id');
            router.back();
        } catch (error) {
            console.error('Failed to subscribe:', error);
        }
    };

    if (!hasReachedLimit) return null;

    return (
        <Container style={styles.container}>
            <View style={styles.header}>
                <Crown size={48} color={colors.primary} />
                <Text style={styles.title}>Upgrade to Premium</Text>
                <Text style={styles.subtitle}>
                    You've reached your daily message limit. Upgrade to send unlimited messages.
                </Text>
            </View>

            <View style={styles.features}>
                <View style={styles.feature}>
                    <CheckCircle size={24} color={colors.success} />
                    <Text style={styles.featureText}>Unlimited messages</Text>
                </View>
                <View style={styles.feature}>
                    <CheckCircle size={24} color={colors.success} />
                    <Text style={styles.featureText}>Priority support</Text>
                </View>
                <View style={styles.feature}>
                    <CheckCircle size={24} color={colors.success} />
                    <Text style={styles.featureText}>No ads</Text>
                </View>
                <View style={styles.feature}>
                    <CheckCircle size={24} color={colors.success} />
                    <Text style={styles.featureText}>Advanced features</Text>
                </View>
            </View>

            <View style={styles.pricing}>
                <Text style={styles.price}>$9.99</Text>
                <Text style={styles.interval}>per month</Text>
            </View>

            <Button
                title="Upgrade Now"
                onPress={handleSubscribe}
                style={styles.subscribeButton}
            // icon={<Zap size={20} color={colors.text.inverted} />}
            />

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
            >
                <X size={20} color={colors.text.secondary} />
                <Text style={styles.cancelText}>Not now</Text>
            </TouchableOpacity>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        maxWidth: 300,
    },
    features: {
        width: '100%',
        marginBottom: spacing.xl,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: spacing.sm,
        backgroundColor: colors.surface,
    },
    featureText: {
        ...typography.body,
        color: colors.text.primary,
        marginLeft: spacing.md,
    },
    pricing: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    price: {
        ...typography.h1,
        color: colors.text.primary,
        fontWeight: 'bold',
    },
    interval: {
        ...typography.body,
        color: colors.text.secondary,
    },
    subscribeButton: {
        width: '100%',
        marginBottom: spacing.md,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancelText: {
        ...typography.body,
        color: colors.text.secondary,
        marginLeft: spacing.xs,
    },
});