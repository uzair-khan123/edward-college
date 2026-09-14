import { createClient } from "@/lib/supabase/server";
import { deleteAdmission } from "@/lib/admin-actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";
import AdmissionStatusSelect from "@/components/AdmissionStatusSelect";

export default async function AdminAdmissionsPage() {
  const supabase = createClient();
  const { data: admissions } = await supabase
    .from("admissions")
    .select("id, student_name, email, phone, class, message, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-8">Admission Inquiries</h1>

      {!admissions || admissions.length === 0 ? (
        <p className="text-charcoal/60">No inquiries submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {admissions.map((a) => (
            <div key={a.id} className="border border-ink/10 rounded-sm bg-white p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-medium">{a.student_name}</div>
                  <div className="text-sm text-charcoal/60">
                    {a.email} · {a.phone} · {a.class}
                  </div>
                  {a.message && <p className="text-sm text-charcoal/70 mt-2 max-w-lg">{a.message}</p>}
                  <div className="text-xs text-charcoal/40 mt-2">
                    {new Date(a.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <AdmissionStatusSelect id={a.id} current={a.status} />
                  <form action={deleteAdmission.bind(null, a.id)}>
                    <ConfirmDeleteButton confirmText={`Delete this inquiry from ${a.student_name}?`} />
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
