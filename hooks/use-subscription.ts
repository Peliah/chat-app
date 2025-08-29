import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth-store';
import { useSubscriptionStore } from '../stores/subscription-store';

export function useSubscription() {
    const {
        currentPlan,
        subscriptionStatus,
        dailyMessageCount,
        maxFreeMessages,
        isLoading,
        loadSubscription,
        canSendMessage,
        simulateSubscription,
        simulateCancellation
    } = useSubscriptionStore();

    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            loadSubscription();
        }
    }, [user, loadSubscription]);

    const remainingMessages = Math.max(0, maxFreeMessages - dailyMessageCount);
    const hasReachedLimit = !canSendMessage();
    const isPremium = subscriptionStatus === 'active';

    return {
        currentPlan,
        subscriptionStatus,
        dailyMessageCount,
        maxFreeMessages,
        remainingMessages,
        hasReachedLimit,
        isPremium,
        isLoading,
        canSendMessage,
        simulateSubscription,
        simulateCancellation,
        refreshSubscription: loadSubscription
    };
}