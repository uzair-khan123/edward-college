import { createClient } from "@/lib/supabase/server";
import { deleteContactMessage } from "@/lib/admin-actions";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-8">Contact Messages</h1>

      {!messages || messages.length === 0 ? (
        <p className="text-charcoal/60">No messages received yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="border border-ink/10 rounded-sm bg-white p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-medium">{m.name} <span className="text-charcoal/50 font-normal">— {m.email}</span></div>
                  {m.subject && <div className="text-sm text-charcoal/70 mt-1">{m.subject}</div>}
                  <p className="text-sm text-charcoal/70 mt-2 max-w-lg">{m.message}</p>
                  <div className="text-xs text-charcoal/40 mt-2">{new Date(m.created_at).toLocaleString()}</div>
                </div>
                <form action={deleteContactMessage.bind(null, m.id)}>
                  <ConfirmDeleteButton confirmText={`Delete this message from ${m.name}?`} />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
