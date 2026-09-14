// Hand-written to match supabase/migrations/0001_init.sql.
// Once your Supabase project exists, regenerate the real thing with:
//   npx supabase gen types typescript --project-id YOUR-PROJECT-REF > types/database.ts
// and this file can be replaced entirely.

export type NoticeCategory = "general" | "admissions" | "exams" | "events" | "holiday";
export type GalleryCategory = "campus" | "classrooms" | "activities" | "sports" | "events" | "staff";
export type AdmissionStatus = "pending" | "contacted" | "accepted" | "rejected";
export type UserRole = "admin" | "editor" | "viewer";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      notices: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: NoticeCategory;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notices"]["Row"]> & { title: string; description: string };
        Update: Partial<Database["public"]["Tables"]["notices"]["Row"]>;
      };
      faculty: {
        Row: {
          id: string;
          name: string;
          designation: string;
          department: string;
          qualification: string | null;
          photo_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["faculty"]["Row"]> & {
          name: string;
          designation: string;
          department: string;
        };
        Update: Partial<Database["public"]["Tables"]["faculty"]["Row"]>;
      };
      gallery: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          category: GalleryCategory;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery"]["Row"]> & { title: string; image_url: string };
        Update: Partial<Database["public"]["Tables"]["gallery"]["Row"]>;
      };
      admissions: {
        Row: {
          id: string;
          student_name: string;
          email: string;
          phone: string;
          class: string;
          message: string | null;
          status: AdmissionStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admissions"]["Row"]> & {
          student_name: string;
          email: string;
          phone: string;
          class: string;
        };
        Update: Partial<Database["public"]["Tables"]["admissions"]["Row"]>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]> & {
          name: string;
          email: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Row"]>;
      };
    };
  };
}
