export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string
          duration: number | null
          exercise_id: string | null
          id: string
          name: string
          notes: string | null
          reps: number | null
          sets: number | null
          updated_at: string
          username: string
          weight: string | null
          workout_id: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          exercise_id?: string | null
          id?: string
          name: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          updated_at?: string
          username?: string
          weight?: string | null
          workout_id?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          exercise_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          reps?: number | null
          sets?: number | null
          updated_at?: string
          username?: string
          weight?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_username_fkey"
            columns: ["username"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          kind: string
          message: string | null
          priority: number
          status: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          message?: string | null
          priority?: number
          status?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          message?: string | null
          priority?: number
          status?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_username_fkey"
            columns: ["username"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      pricing: {
        Row: {
          currency: string
          description: string | null
          id: string
          interval: string | null
          metadata: Json | null
          price: number | null
          title: string
          trial_period: number | null
        }
        Insert: {
          currency?: string
          description?: string | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price?: number | null
          title: string
          trial_period?: number | null
        }
        Update: {
          currency?: string
          description?: string | null
          id?: string
          interval?: string | null
          metadata?: Json | null
          price?: number | null
          title?: string
          trial_period?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          customer_id: string | null
          department: string | null
          display_name: string | null
          email: string[] | null
          first_name: string | null
          id: string
          last_name: string | null
          metadata: Json | null
          middle_name: string | null
          name_prefix: string | null
          name_suffix: string | null
          phone: string[] | null
          role: string | null
          socials: string[] | null
          status: string | null
          titles: string[] | null
          updated_at: string
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          customer_id?: string | null
          department?: string | null
          display_name?: string | null
          email?: string[] | null
          first_name?: string | null
          id: string
          last_name?: string | null
          metadata?: Json | null
          middle_name?: string | null
          name_prefix?: string | null
          name_suffix?: string | null
          phone?: string[] | null
          role?: string | null
          socials?: string[] | null
          status?: string | null
          titles?: string[] | null
          updated_at?: string
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          customer_id?: string | null
          department?: string | null
          display_name?: string | null
          email?: string[] | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          middle_name?: string | null
          name_prefix?: string | null
          name_suffix?: string | null
          phone?: string[] | null
          role?: string | null
          socials?: string[] | null
          status?: string | null
          titles?: string[] | null
          updated_at?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          public: boolean
          subscribers: string[] | null
          tags: string[] | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          public?: boolean
          subscribers?: string[] | null
          tags?: string[] | null
          updated_at?: string
          username?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          public?: boolean
          subscribers?: string[] | null
          tags?: string[] | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_username_fkey"
            columns: ["username"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string
          day_of_week: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          notes: string | null
          plan_id: string | null
          tags: string[] | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          day_of_week?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          plan_id?: string | null
          tags?: string[] | null
          updated_at?: string
          username?: string
        }
        Update: {
          created_at?: string
          day_of_week?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          plan_id?: string | null
          tags?: string[] | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_username_fkey"
            columns: ["username"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_user_by_email: {
        Args: { email_to_find: string }
        Returns: string
      }
      find_username_by_email: {
        Args: { email_to_find: string }
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_email_prefix: {
        Args: { email: string }
        Returns: string
      }
      get_user_id_by_username: {
        Args: { username_input: string }
        Returns: string
      }
      username: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
