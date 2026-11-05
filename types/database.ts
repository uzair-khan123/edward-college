// Hand-written types matching the Supabase schema.
// After your database is final, you can replace this file with generated types:
//   npx supabase gen types typescript --project-id YOUR-PROJECT-REF > types/database.ts

export type NoticeCategory = "general" | "admissions" | "exams" | "events" | "holiday";
export type GalleryCategory = "campus" | "classrooms" | "activities" | "sports" | "events" | "staff";
export type AdmissionStatus = "pending" | "contacted" | "accepted" | "rejected";
export type UserRole = "admin" | "editor" | "viewer";

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
};

type NoticeRow = {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type FacultyRow = {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string | null;
  photo_url: string | null;
  bio: string | null;
  created_at: string;
};

type GalleryRow = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: GalleryCategory;
  created_at: string;
};

type AdmissionRow = {
  id: string;
  student_name: string;
  email: string;
  phone: string;
  class: string;
  message: string | null;
  status: AdmissionStatus;
  created_at: string;
};

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      notices: {
        Row: NoticeRow;
        Insert: {
          title: string;
          description: string;
          id?: string;
          category?: NoticeCategory;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<NoticeRow>;
        Relationships: [];
      };
      faculty: {
        Row: FacultyRow;
        Insert: {
          name: string;
          designation: string;
          department: string;
          id?: string;
          qualification?: string | null;
          photo_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: Partial<FacultyRow>;
        Relationships: [];
      };
      gallery: {
        Row: GalleryRow;
        Insert: {
          title: string;
          image_url: string;
          id?: string;
          description?: string | null;
          category?: GalleryCategory;
          created_at?: string;
        };
        Update: Partial<GalleryRow>;
        Relationships: [];
      };
      admissions: {
        Row: AdmissionRow;
        Insert: {
          student_name: string;
          email: string;
          phone: string;
          class: string;
          id?: string;
          message?: string | null;
          status?: AdmissionStatus;
          created_at?: string;
        };
        Update: Partial<AdmissionRow>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: {
          name: string;
          email: string;
          message: string;
          id?: string;
          subject?: string | null;
          created_at?: string;
        };
        Update: Partial<ContactMessageRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};