"use client";

import { useState } from "react";
import type { GalleryCategory } from "@/types/database";

type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  category: GalleryCategory;
};

const filters: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "campus", label: "College Campus" },
  { value: "classrooms", label: "Classrooms" },
  { value: "events", label: "Events & Functions" },
  { value: "sports", label: "Sports" },
  { value: "activities", label: "Students Activities" },
  { value: "staff", label: "Teachers & Staff" },
];

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryCategory | "all">("all");
  const visible = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`mono text-xs px-4 py-2 rounded-full border transition-colors ${
              active === f.value ? "bg-ink text-cream border-ink" : "border-ink/20 hover:border-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-charcoal/60">No images in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((item) => (
            <figure key={item.id} className="rounded-sm overflow-hidden border border-ink/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.title} loading="lazy" className="w-full aspect-[5/4] object-cover" />
              <figcaption className="p-3 text-sm">{item.title}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
