import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GalleryEditForm from "@/components/GalleryEditForm";
import type { GalleryCategory } from "@/types/database";

export default async function EditGalleryPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: item } = await supabase
    .from("gallery")
    .select("id, title, description, category, image_url")
    .eq("id", params.id)
    .single();

  if (!item) notFound();

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-8">Edit Gallery Image</h1>
      <GalleryEditForm item={{ ...item, category: item.category as GalleryCategory }} />
    </div>
  );
}
