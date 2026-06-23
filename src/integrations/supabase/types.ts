export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          name: string
          note: string | null
          phone: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          name: string
          note?: string | null
          phone: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          name?: string
          note?: string | null
          phone?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration: string | null
          ends_at: string | null
          fee: string | null
          gradient: string | null
          id: string
          image_url: string | null
          instructor: string | null
          is_featured: boolean
          is_online: boolean
          is_published: boolean
          kind: string
          location: string | null
          region: string | null
          spots_left: number | null
          starts_at: string | null
          tags: string[]
          title: string
          total_spots: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          ends_at?: string | null
          fee?: string | null
          gradient?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          is_featured?: boolean
          is_online?: boolean
          is_published?: boolean
          kind?: string
          location?: string | null
          region?: string | null
          spots_left?: number | null
          starts_at?: string | null
          tags?: string[]
          title: string
          total_spots?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          ends_at?: string | null
          fee?: string | null
          gradient?: string | null
          id?: string
          image_url?: string | null
          instructor?: string | null
          is_featured?: boolean
          is_online?: boolean
          is_published?: boolean
          kind?: string
          location?: string | null
          region?: string | null
          spots_left?: number | null
          starts_at?: string | null
          tags?: string[]
          title?: string
          total_spots?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      instructor_courses: {
        Row: {
          age_range: string | null
          course_image_url: string | null
          cover_url: string | null
          created_at: string
          description: string
          id: string
          is_published: boolean
          level: string
          location_address: string | null
          notes: string | null
          online_link: string | null
          price: string
          region: string | null
          schedule: string
          service_type: string
          session_info: string | null
          sessions_count: number | null
          sort_order: number
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          course_image_url?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          level?: string
          location_address?: string | null
          notes?: string | null
          online_link?: string | null
          price?: string
          region?: string | null
          schedule?: string
          service_type?: string
          session_info?: string | null
          sessions_count?: number | null
          sort_order?: number
          teacher_id: string
          title?: string
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          course_image_url?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          level?: string
          location_address?: string | null
          notes?: string | null
          online_link?: string | null
          price?: string
          region?: string | null
          schedule?: string
          service_type?: string
          session_info?: string | null
          sessions_count?: number | null
          sort_order?: number
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_media: {
        Row: {
          caption: string
          created_at: string
          id: string
          kind: string
          offset_x: number
          offset_y: number
          scale: number
          sort_order: number
          teacher_id: string
          url: string
        }
        Insert: {
          caption?: string
          created_at?: string
          id?: string
          kind?: string
          offset_x?: number
          offset_y?: number
          scale?: number
          sort_order?: number
          teacher_id: string
          url: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          kind?: string
          offset_x?: number
          offset_y?: number
          scale?: number
          sort_order?: number
          teacher_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_media_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      master_profiles: {
        Row: {
          bio: string
          created_at: string
          cultural_tags: string[]
          dance_dna_type: string
          dance_intro: string
          id: string
          is_draft: boolean
          is_published: boolean
          logo_url: string | null
          motto: string
          profile_images: string[]
          studio_images: string[]
          updated_at: string
          user_id: string
          video_links: string[]
        }
        Insert: {
          bio?: string
          created_at?: string
          cultural_tags?: string[]
          dance_dna_type?: string
          dance_intro?: string
          id?: string
          is_draft?: boolean
          is_published?: boolean
          logo_url?: string | null
          motto?: string
          profile_images?: string[]
          studio_images?: string[]
          updated_at?: string
          user_id: string
          video_links?: string[]
        }
        Update: {
          bio?: string
          created_at?: string
          cultural_tags?: string[]
          dance_dna_type?: string
          dance_intro?: string
          id?: string
          is_draft?: boolean
          is_published?: boolean
          logo_url?: string | null
          motto?: string
          profile_images?: string[]
          studio_images?: string[]
          updated_at?: string
          user_id?: string
          video_links?: string[]
        }
        Relationships: []
      }
      teacher_profiles: {
        Row: {
          agreement_signed_at: string | null
          avatar_url: string | null
          bio: string
          created_at: string
          credentials: string[]
          culture_body: string
          culture_title: string
          dance_styles: string[]
          hero_image_url: string | null
          id: string
          instagram_url: string | null
          is_approved: boolean
          journey_timeline: Json
          languages: string[]
          name: string
          name_en: string
          next_session: string
          price_from: string
          region: string
          slug: string | null
          specialty: string
          tagline: string
          updated_at: string
          user_id: string
          website_url: string | null
          years_experience: number | null
          youtube_url: string | null
        }
        Insert: {
          agreement_signed_at?: string | null
          avatar_url?: string | null
          bio?: string
          created_at?: string
          credentials?: string[]
          culture_body?: string
          culture_title?: string
          dance_styles?: string[]
          hero_image_url?: string | null
          id?: string
          instagram_url?: string | null
          is_approved?: boolean
          journey_timeline?: Json
          languages?: string[]
          name?: string
          name_en?: string
          next_session?: string
          price_from?: string
          region?: string
          slug?: string | null
          specialty?: string
          tagline?: string
          updated_at?: string
          user_id: string
          website_url?: string | null
          years_experience?: number | null
          youtube_url?: string | null
        }
        Update: {
          agreement_signed_at?: string | null
          avatar_url?: string | null
          bio?: string
          created_at?: string
          credentials?: string[]
          culture_body?: string
          culture_title?: string
          dance_styles?: string[]
          hero_image_url?: string | null
          id?: string
          instagram_url?: string | null
          is_approved?: boolean
          journey_timeline?: Json
          languages?: string[]
          name?: string
          name_en?: string
          next_session?: string
          price_from?: string
          region?: string
          slug?: string | null
          specialty?: string
          tagline?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
          years_experience?: number | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher"],
    },
  },
} as const
