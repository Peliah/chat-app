import { useRouter } from 'expo-router';
import { CheckCircle, Crown, XCircle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/button';
import { Container } from '../../components/ui/container';
import { useSubscription } from '../../hooks/use-subscription';
import { colors, spacing, typography } from '../../lib/constants/colors';

export default function SubscriptionScreen() {
    const router = useRouter();
    const {
        currentPlan,
        isPremium,
        simulateSubscription,
        simulateCancellation,
        dailyMessageCount,
        maxFreeMessages,
        remainingMessages
    } = useSubscription();

    const handleUpgrade = async () => {
        try {
            await simulateSubscription('premium-plan-id');
            router.back();
        } catch (error) {
            console.error('Failed to upgrade:', error);
        }
    };

    const handleCancel = async () => {
        try {
            await simulateCancellation();
        } catch (error) {
            console.error('Failed to cancel:', error);
        }
    };

    return (
        <Container>
            <View style={styles.header}>
                <Crown size={48} color={colors.primary} />
                <Text style={styles.title}>Subscription</Text>
                <Text style={styles.subtitle}>
                    {isPremium ? 'You have a Premium subscription' : 'Upgrade to unlock all features'}
                </Text>
            </View>

            <View style={styles.currentPlan}>
                <Text style={styles.sectionTitle}>Current Plan</Text>
                <View style={[styles.planCard, isPremium && styles.premiumPlanCard]}>
                    <Text style={styles.planName}>
                        {isPremium ? 'Premium' : 'Free'}
                    </Text>
                    <Text style={styles.planPrice}>
                        {isPremium ? '$9.99/month' : 'Free'}
                    </Text>
                    {!isPremium && (
                        <Text style={styles.planDescription}>
                            {remainingMessages} of {maxFreeMessages} messages remaining today
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.features}>
                <Text style={styles.sectionTitle}>Features</Text>

                <View style={styles.feature}>
                    {isPremium ? (
                        <CheckCircle size={24} color={colors.success} />
                    ) : (
                        <XCircle size={24} color={colors.error} />
                    )}
                    <Text style={styles.featureText}>Unlimited messages</Text>
                </View>

                <View style={styles.feature}>
                    {isPremium ? (
                        <CheckCircle size={24} color={colors.success} />
                    ) : (
                        <XCircle size={24} color={colors.error} />
                    )}
                    <Text style={styles.featureText}>Priority support</Text>
                </View>

                <View style={styles.feature}>
                    {isPremium ? (
                        <CheckCircle size={24} color={colors.success} />
                    ) : (
                        <XCircle size={24} color={colors.error} />
                    )}
                    <Text style={styles.featureText}>No ads</Text>
                </View>

                <View style={styles.feature}>
                    {isPremium ? (
                        <CheckCircle size={24} color={colors.success} />
                    ) : (
                        <XCircle size={24} color={colors.error} />
                    )}
                    <Text style={styles.featureText}>Advanced features</Text>
                </View>
            </View>

            <View style={styles.actions}>
                {isPremium ? (
                    <Button
                        title="Cancel Subscription"
                        onPress={handleCancel}
                        variant="outline"
                        style={styles.cancelButton}
                    />
                ) : (
                    <Button
                        title="Upgrade to Premium"
                        onPress={handleUpgrade}
                        style={styles.upgradeButton}
                    />
                )}
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
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    currentPlan: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h2,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    planCard: {
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.surface,
    },
    premiumPlanCard: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
    },
    planName: {
        ...typography.h2,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    planPrice: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    planDescription: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    features: {
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
    actions: {
        marginTop: 'auto',
    },
    upgradeButton: {
        marginBottom: spacing.md,
    },
    cancelButton: {
        borderColor: colors.error,
    },
});