import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  let items: { id: string; title: string; image_url: string; category: any }[] = [];
  let supabaseConfigured = true;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("gallery")
      .select("id, title, image_url, category")
      .order("created_at", { ascending: false });
    items = data ?? [];
  } catch {
    supabaseConfigured = false;
  }

  return (
    <div className="wrap py-16">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> GALLERY
      </div>
      <h1 className="text-4xl mb-4">A look inside Edward Model College</h1>
      <p className="text-charcoal/70 max-w-2xl mb-10">
        Campus, classrooms, events, sports, student life and our faculty — a glimpse of everyday life
        at Edward Model College, Balambat, Timergara.
      </p>

      {!supabaseConfigured ? (
        <p className="text-charcoal/60 bg-parchment-2 border border-ink/10 rounded-sm p-6">
          Gallery images will appear here once Supabase is connected and images are uploaded from the
          admin dashboard.
        </p>
      ) : (
        <GalleryGrid items={items} />
      )}
    </div>
  );
}
