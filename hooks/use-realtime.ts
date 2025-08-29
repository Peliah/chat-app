// hooks/use-realtime.ts
import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase/client';

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface RealtimeSubscriptionOptions {
  table: string;
  event: RealtimeEvent;
  filter?: string;
  schema?: string;
}

export function useRealtime(
  options: RealtimeSubscriptionOptions,
  callback: (payload: any) => void
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Create a channel for real-time updates
    const channelName = `realtime:${options.table}:${options.event}`;
    channelRef.current = supabase.channel(channelName);

    // Set up the subscription based on options
    if (options.filter) {
      channelRef.current = channelRef.current.on(
        'postgres_changes' as any,
        {
          event: options.event,
          schema: options.schema || 'public',
          table: options.table,
          filter: options.filter,
        },
        callback
      );
    } else {
      channelRef.current = channelRef.current.on(
        'postgres_changes' as any,
        {
          event: options.event,
          schema: options.schema || 'public',
          table: options.table,
        },
        callback
      );
    }

    // Subscribe to the channel
    channelRef.current.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${options.table} ${options.event} events`);
      }
    });

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [options.table, options.event, options.filter, options.schema, callback]);

  return {
    unsubscribe: () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    },
  };
}