import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export function useSafeNavigation() {
  const router = useRouter();
  
  const navigateSafely = useCallback((route: string) => {
    setTimeout(() => {
      router.replace(route);
    }, 100);
  }, [router]);

  return { navigateSafely };
}