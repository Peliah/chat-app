import { supabase } from '@/lib/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useAuthStore } from './auth-store';

interface SubscriptionState {
    currentPlan: any | null;
    subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'inactive' | 'loading';
    dailyMessageCount: number;
    maxFreeMessages: number;
    lastResetDate: string;
    isLoading: boolean;
    loadSubscription: () => Promise<void>;
    incrementMessageCount: () => void;
    canSendMessage: () => boolean;
    simulateSubscription: (planId: string) => Promise<void>;
    simulateCancellation: () => Promise<void>;
    resetDailyCount: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
    persist(
        (set, get) => ({
            currentPlan: null,
            subscriptionStatus: 'loading',
            dailyMessageCount: 0,
            maxFreeMessages: 20,
            lastResetDate: new Date().toISOString().split('T')[0],
            isLoading: false,

            loadSubscription: async () => {
                const { user } = useAuthStore.getState();
                if (!user) {
                    set({ subscriptionStatus: 'inactive', isLoading: false });
                    return;
                }

                set({ isLoading: true });

                try {
                    // Check if it's a new day and reset count if needed
                    const currentDate = new Date().toISOString().split('T')[0];
                    if (get().lastResetDate !== currentDate) {
                        get().resetDailyCount();
                    }

                    // Get user subscription from database
                    const { data: subscription, error } = await supabase
                        .from('user_subscriptions')
                        .select(`
              *,
              subscription_plans (*)
            `)
                        .eq('user_id', user.id)
                        .maybeSingle();

                    if (error) throw error;

                    if (subscription && subscription.status === 'active') {
                        set({
                            currentPlan: subscription.subscription_plans,
                            subscriptionStatus: 'active',
                            isLoading: false
                        });
                    } else {
                        set({
                            currentPlan: null,
                            subscriptionStatus: 'inactive',
                            isLoading: false
                        });
                    }
                } catch (error) {
                    console.error('Error loading subscription:', error);
                    set({ subscriptionStatus: 'inactive', isLoading: false });
                }
            },

            incrementMessageCount: () => {
                set(state => ({
                    dailyMessageCount: state.dailyMessageCount + 1
                }));
            },

            canSendMessage: () => {
                const state = get();

                // Premium users can always send messages
                if (state.subscriptionStatus === 'active') {
                    return true;
                }

                // Free users have daily limits
                const currentDate = new Date().toISOString().split('T')[0];
                if (state.lastResetDate !== currentDate) {
                    get().resetDailyCount();
                    return true;
                }

                return state.dailyMessageCount < state.maxFreeMessages;
            },

            simulateSubscription: async (planId: string) => {
                const { user } = useAuthStore.getState();
                if (!user) throw new Error('User not authenticated');

                set({ isLoading: true });

                try {
                    // Get the plan details
                    const { data: plan, error: planError } = await supabase
                        .from('subscription_plans')
                        .select('*')
                        .eq('id', planId)
                        .single();

                    if (planError) throw planError;

                    // Create or update subscription
                    const { error: subError } = await supabase
                        .from('user_subscriptions')
                        .upsert({
                            user_id: user.id,
                            plan_id: planId,
                            status: 'active',
                            current_period_start: new Date().toISOString(),
                            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                        }, {
                            onConflict: 'user_id'
                        });

                    if (subError) throw subError;

                    // Record subscription event
                    await supabase
                        .from('subscription_events')
                        .insert({
                            user_id: user.id,
                            type: 'subscription_created',
                            data: { plan_id: planId, plan_name: plan.name }
                        });

                    // Update local state
                    set({
                        currentPlan: plan,
                        subscriptionStatus: 'active',
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Error simulating subscription:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            simulateCancellation: async () => {
                const { user } = useAuthStore.getState();
                if (!user) throw new Error('User not authenticated');

                set({ isLoading: true });

                try {
                    // Update subscription status
                    const { error } = await supabase
                        .from('user_subscriptions')
                        .update({ status: 'canceled' })
                        .eq('user_id', user.id);

                    if (error) throw error;

                    // Record cancellation event
                    await supabase
                        .from('subscription_events')
                        .insert({
                            user_id: user.id,
                            type: 'subscription_canceled'
                        });

                    // Update local state
                    set({
                        currentPlan: null,
                        subscriptionStatus: 'inactive',
                        isLoading: false
                    });
                } catch (error) {
                    console.error('Error simulating cancellation:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            resetDailyCount: () => {
                const currentDate = new Date().toISOString().split('T')[0];
                set({
                    dailyMessageCount: 0,
                    lastResetDate: currentDate
                });
            }
        }),
        {
            name: 'subscription-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);