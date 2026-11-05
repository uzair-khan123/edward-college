"use client";

import { useState, useTransition } from "react";
import { createGalleryImage } from "@/lib/admin-actions";
import type { GalleryCategory } from "@/types/database";

const categories: { value: GalleryCategory; label: string }[] = [
  { value: "campus", label: "Campus" },
  { value: "classrooms", label: "Classrooms" },
  { value: "activities", label: "Activities" },
  { value: "sports", label: "Sports" },
  { value: "events", label: "Events" },
  { value: "staff", label: "Staff" },
];

export default function GalleryUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("campus");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  async function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createGalleryImage(formData);
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
          placeholder="e.g. Science Lab Session, Annual Sports Gala"
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
          placeholder="Brief description of the image"
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

      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1.5">
          Image File
        </label>
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Upload preview"
            className="w-48 aspect-[5/4] object-cover rounded-sm mb-3 border border-ink/20"
          />
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
          onChange={handleFileChange}
          className="text-sm"
        />
        <p className="text-xs text-charcoal/50 mt-1">
          JPG, PNG or WebP (max 10MB).
        </p>
      </div>

      {error && <p className="text-red-700 text-sm font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-brass disabled:opacity-60"
      >
        {isPending ? "Uploading…" : "Upload Image"}
      </button>
    </form>
  );
}
