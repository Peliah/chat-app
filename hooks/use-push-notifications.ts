import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// Configure notification handling
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export function usePushNotifications() {
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user) return;

        registerForPushNotifications();

        // Listen to incoming notifications while app is foregrounded
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            // Handle notification
            console.log('Notification received:', notification);
        });

        return () => {
            subscription.remove();
        };
    }, [user]);

    async function registerForPushNotifications() {
        if (!Device.isDevice) {
            alert('Must use physical device for Push Notifications');
            return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;

        // Save the push token to the user's profile
        const { error } = await supabase
            .from('profiles')
            .update({ expo_push_token: token })
            .eq('id', user.id);

        if (error) {
            console.error('Error saving push token:', error);
        }
    }

    // Function to send a push notification
    async function sendPushNotification(expoPushToken: string, title: string, body: string) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title,
            body,
            data: { someData: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    return { sendPushNotification };
}