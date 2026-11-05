"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { updateGalleryImage } from "@/lib/admin-actions";
import type { GalleryCategory } from "@/types/database";

const categories: { value: GalleryCategory; label: string }[] = [
  { value: "campus", label: "Campus" },
  { value: "classrooms", label: "Classrooms" },
  { value: "activities", label: "Activities" },
  { value: "sports", label: "Sports" },
  { value: "events", label: "Events" },
  { value: "staff", label: "Staff" },
];

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  category: GalleryCategory;
  image_url: string;
};

export default function GalleryEditForm({ item }: { item: GalleryItem }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [category, setCategory] = useState<GalleryCategory>(item.category);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await updateGalleryImage(item.id, formData);
      } catch (err) {
        if (err instanceof Error && err.message === "NEXT_REDIRECT") {
          throw err;
        }
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form action={handleAction} className="space-y-5 max-w-xl">
      <div className="relative w-48 aspect-[5/4] bg-parchment-2 rounded-sm overflow-hidden border border-ink/20 mb-4">
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          sizes="192px"
          className="object-cover"
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-ink/20 rounded-sm px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">
          Description (optional)
        </label>
        <input
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-ink/20 rounded-sm px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1.5">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as GalleryCategory)}
          className="w-full border border-ink/20 rounded-sm px-4 py-3 bg-white"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-700 text-sm font-medium">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-brass disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
        <Link href="/admin/gallery" className="text-sm underline text-charcoal/70">
          Cancel
        </Link>
      </div>
    </form>
  );
}
