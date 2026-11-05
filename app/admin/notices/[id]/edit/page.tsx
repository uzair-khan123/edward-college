import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateNotice } from "@/lib/admin-actions";
import NoticeForm from "@/components/NoticeForm";

export default async function EditNoticePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: notice } = await supabase
    .from("notices")
    .select("title, description, category, published")
    .eq("id", params.id)
    .single();

  if (!notice) notFound();

  const action = updateNotice.bind(null, params.id);

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold mb-8">Edit Notice</h1>
      <NoticeForm action={action} defaultValues={notice} />
    </div>
  );
}
