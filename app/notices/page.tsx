import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { NoticeCategory } from "@/types/database";

export const metadata: Metadata = { title: "Notices & Announcements" };

const categories: { value: NoticeCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "admissions", label: "Admissions" },
  { value: "exams", label: "Exams" },
  { value: "events", label: "Events" },
  { value: "holiday", label: "Holiday" },
];

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category ?? "all";

  let notices: { id: string; title: string; description: string; category: string; created_at: string }[] = [];
  let supabaseConfigured = true;
  try {
    const supabase = createClient();
    let query = supabase
      .from("notices")
      .select("id, title, description, category, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (activeCategory !== "all") {
      query = query.eq("category", activeCategory);
    }
    const { data } = await query;
    notices = data ?? [];
  } catch {
    supabaseConfigured = false;
  }

  return (
    <div className="wrap py-16">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> NOTICES
      </div>
      <h1 className="text-4xl mb-8">Notices & Announcements</h1>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <Link
            key={c.value}
            href={c.value === "all" ? "/notices" : `/notices?category=${c.value}`}
            className={`mono text-xs px-4 py-2 rounded-full border ${
              activeCategory === c.value
                ? "bg-ink text-cream border-ink"
                : "border-ink/20 text-ink hover:border-ink"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {!supabaseConfigured && (
        <p className="text-charcoal/60 bg-parchment-2 border border-ink/10 rounded-sm p-6">
          Notices will appear here once Supabase is connected (see .env.local setup in the README).
        </p>
      )}

      {supabaseConfigured && notices.length === 0 && (
        <p className="text-charcoal/60">No notices in this category yet.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {notices.map((n) => (
          <article key={n.id} className="border border-ink/10 rounded-sm p-6 bg-white">
            <div className="mono text-brass-dim text-xs mb-2">{n.category}</div>
            <h2 className="font-display font-semibold text-lg mb-2">{n.title}</h2>
            <p className="text-charcoal/75 text-sm mb-3">{n.description}</p>
            <p className="text-xs text-charcoal/50">{new Date(n.created_at).toLocaleDateString()}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
