"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { GalleryCategory } from "@/types/database";

const categories: GalleryCategory[] = ["campus", "classrooms", "activities", "sports", "events", "staff"];

export default function GalleryUploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("campus");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please choose an image to upload.");
      return;
    }
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const ext = file.name.split(".").pop();
    const path = `${category}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("gallery-images").upload(path, file);
    if (uploadError) {
      setError(`Upload failed: ${uploadError.message}`);
      setSaving(false);
      return;
    }
    const { data } = supabase.storage.from("gallery-images").getPublicUrl(path);

    const { error: dbError } = await supabase.from("gallery").insert({
      title,
      description: description || null,
      category,
      image_url: data.publicUrl,
    });

    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.push("/admin/gallery");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1.5">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required
          className="w-full border border-ink/20 rounded-sm px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Description (optional)</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-ink/20 rounded-sm px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)}
          className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Image</label>
        <input type="file" accept="image/png,image/jpeg,image/webp" required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
      </div>

      {error && <p className="text-red-700 text-sm">{error}</p>}

      <button type="submit" disabled={saving} className="btn btn-brass disabled:opacity-60">
        {saving ? "Uploading…" : "Upload Image"}
      </button>
    </form>
  );
}
