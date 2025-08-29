import { colors } from '@/lib/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { Tabs, useRouter } from 'expo-router';
import { HomeIcon, MessageCircle } from 'lucide-react-native';

export default function TabsLayout() {
  const { signOut } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          borderTopWidth: 2,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 2,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.text.primary,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'My Chats',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}