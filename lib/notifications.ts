// lib/notifications.ts
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { supabase } from './supabase/client';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notifications = {
  // Register for push notifications
  registerForPushNotifications: async (): Promise<string | null> => {
    if (!Device.isDevice) {
      console.log('Must use physical device for push notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification');
      return null;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);

      // Store the token in Supabase
      const { error } = await supabase
        .from('user_push_tokens')
        .upsert({ token }, { onConflict: 'token' });

      if (error) console.error('Error storing push token:', error);

      return token;
    } catch (error) {
      console.log('Error getting push token:', error);
      return null;
    }
  },

  // Schedule a local notification
  scheduleLocalNotification: async (title: string, body: string, data: any = {}) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
  },

  // Handle received notifications
  setupNotificationHandlers: () => {
    // Listen for notifications received while the app is foregrounded
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification responses
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);

      // Handle navigation based on notification data
      const { data } = response.notification.request.content;
      if (data.conversationId) {
        // Navigate to the conversation
        // You'll need to implement navigation logic here
      }
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  },
};
