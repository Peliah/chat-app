export interface Database {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string
            email: string
            username: string | null
            avatar_url: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id: string
            email: string
            username?: string | null
            avatar_url?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            email?: string
            username?: string | null
            avatar_url?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        conversations: {
          Row: {
            id: string
            name: string | null
            is_group: boolean
            created_by: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            name?: string | null
            is_group?: boolean
            created_by: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            name?: string | null
            is_group?: boolean
            created_by?: string
            created_at?: string
            updated_at?: string
          }
        }
        conversation_members: {
          Row: {
            id: string
            conversation_id: string
            user_id: string
            joined_at: string
          }
          Insert: {
            id?: string
            conversation_id: string
            user_id: string
            joined_at?: string
          }
          Update: {
            id?: string
            conversation_id?: string
            user_id?: string
            joined_at?: string
          }
        }
        messages: {
          Row: {
            id: string
            conversation_id: string
            user_id: string
            content: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            conversation_id: string
            user_id: string
            content: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            conversation_id?: string
            user_id?: string
            content?: string
            created_at?: string
            updated_at?: string
          }
        }
        subscriptions: {
          Row: {
            id: string
            user_id: string
            status: 'active' | 'canceled' | 'past_due'
            current_period_end: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            status?: 'active' | 'canceled' | 'past_due'
            current_period_end: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            status?: 'active' | 'canceled' | 'past_due'
            current_period_end?: string
            created_at?: string
            updated_at?: string
          }
        }
      }
      Views: {
        [_ in never]: never
      }
      Functions: {
        [_ in never]: never
      }
      Enums: {
        [_ in never]: never
      }
    }
  }