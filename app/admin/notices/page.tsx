import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteNotice, toggleNoticePublished } from "@/lib/admin-actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";

export default async function AdminNoticesPage() {
  const supabase = createClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("id, title, category, published, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-semibold">Notices</h1>
        <Link href="/admin/notices/new" className="btn btn-brass">
          + New Notice
        </Link>
      </div>

      {!notices || notices.length === 0 ? (
        <p className="text-charcoal/60">No notices yet. Create the first one.</p>
      ) : (
        <div className="border border-ink/10 rounded-sm bg-white divide-y divide-ink/10">
          {notices.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-xs text-charcoal/50 mono mt-1">
                  {n.category} · {new Date(n.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <form action={toggleNoticePublished.bind(null, n.id, !n.published)}>
                  <button
                    type="submit"
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      n.published ? "border-forest text-forest" : "border-ink/30 text-charcoal/60"
                    }`}
                  >
                    {n.published ? "Published" : "Draft"}
                  </button>
                </form>
                <Link href={`/admin/notices/${n.id}/edit`} className="text-sm underline">
                  Edit
                </Link>
                <form action={deleteNotice.bind(null, n.id)}>
                  <ConfirmDeleteButton confirmText={`Delete notice "${n.title}"? This can't be undone.`} />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
