import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { deleteGalleryImage } from "@/lib/admin-actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";

export default async function AdminGalleryPage() {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("gallery")
    .select("id, title, image_url, category")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-semibold">Gallery</h1>
        <Link href="/admin/gallery/new" className="btn btn-brass">
          + Upload Image
        </Link>
      </div>

      {!items || items.length === 0 ? (
        <p className="text-charcoal/60">No images uploaded yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border border-ink/10 rounded-sm bg-white overflow-hidden">
              <div className="relative w-full aspect-[5/4] bg-parchment-2">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-charcoal/50 capitalize">{item.category}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link href={`/admin/gallery/${item.id}/edit`} className="text-sm underline">
                    Edit
                  </Link>
                  <form action={deleteGalleryImage.bind(null, item.id)}>
                    <ConfirmDeleteButton confirmText={`Delete "${item.title}" from the gallery?`} />
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
