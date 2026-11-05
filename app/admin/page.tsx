import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const [notices, faculty, gallery, admissions, messages] = await Promise.all([
    supabase.from("notices").select("id", { count: "exact", head: true }),
    supabase.from("faculty").select("id", { count: "exact", head: true }),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
    supabase.from("admissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Notices", value: notices.count ?? 0, href: "/admin/notices" },
    { label: "Faculty profiles", value: faculty.count ?? 0, href: "/admin/faculty" },
    { label: "Gallery images", value: gallery.count ?? 0, href: "/admin/gallery" },
    { label: "Pending admissions", value: admissions.count ?? 0, href: "/admin/admissions" },
    { label: "Contact messages", value: messages.count ?? 0, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-8">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <a key={c.label} href={c.href} className="border border-ink/10 rounded-sm p-6 bg-white hover:border-ink/30">
            <div className="text-3xl font-display font-bold">{c.value}</div>
            <div className="text-sm text-charcoal/60 mt-1">{c.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
