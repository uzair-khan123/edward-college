import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteFaculty } from "@/lib/admin-actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";

export default async function AdminFacultyPage() {
  const supabase = createClient();
  const { data: faculty } = await supabase
    .from("faculty")
    .select("id, name, designation, department, photo_url")
    .order("department");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-semibold">Faculty</h1>
        <Link href="/admin/faculty/new" className="btn btn-brass">
          + Add Faculty
        </Link>
      </div>

      {!faculty || faculty.length === 0 ? (
        <p className="text-charcoal/60">No faculty profiles yet.</p>
      ) : (
        <div className="border border-ink/10 rounded-sm bg-white divide-y divide-ink/10">
          {faculty.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                {f.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.photo_url} alt={f.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-parchment-2 flex items-center justify-center text-xs">
                    {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                )}
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-charcoal/50">{f.designation} · {f.department}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <Link href={`/admin/faculty/${f.id}/edit`} className="text-sm underline">Edit</Link>
                <form action={deleteFaculty.bind(null, f.id)}>
                  <ConfirmDeleteButton confirmText={`Remove ${f.name} from the faculty list?`} />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
