/**
 * Generated from the Supabase schema. Do not edit by hand.
 *
 *   npm run types:db
 *
 * That script runs `supabase gen types typescript` against the linked
 * project and overwrites this file. It is committed so the repo typechecks
 * without a database connection; regenerate it after every migration.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type CreatorStatus = 'applied' | 'in_review' | 'approved' | 'rejected';
export type PayoutMethod = 'bank' | 'upi';
export type SocialPlatform =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'facebook'
  | 'linkedin'
  | 'x'
  | 'snapchat'
  | 'website';

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: { user_id: string; email: string; created_at: string };
        Insert: { user_id: string; email: string; created_at?: string };
        Update: { user_id?: string; email?: string; created_at?: string };
        Relationships: [];
      };
      categories: {
        Row: { id: string; slug: string; label: string; sort_order: number; is_active: boolean };
        Insert: { id?: string; slug: string; label: string; sort_order?: number; is_active?: boolean };
        Update: { id?: string; slug?: string; label?: string; sort_order?: number; is_active?: boolean };
        Relationships: [];
      };
      content_styles: {
        Row: { id: string; slug: string; label: string; sort_order: number; is_active: boolean };
        Insert: { id?: string; slug: string; label: string; sort_order?: number; is_active?: boolean };
        Update: { id?: string; slug?: string; label?: string; sort_order?: number; is_active?: boolean };
        Relationships: [];
      };
      creators: {
        Row: {
          id: string;
          auth_user_id: string;
          full_name: string;
          city: string;
          phone: string;
          email: string;
          category_id: string | null;
          content_styles: string[];
          languages: string[];
          shoot_setup: string;
          turnaround: string;
          rate_band: string;
          bio: string;
          availability: string;
          status: CreatorStatus;
          created_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          full_name: string;
          city: string;
          phone: string;
          email: string;
          category_id?: string | null;
          content_styles?: string[];
          languages?: string[];
          shoot_setup: string;
          turnaround: string;
          rate_band: string;
          bio?: string;
          availability?: string;
          status?: CreatorStatus;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          full_name?: string;
          city?: string;
          phone?: string;
          email?: string;
          category_id?: string | null;
          content_styles?: string[];
          languages?: string[];
          shoot_setup?: string;
          turnaround?: string;
          rate_band?: string;
          bio?: string;
          availability?: string;
          status?: CreatorStatus;
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Relationships: [];
      };
      creator_social_profiles: {
        Row: {
          id: string;
          creator_id: string;
          platform: SocialPlatform;
          handle: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          platform: SocialPlatform;
          handle: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          platform?: SocialPlatform;
          handle?: string;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      creator_sample_links: {
        Row: { id: string; creator_id: string; url: string; created_at: string };
        Insert: { id?: string; creator_id: string; url: string; created_at?: string };
        Update: { id?: string; creator_id?: string; url?: string; created_at?: string };
        Relationships: [];
      };
      creator_payout_details: {
        Row: {
          id: string;
          creator_id: string;
          method: PayoutMethod;
          account_holder_name: string | null;
          account_number: string | null;
          ifsc: string | null;
          upi_id: string | null;
          pan_number: string;
          verified: boolean;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          method: PayoutMethod;
          account_holder_name?: string | null;
          account_number?: string | null;
          ifsc?: string | null;
          upi_id?: string | null;
          pan_number: string;
          verified?: boolean;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          method?: PayoutMethod;
          account_holder_name?: string | null;
          account_number?: string | null;
          ifsc?: string | null;
          upi_id?: string | null;
          pan_number?: string;
          verified?: boolean;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_notes: {
        Row: { id: string; creator_id: string; author: string; note: string; created_at: string };
        Insert: { id?: string; creator_id: string; author: string; note: string; created_at?: string };
        Update: { id?: string; creator_id?: string; author?: string; note?: string; created_at?: string };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      creator_status: CreatorStatus;
      payout_method: PayoutMethod;
      social_platform: SocialPlatform;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
