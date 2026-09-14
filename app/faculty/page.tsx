import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Faculty" };

export default async function FacultyPage() {
  let faculty: {
    id: string;
    name: string;
    designation: string;
    department: string;
    qualification: string | null;
    photo_url: string | null;
  }[] = [];
  let supabaseConfigured = true;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("faculty")
      .select("id, name, designation, department, qualification, photo_url")
      .order("department");
    faculty = data ?? [];
  } catch {
    supabaseConfigured = false;
  }

  return (
    <div className="wrap py-16">
      <div className="mono text-brass-dim text-xs mb-3 flex items-center gap-2">
        <span className="w-6 h-px bg-current" /> FACULTY & TEACHERS
      </div>
      <h1 className="text-4xl mb-4">Meet our faculty</h1>
      <p className="text-charcoal/70 max-w-2xl mb-12">
        Edward Model College is staffed by experienced subject teachers across the boys&apos; and
        girls&apos; sections. Profiles are managed by the college administration via the admin
        dashboard.
      </p>

      {!supabaseConfigured && (
        <p className="text-charcoal/60 bg-parchment-2 border border-ink/10 rounded-sm p-6">
          Faculty profiles will appear here once Supabase is connected and the admin adds them.
        </p>
      )}

      {supabaseConfigured && faculty.length === 0 && (
        <p className="text-charcoal/60">No faculty profiles added yet.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((f) => (
          <div key={f.id} className="border border-ink/10 rounded-sm p-6 bg-white flex gap-4">
            <span className="seal w-14 h-14 flex-shrink-0 text-ink overflow-hidden">
              {f.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.photo_url} alt={f.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="font-display font-bold text-sm">
                  {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
              )}
            </span>
            <div>
              <div className="mono text-xs text-brass-dim mb-1">{f.designation}</div>
              <h3 className="font-display font-semibold">{f.name}</h3>
              <p className="text-sm text-charcoal/60">{f.department}</p>
              {f.qualification && <p className="text-xs text-charcoal/50 mt-1">{f.qualification}</p>}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-charcoal/50 mt-10 max-w-2xl">
        Note: teachers&apos; personal phone numbers or home addresses are never published here — use
        the official college contact only.
      </p>
    </div>
  );
}
